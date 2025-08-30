export interface Promotor {
  id: string;
  nombre: string;
  telefono: string;
  whatsapp?: string; // link directo
  perfilUrl?: string; // link a perfil autorizado
  habilitado: boolean;
}
