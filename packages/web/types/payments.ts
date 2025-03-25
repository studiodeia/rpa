export enum PaymentMethod {
  WISE = 'wise',
  OPEN_PIX = 'open_pix',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  OTHER = 'other',
}

export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

export enum PaymentCurrency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export interface Payment {
  id: string;
  reservation_id: string;
  amount: number;
  currency: PaymentCurrency;
  exchange_rate?: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  payment_date?: string;
  due_date?: string;
  payment_proof_url?: string;
  notes?: string;
  reference_code?: string;
  meta_data?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  created_by: string;
  updated_by?: string;
}

export interface PaymentIntent {
  id: string;
  reservation_id: string;
  amount: number;
  currency: PaymentCurrency;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  checkout_url?: string;
  expiration_date?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

// Interface para definir os detalhes do split payment
export interface PaymentSplit {
  id: string;
  payment_id: string;
  receiver_id: string; // ID do operador/parceiro que receberá a parte do pagamento
  receiver_type: 'operator' | 'agent' | 'other'; // Tipo de recebedor
  amount: number;
  currency: PaymentCurrency;
  percentage: number; // Percentual do pagamento total
  status: 'pending' | 'processed' | 'failed';
  transfer_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Interface para pagamentos Wise
export interface WisePaymentDetails {
  profile_id?: string;
  quote_id?: string;
  transfer_id?: string;
  recipient_id?: string;
  source_currency: PaymentCurrency;
  target_currency: PaymentCurrency;
  source_amount: number;
  target_amount: number;
  fee?: number;
  rate?: number;
  estimated_delivery?: string;
  payment_url?: string;
  reference?: string;
}

// Interface para pagamentos OpenPix
export interface OpenPixPaymentDetails {
  pix_key?: string;
  qr_code_url?: string;
  qr_code_image_url?: string;
  copy_paste?: string;
  expiration_date?: string;
  correlation_id?: string;
  payer_name?: string;
  payer_doc?: string;
}

// Interface para transferências bancárias
export interface BankTransferDetails {
  bank_name?: string;
  account_number?: string;
  branch_number?: string;
  account_type?: string;
  account_holder?: string;
  document_number?: string;
  swift_code?: string;
  iban?: string;
  routing_number?: string;
  bank_address?: string;
}

// Interface para persistir o histórico de todas as transações
export interface PaymentTransaction {
  id: string;
  payment_id: string;
  type: 'payment' | 'refund' | 'split' | 'chargeback' | 'fee' | 'other';
  status: 'success' | 'pending' | 'failed';
  amount: number;
  currency: PaymentCurrency;
  provider: string; // 'wise', 'open_pix', 'manual', etc.
  provider_transaction_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  location?: string;
}

// Interface para representar as regras de comissão para agentes
export interface AgentCommission {
  id: string;
  agent_id: string;
  operation_id?: string; // Pode ser específico para uma operação
  camp_id?: string; // Ou específico para um camp
  percentage: number;
  fixed_amount?: number;
  currency?: PaymentCurrency;
  is_default: boolean;
  active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
}

// Interface para representar as regras de repasse para operadores
export interface OperatorSplit {
  id: string;
  operator_id: string;
  operation_id: string;
  camp_id?: string;
  percentage: number;
  fixed_amount?: number;
  currency?: PaymentCurrency;
  is_default: boolean;
  active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
} 