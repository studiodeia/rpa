import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../config/supabase.config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const supabase = this.supabaseService.getClient();
    
    // Primeiro, cria o usuário no auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: createUserDto.email,
      password: createUserDto.password,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(`Erro ao criar usuário na autenticação: ${authError.message}`);
    }

    // Em seguida, salva os dados do usuário na tabela users
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: createUserDto.name,
        email: createUserDto.email,
        role: createUserDto.role,
        operation_id: createUserDto.operation_id,
        active: true,
      })
      .select()
      .single();

    if (error) {
      // Caso ocorra erro, tenta deletar o usuário de autenticação
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Erro ao salvar dados do usuário: ${error.message}`);
    }

    return data;
  }

  async findAll(operationId?: string) {
    const supabase = this.supabaseService.getClient();
    
    let query = supabase.from('users').select('*');
    
    if (operationId) {
      query = query.eq('operation_id', operationId);
    }
    
    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }

    return data;
  }

  async findById(id: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return data;
  }

  async findByEmail(email: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return null; // Retorna null em vez de lançar erro
    }

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const supabase = this.supabaseService.getClient();
    
    // Verifica se o usuário existe
    const user = await this.findById(id);
    
    // Atualiza dados na tabela users
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updateUserDto.name,
        role: updateUserDto.role,
        operation_id: updateUserDto.operation_id,
        active: updateUserDto.active,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }

    // Se houver senha, atualiza a senha no auth
    if (updateUserDto.password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        id,
        { password: updateUserDto.password }
      );

      if (authError) {
        throw new Error(`Erro ao atualizar senha: ${authError.message}`);
      }
    }

    return data;
  }

  async remove(id: string) {
    // Primeiro desativamos o usuário ao invés de excluir
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('users')
      .update({ active: false, updated_at: new Date() })
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao desativar usuário: ${error.message}`);
    }

    return { message: 'Usuário desativado com sucesso' };
  }
} 