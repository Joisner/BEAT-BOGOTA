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
      name: 'Techno Invasion',
      date: new Date('2024-09-15T22:00:00'),
      location: 'Warehouse 47, Bogotá',
      description: 'A night of pure techno with international and local DJs. Get ready to dance until dawn.',
      promoter: 'Rave Masters',
      contact: {
        type: 'whatsapp',
        value: '573101234567'
      }
    },
    {
      id: 2,
      name: 'House Sunset Grooves',
      date: new Date('2024-09-21T16:00:00'),
      location: 'Rooftop 100, Bogotá',
      description: 'Enjoy the best deep house and tech house with a stunning sunset view of the city.',
      promoter: 'Groove Productions',
      contact: {
        type: 'link',
        value: 'https://beatbogota.com/tickets/house-sunset'
      }
    },
    {
      id: 3,
      name: 'Psytrance Forest Gathering',
      date: new Date('2024-10-05T20:00:00'),
      location: 'La Calera, Cundinamarca',
      description: 'A mystical journey through sound and nature. Full-on psytrance experience.',
      promoter: 'Cosmic Tribe',
      contact: {
        type: 'whatsapp',
        value: '573117654321'
      }
    }
  ];

  constructor() { }

  getEvents(): Observable<Event[]> {
    return of(this.events);
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
}
