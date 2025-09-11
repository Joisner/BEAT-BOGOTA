import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtapaBoleta } from '../models/etapa-boleta.model';
import { environment } from '../../env/environment';
import { BearerService } from './bearer.service';

@Injectable({ providedIn: 'root' })
export class EtapaBoletaService {
  environment = environment;

  constructor(private http: HttpClient, private bearerService: BearerService) {}

  /**
   * Obtiene todas las etapas de boleta para un evento específico
   * @param eventId ID del evento
   */
  getEtapas(eventId: string): Observable<EtapaBoleta[]> {
    return this.http.get<EtapaBoleta[]>(`${this.environment.eventService}/${eventId}/ticket-stages`);
  }

  /**
   * Obtiene una etapa de boleta por su ID
   * @param id ID de la etapa de boleta
   */
  getEtapa(id: string): Observable<EtapaBoleta> {
    return this.http.get<EtapaBoleta>(`${this.environment.eventService}/ticket-stages/${id}`);
  }

  /**
   * Crea una nueva etapa de boleta para un evento
   * @param eventId ID del evento
   * @param etapa Datos de la etapa a crear
   */
  createEtapa(eventId: string, etapa: Omit<EtapaBoleta, 'id'>): Observable<EtapaBoleta> {
    return this.http.post<EtapaBoleta>(
      `${this.environment.eventService}/${eventId}/ticket-stages`,
      etapa, this.bearerService.bearerToken
    );
  }

  /**
   * Actualiza una etapa de boleta existente
   * @param id ID de la etapa a actualizar
   * @param etapa Datos actualizados de la etapa
   */
  updateEtapa(id: string, etapa: Partial<EtapaBoleta>): Observable<EtapaBoleta> {
    return this.http.put<EtapaBoleta>(
      `${this.environment.eventService}/ticket-stages/${id}`,
      etapa
    );
  }

  /**
   * Elimina una etapa de boleta
   * @param id ID de la etapa a eliminar
   */
  deleteEtapa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.environment.eventService}/ticket-stages/${id}`);
  }
}
