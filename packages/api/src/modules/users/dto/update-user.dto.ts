import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @ApiProperty({
    example: 'nova_senha123',
    description: 'Nova senha do usuário (opcional)',
    required: false,
  })
  @IsOptional()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @ApiProperty({
    example: true,
    description: 'Status do usuário (ativo/inativo)',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status deve ser um booleano' })
  active?: boolean;
} 