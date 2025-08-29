export interface Event {
  id: number;
  name: string;
  date: Date;
  location: string;
  description: string;
  promoter: string;
  contact: {
    type: 'link' | 'whatsapp';
    value: string;
  };
}

export interface Event {
  id: number;
  name: string;
  date: Date;
  location: string;
  description: string;
  promoter: string;
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
}