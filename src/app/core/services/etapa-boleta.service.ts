import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EtapaBoleta } from '../models/etapa-boleta.model';

@Injectable({ providedIn: 'root' })
export class EtapaBoletaService {
  private etapas: EtapaBoleta[] = [
    {
      id: '1',
      nombre: 'Preventa',
      fechaInicio: new Date('2025-09-01'),
      fechaFin: new Date('2025-09-10'),
      precio: 50000,
      disponibilidad: 100,
      activa: true
    },
    {
      id: '2',
      nombre: 'General',
      fechaInicio: new Date('2025-09-11'),
      fechaFin: new Date('2025-09-20'),
      precio: 70000,
      disponibilidad: 200,
      activa: false
    }
  ];

  getEtapas(): Observable<EtapaBoleta[]> {
    return of(this.etapas);
  }
}
