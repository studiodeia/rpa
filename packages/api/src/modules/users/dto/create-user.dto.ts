import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CLIENT = 'client',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'joao.silva@riverplateanglers.com',
    description: 'Email do usuário (será usado para login)',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'manager',
    description: 'Papel do usuário no sistema',
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Papel inválido' })
  @IsNotEmpty({ message: 'Papel é obrigatório' })
  role: UserRole;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da operação à qual o usuário pertence',
  })
  @IsUUID('4', { message: 'ID da operação deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID da operação é obrigatório' })
  operation_id: string;
} 