import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WiseService } from './wise/wise.service';

@ApiTags('Pagamentos')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly wiseService: WiseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo pagamento' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pagamento criado com sucesso' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pagamentos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de pagamentos retornada com sucesso' })
  @ApiQuery({ name: 'reservation_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'payment_method', required: false })
  @ApiQuery({ name: 'start_date', required: false })
  @ApiQuery({ name: 'end_date', required: false })
  findAll(
    @Query('reservation_id') reservationId?: string,
    @Query('status') status?: string,
    @Query('payment_method') paymentMethod?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    const filters = {
      reservation_id: reservationId,
      status,
      payment_method: paymentMethod,
      start_date: startDate,
      end_date: endDate,
    };
    
    return this.paymentsService.findAll(filters);
  }

  @Get('unreconciled')
  @ApiOperation({ summary: 'Listar pagamentos não reconciliados' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de pagamentos não reconciliados retornada com sucesso' })
  getUnreconciledPayments() {
    return this.paymentsService.getUnreconciledPayments();
  }

  @Post('reconcile/:unreconciledId')
  @ApiOperation({ summary: 'Reconciliar um pagamento não identificado com uma reserva' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagamento reconciliado com sucesso' })
  reconcilePayment(
    @Param('unreconciledId') unreconciledId: string,
    @Body('reservation_id') reservationId: string,
  ) {
    return this.paymentsService.reconcilePayment(unreconciledId, reservationId);
  }

  @Get('reservation/:reservationId')
  @ApiOperation({ summary: 'Obter detalhes de pagamento para uma reserva' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Detalhes de pagamento retornados com sucesso' })
  getPaymentDetailsByReservation(@Param('reservationId') reservationId: string) {
    return this.paymentsService.getPaymentDetailsByReservation(reservationId);
  }

  @Get('wise/account-details')
  @ApiOperation({ summary: 'Obter detalhes da conta USD da Wise' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Detalhes da conta USD retornados com sucesso' })
  getWiseAccountDetails() {
    return this.wiseService.getUsdAccountDetails();
  }

  @Get('wise/transactions')
  @ApiOperation({ summary: 'Listar transações recentes da Wise' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de transações retornada com sucesso' })
  @ApiQuery({ name: 'days', required: false, description: 'Número de dias para buscar (padrão: 7)' })
  getWiseTransactions(@Query('days') days?: number) {
    return this.wiseService.listRecentTransactions(days || 7);
  }

  @Post('wise/transfer')
  @ApiOperation({ summary: 'Iniciar transferência da Wise para conta no Brasil' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transferência iniciada com sucesso' })
  initiateWiseTransfer(
    @Body('amount') amount: number,
    @Body('target_account_id') targetAccountId: string,
  ) {
    return this.wiseService.initiateTransferToBrazil(amount, targetAccountId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pagamento pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagamento retornado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pagamento não encontrado' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um pagamento' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagamento atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status de um pagamento' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status atualizado com sucesso' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.paymentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um pagamento' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagamento excluído com sucesso' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
} 