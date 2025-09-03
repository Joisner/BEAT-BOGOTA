import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Event } from '../models/event.model';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  environment = environment;
  http = inject(HttpClient);
  private events: Event[] = [
    {
      id: 1,
      name: 'TECHNO INVASION',
      date: new Date('2024-12-15T22:00:00'),
      location: 'Warehouse 47, Bogotá',
      description: 'Una noche de techno puro con DJs internacionales y locales. Prepárate para bailar hasta el amanecer en una experiencia sonora única que te llevará a otro nivel.',
      promotores: ['Rave Masters'],
      contact: {
        type: 'whatsapp',
        value: '573101234567'
      },
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      genre: 'Techno',
      price: { min: 80000, max: 120000, currency: 'COP' },
      tags: ['Techno', 'Underground', 'All Night'],
      capacity: 800,
      featured: true
    },
    {
      id: 2,
      name: 'HOUSE SUNSET GROOVES',
      date: new Date('2024-12-21T16:00:00'),
      location: 'Rooftop 100, Bogotá',
      description: 'Disfruta del mejor deep house y tech house con una vista espectacular del atardecer sobre la ciudad. Una experiencia única que combina música de calidad con ambiente sofisticado.',
      promotores: ['Groove Productions'],
      contact: {
        type: 'link',
        value: 'https://beatbogota.com/tickets/house-sunset'
      },
      imageUrl: 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800&h=600&fit=crop',
      genre: 'House',
      price: { min: 60000, max: 90000, currency: 'COP' },
      tags: ['House', 'Sunset', 'Rooftop'],
      capacity: 300,
      featured: true
    },
    {
      id: 3,
      name: 'PSYTRANCE FOREST GATHERING',
      date: new Date('2025-01-05T20:00:00'),
      location: 'La Calera, Cundinamarca',
      description: 'Un viaje místico a través del sonido y la naturaleza. Experiencia full-on psytrance en medio del bosque con visuales psicodélicos y una comunidad vibrante.',
      promotores: ['Cosmic Tribe'],
      contact: {
        type: 'whatsapp',
        value: '573117654321'
      },
      imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=600&fit=crop',
      genre: 'Psytrance',
      price: { min: 40000, currency: 'COP' },
      tags: ['Psytrance', 'Nature', 'Psychedelic'],
      capacity: 500,
      featured: false
    },
    {
      id: 4,
      name: 'ELECTRONIC PARADISE',
      date: new Date('2025-01-12T21:00:00'),
      location: 'Centro de Convenciones, Medellín',
      description: 'El festival de música electrónica más grande del año. Múltiples escenarios con los mejores DJs nacionales e internacionales. Una experiencia completa de 12 horas.',
      promotores: ['Electronic Colombia'],
      contact: {
        type: 'link',
        value: 'https://electronicparadise.co/tickets'
      },
      imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
      genre: 'Multi-género',
      price: { min: 150000, max: 300000, currency: 'COP' },
      tags: ['Festival', 'Multi-stage', 'International'],
      capacity: 5000,
      featured: true
    }
  ];

  constructor() { }

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
      map((response: any) => response.data)
    )
  }
private get bearerToken(): { headers: { [key: string]: string } } {
  const token = localStorage.getItem('auth_token'); // Get the token from your auth service or storage
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
}
  addEvent(eventData: Event): Observable<Event> {
    return this.http.post(`${environment.eventService}`, eventData, this.bearerToken).pipe(
      map((response: any) => response.data)
    )
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete(`${environment.eventService}/${id}`).pipe(
      map((response: any) => response.data)
    )
  }

  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    return this.http.put(`${environment.eventService}/${id}`, eventData).pipe(
      map((response: any) => response.data)
    )
  }

  getEventsByGenre(genre: string): Observable<Event[]> {
    return of(this.events.filter(event => event.genre?.toLowerCase().includes(genre.toLowerCase())));
  }
}