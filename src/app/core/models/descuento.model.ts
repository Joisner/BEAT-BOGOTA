export type DescuentoTipo = 'general' | 'promotor' | 'entrada';

export interface Descuento {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: DescuentoTipo;
  valor: number; // porcentaje o valor fijo
  activo: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
  promotorId?: string; // si es por promotor
  entradaTipo?: string; // si es por tipo de entrada
}
