export interface EventFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  date_time: string;
  location: string;
  location_url?: string;
  responsible_name: string;
  contact_phone: string;
  social_media: string;
  image_url?: string;
  target_audience: string;
  cost_type: 'free' | 'paid';
  cost_amount?: number;
}

export const EVENT_CATEGORIES = [
  'Teatro',
  'Música',
  'Arte',
  'Danza',
  'Literatura',
  'Cine',
  'Fotografía',
  'Taller',
  'Festival',
  'Exposición',
] as const;

export const TARGET_AUDIENCES = [
  'Infantil',
  'Juvenil',
  'Adultos',
  'Todos',
  'Tercera Edad',
] as const;