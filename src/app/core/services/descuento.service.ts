import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Descuento } from '../models/descuento.model';

@Injectable({ providedIn: 'root' })
export class DescuentoService {
  private descuentos: Descuento[] = [
    {
      id: '1',
      codigo: 'BEAT10',
      descripcion: '10% de descuento general',
      tipo: 'general',
      valor: 10,
      activo: true
    },
    {
      id: '2',
      codigo: 'PROMOANA',
      descripcion: '15% para clientes de Ana',
      tipo: 'promotor',
      valor: 15,
      activo: true,
      promotorId: '2'
    },
    {
      id: '3',
      codigo: 'VIP20',
      descripcion: '20% en entradas VIP',
      tipo: 'entrada',
      valor: 20,
      activo: false,
      entradaTipo: 'VIP'
    }
  ];

  getDescuentos(): Observable<Descuento[]> {
    return of(this.descuentos);
  }
}
