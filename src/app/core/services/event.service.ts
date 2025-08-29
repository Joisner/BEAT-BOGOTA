import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [
    {
      id: 1,
      name: 'TECHNO INVASION',
      date: new Date('2024-12-15T22:00:00'),
      location: 'Warehouse 47, Bogotá',
      description: 'Una noche de techno puro con DJs internacionales y locales. Prepárate para bailar hasta el amanecer en una experiencia sonora única que te llevará a otro nivel.',
      promoter: 'Rave Masters',
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
      promoter: 'Groove Productions',
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
      promoter: 'Cosmic Tribe',
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
      promoter: 'Electronic Colombia',
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
    return of(this.events);
  }

  getFeaturedEvents(): Observable<Event[]> {
    return of(this.events.filter(event => event.featured));
  }

  getEvent(id: number): Observable<Event | undefined> {
    const event = this.events.find(e => e.id === id);
    return event ? of(event) : throwError(() => new Error('Event not found'));
  }

  addEvent(eventData: Omit<Event, 'id'>): Observable<Event> {
    const newEvent: Event = {
      id: this.events.length > 0 ? Math.max(...this.events.map(e => e.id)) + 1 : 1,
      ...eventData
    };
    this.events.push(newEvent);
    return of(newEvent);
  }

  deleteEvent(id: number): Observable<void> {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex > -1) {
      this.events.splice(eventIndex, 1);
      return of(undefined);
    } else {
      return throwError(() => new Error('Event not found'));
    }
  }

  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex > -1) {
      const updatedEvent = { ...this.events[eventIndex], ...eventData };
      this.events[eventIndex] = updatedEvent;
      return of(updatedEvent);
    } else {
      return throwError(() => new Error('Event not found'));
    }
  }

  getEventsByGenre(genre: string): Observable<Event[]> {
    return of(this.events.filter(event => event.genre?.toLowerCase().includes(genre.toLowerCase())));
  }
}