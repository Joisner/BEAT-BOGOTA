import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promoter } from '../models/promoter.model';
import { environment } from '../../env/environment';
import { BearerService } from './bearer.service';

@Injectable({ providedIn: 'root' })
export class PromoterService {
  environment = environment;

  constructor(private http: HttpClient, private bearerService: BearerService) {}

  /**
   * Obtiene todos los promotores
   */
  getPromoters(): Observable<Promoter[]> {
    return this.http.get<Promoter[]>(this.environment.promoterService);
  }

  /**
   * Obtiene un promotor por su ID
   * @param id ID del promotor
   */
  getPromoter(id: string): Observable<Promoter> {
    return this.http.get<Promoter>(`${this.environment.promoterService}/${id}`);
  }

  /**
   * Crea un nuevo promotor
   * @param promotor Datos del promotor a crear
   */
  createPromoter(promotor: Omit<Promoter, 'id'>): Observable<Promoter> {
    return this.http.post<Promoter>(this.environment.promoterService, promotor, this.bearerService.bearerToken);
  }

  /**
   * Actualiza un promotor existente
   * @param id ID del promotor a actualizar
   * @param promotor Datos actualizados del promotor
   */
  updatePromoter(id: string, promotor: Partial<Promoter>): Observable<Promoter> {
    return this.http.put<Promoter>(`${this.environment.promoterService}/${id}`, promotor, this.bearerService.bearerToken);
  }

  /**
   * Elimina un promotor
   * @param id ID del promotor a eliminar
   */
  deletePromoter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.environment.promoterService}/${id}`);
  }
}
