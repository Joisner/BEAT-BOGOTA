export type DescuentoTipo = 'general' | 'promotor' | 'entrada';

export interface Descuento {
  id: string;
  code: string;
  description: string;
  type: DescuentoTipo;
  value: number; // porcentaje o valor fijo
  active: boolean;
  start_date?: Date;
  end_date?: Date;
  promoter_id?: string; // si es por promotor
  ticket_stage_id?: string; // si es por tipo de entrada
}