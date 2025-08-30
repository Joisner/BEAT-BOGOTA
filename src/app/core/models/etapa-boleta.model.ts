export interface EtapaBoleta {
  id: string;
  nombre: string; // Ej: Preventa, General, Última Etapa
  fechaInicio: Date;
  fechaFin: Date;
  precio: number;
  disponibilidad: number;
  activa: boolean;
}
