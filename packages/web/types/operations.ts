import { PaymentCurrency } from './payments';

// Enum para os códigos internos das operações
export enum OperatorCode {
  NT = 'NT', // NG Turismo
  RB = 'RB', // Itaicy
}

export interface Operator {
  id: string;
  name: string;
  code: OperatorCode;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  payment_details?: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Operation {
  id: string;
  name: string;
  operator_id: string;
  internal_code: string; // Ex: "NT-01", "RB-02"
  description?: string;
  type: 'camp' | 'lodge' | 'other';
  location?: string;
  active: boolean;
  settings?: OperationSettings;
  created_at: string;
  updated_at?: string;
  operator?: Operator;
}

export interface OperationSettings {
  currency: PaymentCurrency;
  timezone: string;
  check_in_time?: string;
  check_out_time?: string;
  min_nights?: number;
  max_guests?: number;
  default_language?: string;
  allowed_payment_methods?: string[];
  terms_and_conditions?: string;
  cancellation_policy?: string;
}

// Representação de uma localidade onde a operação ocorre
export interface Location {
  id: string;
  name: string; // Nome para exibição ao cliente (ex: "Marmelos")
  description?: string;
  region?: string;
  state?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Período em que uma operação está ativa em uma localidade específica
export interface OperationPeriod {
  id: string;
  operation_id: string;
  location_id: string;
  start_date: string; // Data de início (ISO 8601)
  end_date: string; // Data de fim (ISO 8601)
  status: 'scheduled' | 'active' | 'completed' | 'canceled';
  base_price?: number;
  currency?: PaymentCurrency;
  notes?: string;
  max_capacity?: number;
  created_at: string;
  updated_at?: string;
  operation?: Operation;
  location?: Location;
}

// Preços específicos para datas dentro de um período
export interface PeriodPricing {
  id: string;
  operation_period_id: string;
  start_date: string;
  end_date: string;
  price: number;
  currency: PaymentCurrency;
  reason?: string; // Razão para o preço especial (ex: "Feriado", "Promoção")
  created_at: string;
  updated_at?: string;
}

// Representação das embarcações disponíveis em uma operação
export interface Boat {
  id: string;
  operation_id: string;
  name: string;
  description?: string;
  capacity: number;
  type: string; // Tipo de embarcação (ex: "Bass Boat", "Jon Boat")
  features?: string[];
  images?: string[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Representação dos quartos/acomodações disponíveis em uma operação
export interface Accommodation {
  id: string;
  operation_id: string;
  name: string;
  description?: string;
  type: string; // Tipo de acomodação (ex: "Quarto Duplo", "Suíte")
  capacity: number;
  amenities?: string[];
  images?: string[];
  price_modifier?: number; // Modificador de preço em relação ao preço base da operação
  active: boolean;
  created_at: string;
  updated_at?: string;
} 