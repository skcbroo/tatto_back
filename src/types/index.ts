export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name?: string;
  phone?: string;
  role: 'customer' | 'artist';
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Artist {
  id: string;
  user_id: string;
  bio?: string;
  specialties?: string[];
  studio_name?: string;
  studio_address?: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  portfolio_images?: string[];
  years_experience?: number;
  instagram_handle?: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: string;
  artist_id: string;
  name: string;
  description?: string;
  price_min?: number;
  price_max?: number;
  duration_minutes?: number;
  category?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Appointment {
  id: string;
  customer_id: string;
  artist_id: string;
  service_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  price?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  appointment_id: string;
  customer_id: string;
  artist_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: Date;
}

export interface Favorite {
  id: string;
  user_id: string;
  artist_id: string;
  created_at: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'customer' | 'artist';
}
