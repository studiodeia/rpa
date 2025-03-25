export enum UserRole {
  SUPER_ADMIN = 'super_admin', // Acesso total ao sistema
  ADMIN = 'admin', // Administrador da River Plate
  OPERATOR = 'operator', // Operador (NG Turismo, Itaicy)
  STAFF = 'staff', // Funcionário da River Plate
  AGENT = 'agent', // Agente de turismo
  GUEST = 'guest', // Cliente/hóspede com acesso limitado
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  permissions?: string[];
  active: boolean;
  email_verified: boolean;
  two_factor_enabled?: boolean;
  last_login?: string;
  operator_id?: string; // ID do operador, se for um usuário de operador
  agent_id?: string; // ID do agente, se for um usuário de agente
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  avatar_url?: string;
  bio?: string;
  position?: string;
  company?: string;
  language_preference?: string;
  notification_preferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  social_media?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  created_at: string;
  updated_at?: string;
}

// Interface para autenticação
export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
  expires_at: string;
}

// Interface para tokens de autenticação
export interface UserToken {
  id: string;
  user_id: string;
  token_type: 'access' | 'refresh' | 'reset_password' | 'email_verification' | 'api';
  token: string;
  expires_at: string;
  revoked: boolean;
  created_at: string;
  updated_at?: string;
  ip_address?: string;
  user_agent?: string;
}

// Interface para log de atividades dos usuários
export interface UserActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Interface para permissões de usuários
export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource_type: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  created_at: string;
  updated_at?: string;
}

// Interface para grupos de permissões
export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // IDs das permissões
  created_at: string;
  updated_at?: string;
}

// Interface para solicitações de cadastro de agentes
export interface AgentRegistrationRequest {
  id: string;
  company_name: string;
  trade_name?: string;
  document_type?: string;
  document_number?: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at?: string;
  ip_address?: string;
  user_agent?: string;
}

// Interface para o sistema de autenticação de dois fatores
export interface TwoFactorAuth {
  id: string;
  user_id: string;
  method: '2fa_app' | 'sms' | 'email';
  secret?: string;
  backup_codes?: string[];
  verified: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para logs de autenticação
export interface AuthenticationLog {
  id: string;
  user_id: string;
  action: 'login' | 'logout' | 'failed_login' | '2fa_success' | '2fa_failed' | 'password_reset' | 'email_verification';
  success: boolean;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  device_info?: string;
  error_message?: string;
  created_at: string;
} 