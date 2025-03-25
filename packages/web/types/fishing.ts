// Interface para registro de capturas de peixes
export interface FishCatch {
  id: string;
  reservation_id: string;
  guest_id?: string;
  date: string; // Data da captura (ISO 8601)
  time?: string; // Hora da captura (formato HH:MM)
  species: string;
  weight?: number; // Peso em kg
  length?: number; // Comprimento em cm
  location?: string; // Local específico da captura
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  lure_type?: string; // Tipo de isca utilizada
  lure_model?: string; // Modelo da isca
  lure_color?: string; // Cor da isca
  fishing_technique?: string; // Técnica de pesca utilizada
  rod_type?: string; // Tipo de vara
  reel_type?: string; // Tipo de carretilha
  line_type?: string; // Tipo de linha
  line_pound?: string; // Resistência da linha
  weather_conditions?: string; // Condições climáticas durante a captura
  water_conditions?: string; // Condições da água
  notes?: string; // Observações adicionais
  photos?: string[]; // URLs das fotos
  is_released?: boolean; // Se o peixe foi solto
  created_at: string;
  updated_at?: string;
  created_by: string;
  updated_by?: string;
}

// Interface para espécies de peixes
export interface FishSpecies {
  id: string;
  name: string;
  scientific_name?: string;
  common_names?: string[]; // Nomes comuns em diferentes idiomas/regiões
  description?: string;
  habitat?: string;
  average_weight?: number;
  average_length?: number;
  record_weight?: number;
  record_length?: number;
  photo_url?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para relatórios diários de pesca (preenchidos pelos guias)
export interface DailyFishingReport {
  id: string;
  operation_id: string;
  operation_period_id: string;
  date: string; // Data do relatório (ISO 8601)
  guide_name: string;
  boat_id?: string;
  weather: {
    morning?: string;
    afternoon?: string;
    evening?: string;
    temperature_min?: number;
    temperature_max?: number;
    wind_direction?: string;
    wind_speed?: number;
    precipitation?: boolean;
    precipitation_amount?: number;
    water_level?: string;
    water_temperature?: number;
    water_clarity?: string;
  };
  fishing_spots?: string[]; // Locais visitados durante o dia
  total_catches: number;
  species_caught?: {
    species_id: string;
    species_name: string;
    count: number;
    biggest_weight?: number;
    biggest_length?: number;
  }[];
  techniques_used?: string[];
  best_lures?: string[];
  guest_feedback?: string;
  notes?: string;
  photos?: string[];
  created_at: string;
  updated_at?: string;
  created_by: string;
  updated_by?: string;
}

// Interface para relatórios semanais de pesca (enviados aos clientes)
export interface WeeklyFishingReport {
  id: string;
  operation_id: string;
  operation_period_id: string;
  title: string;
  start_date: string;
  end_date: string;
  weather_summary: string;
  fishing_conditions_summary: string;
  total_guests: number;
  total_catches: number;
  species_summary: {
    species_id: string;
    species_name: string;
    count: number;
    biggest_weight?: number;
    biggest_length?: number;
    average_weight?: number;
    average_length?: number;
  }[];
  top_anglers?: {
    guest_id?: string;
    guest_name: string;
    total_catches: number;
    notable_catches?: string;
  }[];
  best_spots?: string[];
  best_techniques?: string[];
  best_lures?: string[];
  featured_photos?: string[];
  highlights?: string;
  next_week_forecast?: string;
  published: boolean;
  sent_to_guests: boolean;
  sent_date?: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
  updated_by?: string;
}

// Interface para locais de pesca
export interface FishingSpot {
  id: string;
  operation_id: string;
  name: string;
  description?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  habitat_type?: string; // Tipo de habitat (ex: "Corredeira", "Poço", "Estrutura submersa")
  water_type?: string; // Tipo de água (ex: "Água clara", "Água barrenta")
  depth_min?: number; // Profundidade mínima em metros
  depth_max?: number; // Profundidade máxima em metros
  best_tide?: string; // Melhor maré, se aplicável
  best_time_of_day?: string; // Melhor horário do dia
  best_season?: string; // Melhor época do ano
  target_species?: string[]; // Espécies-alvo para esse local
  notes?: string;
  photos?: string[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para equipamentos/materiais de pesca
export interface FishingEquipment {
  id: string;
  operation_id: string;
  type: 'rod' | 'reel' | 'lure' | 'line' | 'other';
  name: string;
  brand?: string;
  model?: string;
  description?: string;
  specifications?: Record<string, any>; // Especificações técnicas
  quantity: number;
  available: number; // Quantidade disponível
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  photo_url?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// Interface para os guias de pesca
export interface FishingGuide {
  id: string;
  operation_id: string;
  name: string;
  years_of_experience?: number;
  specialties?: string[]; // Especialidades (técnicas, espécies)
  languages?: string[]; // Idiomas falados
  bio?: string; // Biografia curta
  photo_url?: string;
  contact_phone?: string;
  contact_email?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
} 