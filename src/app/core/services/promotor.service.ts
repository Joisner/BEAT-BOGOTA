import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Promotor } from '../models/promotor.model';

@Injectable({ providedIn: 'root' })
export class PromotorService {
  private promotores: Promotor[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      telefono: '3001234567',
      whatsapp: 'https://wa.me/573001234567',
      perfilUrl: 'https://example.com/juan',
      habilitado: true
    },
    {
      id: '2',
      nombre: 'Ana Gómez',
      telefono: '3009876543',
      whatsapp: 'https://wa.me/573009876543',
      perfilUrl: 'https://example.com/ana',
      habilitado: true
    }
  ];

  getPromotores(): Observable<Promotor[]> {
    return of(this.promotores.filter(p => p.habilitado));
  }
}
