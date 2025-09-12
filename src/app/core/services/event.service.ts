import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Event } from '../models/event.model';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { environment } from '../../env/environment';
import { BearerService } from './bearer.service'; 

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [];

  constructor(
    private http: HttpClient,
    private bearerService: BearerService
  ) {}


  getEvents(): Observable<Event[]> {
    // First try to fetch from the API
    return this.http.get<Event[]>(`${environment.eventService}`).pipe(
      // If successful, use the API data
      map((response: any) => response.data || response),
      // If there's an error, fall back to mock data
      catchError(error => {
        console.warn('Failed to fetch events from API, using mock data', error);
        return of(this.events);
      })
    );
  }

  getFeaturedEvents(): Observable<Event[]> {
    return of(this.events.filter(event => event.featured));
  }

  getEvent(id: number): Observable<Event | undefined> {
    debugger;
    return this.http.get(`${environment.eventService}/${id}`).pipe(
      map((response: any) => response)
    )
  }

  addEvent(eventData: Event): Observable<Event> {
    return this.http.post(`${environment.eventService}`, eventData, this.bearerService.bearerToken).pipe(
      map((response: any) => response.data)
    )
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete(`${environment.eventService}/${id}`).pipe(
      map((response: any) => response.data)
    )
  }

  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    return this.http.put(`${environment.eventService}/${id}`, eventData, this.bearerService.bearerToken).pipe(
      map((response: any) => response.data)
    )
  }

  getEventsByGenre(genre: string): Observable<Event[]> {
    return of(this.events.filter(event => event.genre?.toLowerCase().includes(genre.toLowerCase())));
  }
}