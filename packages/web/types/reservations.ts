import { PaymentCurrency } from './payments';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export interface ReservationAmount {
  subtotal: number;
  taxes?: number;
  fees?: number;
  discounts?: number;
  total: number;
  agent_commission?: number;
}

export interface ReservationGuest {
  id: string;
  name: string;
  document_type: 'cpf' | 'passport';
  document_number: string;
  age?: number;
  is_primary: boolean;
}

export interface ReservationExtra {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Reservation {
  id: string;
  reference_code: string;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  operation_id: string;
  operation_name?: string;
  package_id?: string;
  package_name?: string;
  agent_id: string;
  client_id: string;
  client_name: string;
  check_in: string; // ISO date string
  check_out: string; // ISO date string
  nights: number;
  room_type_id: string;
  room_type_name?: string;
  rooms: number;
  adults: number;
  children: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  confirmed_at?: string; // ISO date string
  canceled_at?: string; // ISO date string
  amount: ReservationAmount;
  currency: string;
  payment_method?: string;
  guests?: ReservationGuest[];
  extras?: ReservationExtra[];
  notes?: string;
  special_requests?: string;
  cancellation_reason?: string;
}

export interface ReservationListResponse {
  data: Reservation[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ReservationFilters {
  status?: ReservationStatus | 'all';
  payment_status?: PaymentStatus | 'all';
  date_from?: string;
  date_to?: string;
  operation_id?: string;
  client_id?: string;
  search?: string;
}

// Interface para manter o histórico detalhado de alterações na reserva
export interface ReservationAuditLog {
  id: string;
  reservation_id: string;
  action: 'created' | 'updated' | 'status_changed' | 'canceled' | 'payment_updated' | 'guest_updated' | 'other';
  field?: string; // Campo alterado, se aplicável
  old_value?: any; // Valor antigo
  new_value?: any; // Novo valor
  notes?: string;
  created_at: string;
  created_by: string;
  ip_address?: string;
  user_agent?: string;
}

// Interface para representar as regras de cancelamento
export interface CancellationPolicy {
  id: string;
  operation_id: string;
  name: string;
  description?: string;
  rules: CancellationRule[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CancellationRule {
  id: string;
  cancellation_policy_id: string;
  days_before_check_in: number; // Quantos dias antes do check-in
  refund_percentage: number; // Percentual de reembolso
  fee?: number; // Taxa fixa de cancelamento, se aplicável
  currency?: PaymentCurrency;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para representar os comprovantes de pagamento
export interface PaymentProof {
  id: string;
  reservation_id: string;
  payment_id?: string;
  file_url: string;
  file_type: string;
  amount: number;
  currency: PaymentCurrency;
  status: 'pending_review' | 'approved' | 'rejected';
  review_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}

// Interface para representar o agente de turismo
export interface Agent {
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
  commission_type?: 'percentage' | 'fixed';
  default_commission?: number;
  default_currency?: PaymentCurrency;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para os usuários do sistema de agentes
export interface AgentUser {
  id: string;
  agent_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'agent' | 'viewer'; // Papel no sistema
  last_login?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para o log de atividades dos usuários agentes
export interface AgentActivityLog {
  id: string;
  agent_user_id: string;
  action: string;
  resource_type: string; // ex: 'reservation', 'payment'
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
} 