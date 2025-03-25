import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../config/supabase.config';
import { WiseService } from './wise/wise.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private supabaseService: SupabaseService,
    private wiseService: WiseService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const supabase = this.supabaseService.getClient();
    
    // Verificar se a reserva existe
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', createPaymentDto.reservation_id)
      .single();

    if (reservationError || !reservation) {
      throw new NotFoundException(`Reserva com ID ${createPaymentDto.reservation_id} não encontrada`);
    }

    // Se não existir um código de referência para a reserva, gerar um
    if (!reservation.reference_code) {
      const referenceCode = this.wiseService.generateReferenceCode(reservation.id);
      
      // Atualizar a reserva com o código de referência
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ reference_code: referenceCode })
        .eq('id', reservation.id);

      if (updateError) {
        this.logger.error(`Erro ao atualizar código de referência: ${updateError.message}`);
        throw new Error('Erro ao gerar código de referência para a reserva');
      }
    }

    // Criar o pagamento
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ...createPaymentDto,
        status: createPaymentDto.status || 'pending',
        created_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao criar pagamento: ${error.message}`);
      throw new Error(`Erro ao criar pagamento: ${error.message}`);
    }

    return data;
  }

  async findAll(filters: any = {}) {
    const supabase = this.supabaseService.getClient();
    
    let query = supabase.from('payments').select(`
      *,
      reservation:reservation_id (
        id,
        reference_code,
        guest_name,
        check_in,
        check_out,
        status
      )
    `);
    
    // Aplicar filtros se fornecidos
    if (filters.reservation_id) {
      query = query.eq('reservation_id', filters.reservation_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }
    
    if (filters.start_date && filters.end_date) {
      query = query
        .gte('payment_date', filters.start_date)
        .lte('payment_date', filters.end_date);
    }
    
    // Ordenar por data de pagamento (mais recente primeiro)
    query = query.order('payment_date', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      this.logger.error(`Erro ao buscar pagamentos: ${error.message}`);
      throw new Error(`Erro ao buscar pagamentos: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        reservation:reservation_id (
          id,
          reference_code,
          guest_name,
          check_in,
          check_out,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }

    return data;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const supabase = this.supabaseService.getClient();
    
    // Verificar se o pagamento existe
    await this.findOne(id);
    
    const { data, error } = await supabase
      .from('payments')
      .update({
        ...updatePaymentDto,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao atualizar pagamento: ${error.message}`);
      throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
    }

    return data;
  }

  async updateStatus(id: string, status: string) {
    return this.update(id, { status });
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();
    
    // Verificar se o pagamento existe
    await this.findOne(id);
    
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Erro ao excluir pagamento: ${error.message}`);
      throw new Error(`Erro ao excluir pagamento: ${error.message}`);
    }

    return { message: 'Pagamento excluído com sucesso' };
  }

  async getPaymentDetailsByReservation(reservationId: string) {
    const supabase = this.supabaseService.getClient();
    
    // Buscar a reserva
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*, cabins(*)')
      .eq('id', reservationId)
      .single();

    if (reservationError || !reservation) {
      throw new NotFoundException(`Reserva com ID ${reservationId} não encontrada`);
    }

    // Buscar os pagamentos da reserva
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', reservationId)
      .order('payment_date', { ascending: false });

    if (paymentsError) {
      this.logger.error(`Erro ao buscar pagamentos: ${paymentsError.message}`);
      throw new Error(`Erro ao buscar pagamentos da reserva: ${paymentsError.message}`);
    }

    // Obter detalhes da conta USD da Wise
    let wiseAccountDetails = null;
    try {
      wiseAccountDetails = await this.wiseService.getUsdAccountDetails();
    } catch (error) {
      this.logger.warn(`Erro ao buscar detalhes da conta Wise: ${error.message}`);
      // Não falhar caso não consiga obter os detalhes da Wise
    }

    // Gerar o código de referência se não existir
    let referenceCode = reservation.reference_code;
    if (!referenceCode) {
      referenceCode = this.wiseService.generateReferenceCode(reservation.id);
      
      // Atualizar a reserva com o código de referência
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ reference_code: referenceCode })
        .eq('id', reservation.id);

      if (updateError) {
        this.logger.error(`Erro ao atualizar código de referência: ${updateError.message}`);
      }
    }

    return {
      reservation,
      payments,
      paymentDetails: {
        referenceCode,
        totalAmount: reservation.total_amount,
        currency: reservation.currency,
        wiseAccount: wiseAccountDetails,
        paymentInstructions: {
          memo: `${referenceCode} - ${reservation.guest_name}`,
          paymentMethod: 'ACH (para evitar taxas adicionais)',
          accountType: 'Checking',
        },
      },
    };
  }

  async getUnreconciledPayments() {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('unreconciled_payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      this.logger.error(`Erro ao buscar pagamentos não reconciliados: ${error.message}`);
      throw new Error(`Erro ao buscar pagamentos não reconciliados: ${error.message}`);
    }

    return data;
  }

  async reconcilePayment(unreconciledPaymentId: string, reservationId: string) {
    const supabase = this.supabaseService.getClient();
    
    // Buscar o pagamento não reconciliado
    const { data: unreconciledPayment, error: unreconciledError } = await supabase
      .from('unreconciled_payments')
      .select('*')
      .eq('id', unreconciledPaymentId)
      .single();

    if (unreconciledError || !unreconciledPayment) {
      throw new NotFoundException(`Pagamento não reconciliado com ID ${unreconciledPaymentId} não encontrado`);
    }

    // Buscar a reserva
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (reservationError || !reservation) {
      throw new NotFoundException(`Reserva com ID ${reservationId} não encontrada`);
    }

    // Iniciar uma transação
    const { error: transactionError } = await supabase.rpc('reconcile_payment', {
      p_unreconciled_id: unreconciledPaymentId,
      p_reservation_id: reservationId,
      p_amount: unreconciledPayment.amount,
      p_currency: unreconciledPayment.currency,
      p_transaction_id: unreconciledPayment.transaction_id,
      p_payment_date: unreconciledPayment.payment_date,
      p_payment_method: unreconciledPayment.payment_method,
      p_reference: unreconciledPayment.reference,
      p_metadata: unreconciledPayment.payment_data,
    });

    if (transactionError) {
      this.logger.error(`Erro na transação de reconciliação: ${transactionError.message}`);
      throw new Error(`Erro ao reconciliar pagamento: ${transactionError.message}`);
    }

    return {
      message: 'Pagamento reconciliado com sucesso',
      reservationId,
    };
  }
} 