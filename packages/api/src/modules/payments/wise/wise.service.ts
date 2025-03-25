import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { SupabaseService } from '../../../config/supabase.config';

@Injectable()
export class WiseService {
  private readonly logger = new Logger(WiseService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly profileId: string;
  private readonly webhookSecret: string;

  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    this.apiUrl = this.configService.get<string>('WISE_API_URL', 'https://api.wise.com');
    this.apiKey = this.configService.get<string>('WISE_API_KEY', '');
    this.profileId = this.configService.get<string>('WISE_PROFILE_ID', '');
    this.webhookSecret = this.configService.get<string>('WISE_WEBHOOK_SECRET', '');
  }

  /**
   * Obtém os detalhes da conta bancária USD da Wise
   */
  async getUsdAccountDetails() {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v1/accounts?profileId=${this.profileId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      // Filtra para obter apenas a conta USD
      const usdAccount = response.data.find(
        (account) => account.currency === 'USD',
      );

      if (!usdAccount) {
        throw new Error('Conta USD não encontrada');
      }

      // Obtém os detalhes bancários da conta USD
      const detailsResponse = await axios.get(
        `${this.apiUrl}/v1/accounts/${usdAccount.id}/account-details`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return detailsResponse.data;
    } catch (error) {
      this.logger.error(`Erro ao obter detalhes da conta USD: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gera um código de referência único para uma reserva
   * @param reservationId ID da reserva
   */
  generateReferenceCode(reservationId: string): string {
    // Formato: RPA-XXXXX onde XXXXX é um código único baseado no reservationId
    const uniquePart = reservationId.substring(0, 5).toUpperCase();
    return `RPA-${uniquePart}`;
  }

  /**
   * Processa o webhook de pagamento recebido da Wise
   * @param payload Payload do webhook
   * @param signature Assinatura do webhook
   */
  async processPaymentWebhook(payload: any, signature: string) {
    // Verifica a assinatura do webhook
    if (!this.verifyWebhookSignature(payload, signature)) {
      throw new Error('Assinatura do webhook inválida');
    }

    // Verifica se é um evento de crédito em conta
    if (payload.event_type !== 'balances#credit') {
      this.logger.log(`Ignorando evento não relacionado a crédito: ${payload.event_type}`);
      return { message: 'Evento ignorado' };
    }

    try {
      // Extrai o código de referência do campo memo/reference da transação
      const referenceCode = this.extractReferenceCode(payload.data.reference || '');
      
      if (!referenceCode) {
        this.logger.warn('Código de referência não encontrado no pagamento');
        // Salva o pagamento como não reconciliado para processamento manual posterior
        await this.saveUnreconciliedPayment(payload);
        return { message: 'Pagamento salvo como não reconciliado' };
      }

      // Busca a reserva pelo código de referência
      const reservation = await this.findReservationByReferenceCode(referenceCode);
      
      if (!reservation) {
        this.logger.warn(`Reserva não encontrada para o código: ${referenceCode}`);
        await this.saveUnreconciliedPayment(payload);
        return { message: 'Pagamento salvo como não reconciliado' };
      }

      // Registra o pagamento no sistema
      await this.registerPayment({
        reservationId: reservation.id,
        amount: payload.data.amount.value,
        currency: payload.data.amount.currency,
        referenceCode: referenceCode,
        transactionId: payload.data.transaction_id,
        paymentDate: new Date(payload.data.occurred_at),
        paymentMethod: 'wise',
        status: 'completed',
        metadata: payload,
      });

      // Atualiza o status da reserva
      await this.updateReservationStatus(reservation.id, 'confirmed');

      return {
        message: 'Pagamento processado com sucesso',
        reservationId: reservation.id,
      };
    } catch (error) {
      this.logger.error(`Erro ao processar webhook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extrai o código de referência do texto de referência/memo
   * @param reference Texto de referência/memo
   */
  private extractReferenceCode(reference: string): string | null {
    // Procura por um padrão RPA-XXXXX no texto
    const match = reference.match(/RPA-[A-Z0-9]{5}/);
    return match ? match[0] : null;
  }

  /**
   * Verifica a assinatura do webhook da Wise
   * @param payload Payload do webhook
   * @param signature Assinatura do webhook
   */
  private verifyWebhookSignature(payload: any, signature: string): boolean {
    try {
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      const calculatedSignature = hmac
        .update(JSON.stringify(payload))
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(calculatedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch (error) {
      this.logger.error(`Erro ao verificar assinatura: ${error.message}`);
      return false;
    }
  }

  /**
   * Busca uma reserva pelo código de referência
   * @param referenceCode Código de referência
   */
  private async findReservationByReferenceCode(referenceCode: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('reference_code', referenceCode)
      .single();

    if (error) {
      this.logger.error(`Erro ao buscar reserva: ${error.message}`);
      return null;
    }

    return data;
  }

  /**
   * Salva um pagamento não reconciliado para processamento manual
   * @param paymentData Dados do pagamento
   */
  private async saveUnreconciliedPayment(paymentData: any) {
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('unreconciled_payments')
      .insert({
        payment_data: paymentData,
        payment_method: 'wise',
        amount: paymentData.data.amount.value,
        currency: paymentData.data.amount.currency,
        transaction_id: paymentData.data.transaction_id,
        payment_date: new Date(paymentData.data.occurred_at),
        reference: paymentData.data.reference || '',
        status: 'pending_reconciliation',
      });

    if (error) {
      this.logger.error(`Erro ao salvar pagamento não reconciliado: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registra um pagamento no sistema
   * @param paymentData Dados do pagamento
   */
  private async registerPayment(paymentData: any) {
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('payments')
      .insert({
        reservation_id: paymentData.reservationId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        reference_code: paymentData.referenceCode,
        transaction_id: paymentData.transactionId,
        payment_date: paymentData.paymentDate,
        payment_method: paymentData.paymentMethod,
        status: paymentData.status,
        metadata: paymentData.metadata,
      });

    if (error) {
      this.logger.error(`Erro ao registrar pagamento: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza o status de uma reserva
   * @param reservationId ID da reserva
   * @param status Novo status
   */
  private async updateReservationStatus(reservationId: string, status: string) {
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('reservations')
      .update({ status: status, updated_at: new Date() })
      .eq('id', reservationId);

    if (error) {
      this.logger.error(`Erro ao atualizar status da reserva: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lista as transações recentes na conta Wise
   * @param intervalDays Número de dias para buscar (padrão: 7)
   */
  async listRecentTransactions(intervalDays: number = 7) {
    try {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - intervalDays);
      
      const response = await axios.get(
        `${this.apiUrl}/v1/transfers?profileId=${this.profileId}&createdDateStart=${startDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao listar transações: ${error.message}`);
      throw error;
    }
  }

  /**
   * Inicia uma transferência de USD para BRL (para conta no Brasil)
   * @param amount Valor em USD
   * @param targetAccountId ID da conta destino no Brasil
   */
  async initiateTransferToBrazil(amount: number, targetAccountId: string) {
    try {
      // 1. Obter cotação
      const quoteResponse = await axios.post(
        `${this.apiUrl}/v3/profiles/${this.profileId}/quotes`,
        {
          sourceCurrency: 'USD',
          targetCurrency: 'BRL',
          sourceAmount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const quoteId = quoteResponse.data.id;

      // 2. Criar transferência
      const transferResponse = await axios.post(
        `${this.apiUrl}/v1/transfers`,
        {
          targetAccount: targetAccountId,
          quoteUuid: quoteId,
          customerTransactionId: `TRANSFER-${Date.now()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      // 3. Financiar a transferência (debitar da conta USD)
      const transferId = transferResponse.data.id;
      await axios.post(
        `${this.apiUrl}/v3/profiles/${this.profileId}/transfers/${transferId}/payments`,
        {
          type: 'BALANCE',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return transferResponse.data;
    } catch (error) {
      this.logger.error(`Erro ao iniciar transferência: ${error.message}`);
      throw error;
    }
  }
} 