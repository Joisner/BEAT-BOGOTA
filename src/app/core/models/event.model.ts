export interface Event {
  id: number;
  name: string;
  date: Date;
  location: string;
  description: string;
  promotores: string[]; // IDs de promotores responsables
  contact: {
    type: 'whatsapp' | 'link';
    value: string;
  };
  imageUrl?: string;
  genre?: string;
  price?: {
    min: number;
    max?: number;
    currency: string;
  };
  tags?: string[];
  capacity?: number;
  featured?: boolean;
  promotor?: any;
}