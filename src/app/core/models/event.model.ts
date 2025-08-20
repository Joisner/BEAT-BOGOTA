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
