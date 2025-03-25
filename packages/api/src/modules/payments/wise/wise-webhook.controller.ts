import { Controller, Post, Headers, Body, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { WiseService } from './wise.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Wise Webhooks')
@Controller('payments/wise/webhook')
export class WiseWebhookController {
  private readonly logger = new Logger(WiseWebhookController.name);

  constructor(private readonly wiseService: WiseService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint para receber webhooks da Wise' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Webhook processado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Payload inválido' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Assinatura inválida' })
  async handleWebhook(
    @Headers('x-signature-sha256') signature: string,
    @Body() payload: any,
  ) {
    this.logger.log(`Webhook recebido: ${payload.event_type}`);
    
    if (!signature) {
      this.logger.warn('Webhook recebido sem assinatura');
      return { message: 'Assinatura ausente', status: 'error' };
    }

    try {
      const result = await this.wiseService.processPaymentWebhook(payload, signature);
      return { ...result, status: 'success' };
    } catch (error) {
      this.logger.error(`Erro ao processar webhook: ${error.message}`);
      return { message: error.message, status: 'error' };
    }
  }
} 