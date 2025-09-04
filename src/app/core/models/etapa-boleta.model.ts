export interface EtapaBoleta {
  id: string;
  name: string; // Ej: Preventa, General, Última Etapa
  start_date: Date;
  end_date: Date;
  price: number;
  availability: number;
  active: boolean;
  event_id: string;
}
