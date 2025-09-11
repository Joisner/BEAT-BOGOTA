export interface Promoter {
  id: string;
  name: string;
  user_email: string;
  phone: string;
  whatsapp?: string; // link directo
  profile_url?: string; // link a perfil autorizado
  enabled: boolean;
}
[
  {
      "name": "Promoter One",
      "email": "promoter1@example.com",
      "phone": "+34987654321",
      "whatsapp": "+34987654321",
      "profile_url": "https://img.com/prom1.jpg",
      "enabled": true,
      "id": "prom001",
      "user_id": "uid123firebase002"
  }
]