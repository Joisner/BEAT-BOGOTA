import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Descuento } from '../models/descuento.model';
import { environment } from '../../env/environment';
import { BearerService } from './bearer.service';

@Injectable({ providedIn: 'root' })
export class DescuentoService {
  environment = environment;

  constructor(private http: HttpClient, private bearerService: BearerService) {}

  /**
   * Obtiene todos los descuentos
   */
  getDescuentos(): Observable<Descuento[]> {
    debugger;
    return this.http.get<Descuento[]>(`${environment.discountsService}`, this.bearerService.bearerToken);
  }

  /**
   * Obtiene un descuento por su ID
   * @param id ID del descuento
   */
  getDescuento(id: string): Observable<Descuento> {
    return this.http.get<Descuento>(`${this.environment.discountsService}/${id}`);
  }

  /**
   * Crea un nuevo descuento
   * @param descuento Datos del descuento a crear
   */
  createDescuento(descuento: Omit<Descuento, 'id'>): Observable<Descuento> {
    return this.http.post<Descuento>(this.environment.discountsService, descuento);
  }

  /**
   * Actualiza un descuento existente
   * @param id ID del descuento a actualizar
   * @param descuento Datos actualizados del descuento
   */
  updateDescuento(id: string, descuento: Partial<Descuento>): Observable<Descuento> {
    return this.http.put<Descuento>(`${this.environment.discountsService}/${id}`, descuento);
  }

  /**
   * Elimina un descuento
   * @param id ID del descuento a eliminar
   */
  deleteDescuento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.environment.discountsService}/${id}`);
  }
}
