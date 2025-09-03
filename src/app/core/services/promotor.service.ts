import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotor } from '../models/promotor.model';
import { environment } from '../../env/environment';

@Injectable({ providedIn: 'root' })
export class PromotorService {
  environment = environment;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los promotores
   */
  getPromotores(): Observable<Promotor[]> {
    return this.http.get<Promotor[]>(this.environment.promoterService);
  }

  /**
   * Obtiene un promotor por su ID
   * @param id ID del promotor
   */
  getPromotor(id: string): Observable<Promotor> {
    return this.http.get<Promotor>(`${this.environment.promoterService}/${id}`);
  }

  /**
   * Crea un nuevo promotor
   * @param promotor Datos del promotor a crear
   */
  createPromotor(promotor: Omit<Promotor, 'id'>): Observable<Promotor> {
    return this.http.post<Promotor>(this.environment.promoterService, promotor);
  }

  /**
   * Actualiza un promotor existente
   * @param id ID del promotor a actualizar
   * @param promotor Datos actualizados del promotor
   */
  updatePromotor(id: string, promotor: Partial<Promotor>): Observable<Promotor> {
    return this.http.put<Promotor>(`${this.environment.promoterService}/${id}`, promotor);
  }

  /**
   * Elimina un promotor
   * @param id ID del promotor a eliminar
   */
  deletePromotor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.environment.promoterService}/${id}`);
  }
}
