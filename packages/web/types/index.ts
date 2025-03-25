export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  operation_id: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CLIENT = 'client',
}

export interface Operation {
  id: string;
  name: string;
  description?: string;
  location?: string;
  active: boolean;
  settings?: OperationSettings;
  created_at: string;
  updated_at?: string;
}

export interface OperationSettings {
  currency: string;
  timezone: string;
  check_in_time?: string;
  check_out_time?: string;
  min_nights?: number;
  max_guests?: number;
  tax_rate?: number;
  booking_fees?: number;
  default_language?: string;
  allowed_payment_methods?: string[];
}

export interface Cabin {
  id: string;
  name: string;
  description?: string;
  operation_id: string;
  capacity: number;
  base_price: number;
  currency: string;
  features?: string[];
  images?: string[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Reservation {
  id: string;
  reference_code?: string;
  operation_id: string;
  cabin_id: string;
  guest_id?: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  total_amount: number;
  currency: string;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  notes?: string;
  source?: string;
  created_at: string;
  updated_at?: string;
  cabin?: Cabin;
  payments?: Payment[];
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export interface Payment {
  id: string;
  reservation_id: string;
  amount: number;
  currency: string;
  reference_code?: string;
  transaction_id?: string;
  payment_date?: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  metadata?: any;
  created_at: string;
  updated_at?: string;
}

export enum PaymentMethod {
  WISE = 'wise',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  OTHER = 'other',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface Catch {
  id: string;
  reservation_id: string;
  guest_id?: string;
  guest_name: string;
  species: string;
  weight?: number;
  length?: number;
  location?: string;
  lure?: string;
  notes?: string;
  image_url?: string;
  catch_date: string;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  operation_id: string;
  name: string;
  description?: string;
  category: string;
  sku?: string;
  price?: number;
  currency?: string;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface EmailTemplate {
  id: string;
  operation_id: string;
  name: string;
  type: string;
  subject: string;
  body: string;
  variables?: string[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  operation_id?: string;
  [key: string]: any;
} 