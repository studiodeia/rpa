import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  WISE = 'wise',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  OTHER = 'other',
}

export class CreatePaymentDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da reserva associada ao pagamento',
  })
  @IsUUID('4', { message: 'ID da reserva deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID da reserva é obrigatório' })
  reservation_id: string;

  @ApiProperty({
    example: 1000.00,
    description: 'Valor do pagamento',
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Moeda do pagamento',
  })
  @IsString({ message: 'Moeda deve ser uma string' })
  @IsNotEmpty({ message: 'Moeda é obrigatória' })
  currency: string;

  @ApiProperty({
    example: 'RPA-ABC12',
    description: 'Código de referência do pagamento',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Código de referência deve ser uma string' })
  reference_code?: string;

  @ApiProperty({
    example: 'TX123456789',
    description: 'ID da transação (fornecido pelo provedor de pagamento)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID da transação deve ser uma string' })
  transaction_id?: string;

  @ApiProperty({
    example: '2023-10-20T14:30:00Z',
    description: 'Data do pagamento',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Data do pagamento deve ser uma data válida' })
  @Type(() => Date)
  payment_date?: Date;

  @ApiProperty({
    example: 'wise',
    description: 'Método de pagamento',
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod, { message: 'Método de pagamento inválido' })
  @IsNotEmpty({ message: 'Método de pagamento é obrigatório' })
  payment_method: PaymentMethod;

  @ApiProperty({
    example: 'pending',
    description: 'Status do pagamento',
    enum: PaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Status inválido' })
  status?: PaymentStatus;

  @ApiProperty({
    example: { additionalDetails: 'Informações adicionais sobre o pagamento' },
    description: 'Metadados adicionais do pagamento',
    required: false,
  })
  @IsOptional()
  metadata?: any;
} 