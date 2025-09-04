import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { Event } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';
import { IconsModule } from '../../../core/module/icons.module';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events$!: Observable<Event[]>;
  filteredEvents$!: Observable<Event[]>;
  featuredEvents$!: Observable<Event[]>;
  allEvents$!: Observable<Event[]>;

  selectedGenre = 'all';
  genres = ['all', 'techno', 'house', 'psytrance', 'trance', 'progressive', 'drum & bass', 'dubstep'];

  // Track quantity per eventId
  quantities: { [eventId: string]: number } = {};

  private destroy$ = new Subject<void>();
  private genreFilter$ = new Subject<string>();

  constructor(private eventService: EventService, private cartService: CartService) { }

  setQuantity(eventId: string, value: number) {
    this.quantities[eventId] = value;
  }

  getQuantity(eventId: string): number {
    return this.quantities[eventId] || 1;
  }

  addToCart(event: Event) {
    const quantity = this.getQuantity(String(event.id));
    this.cartService.addItem({
      eventId: String(event.id),
      eventName: event.name,
      price: event.price?.min || 0,
      quantity: quantity
    });
    // Optionally reset quantity to 1 after adding
    this.quantities[String(event.id)] = 1;
  }

  ngOnInit(): void {
    debugger;
    // Cargar todos los eventos
    this.events$ = this.eventService.getEvents();
    debugger;
    // Configurar eventos destacados
    this.featuredEvents$ = this.events$.pipe(
      map(events => events.filter(event => event.featured))
    );

    // Configurar todos los eventos (no destacados también incluidos)
    this.allEvents$ = this.events$;

    // Configurar filtro por género
    this.filteredEvents$ = combineLatest([
      this.events$,
      this.genreFilter$.pipe(startWith('all'))
    ]).pipe(
      map(([events, genre]) => {
        if (genre === 'all') {
          return events;
        }
        return events.filter(event =>
          event.genre?.toLowerCase().includes(genre.toLowerCase())
        );
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filtrar eventos por género
  filterByGenre(genre: string): void {
    this.selectedGenre = genre;
    this.genreFilter$.next(genre);
  }

  // Verificar si un género está activo
  isGenreActive(genre: string): boolean {
    return this.selectedGenre === genre;
  }

  // Obtener clase CSS para el filtro de género
  getGenreFilterClass(genre: string): string {
    const baseClasses = 'px-4 py-2 rounded-full font-medium text-sm transition-all duration-300';

    if (this.isGenreActive(genre)) {
      switch (genre) {
        case 'techno':
          return `${baseClasses} bg-purple-500/30 border-purple-400 text-purple-300`;
        case 'house':
          return `${baseClasses} bg-pink-500/30 border-pink-400 text-pink-300`;
        case 'psytrance':
          return `${baseClasses} bg-yellow-500/30 border-yellow-400 text-yellow-300`;
        case 'trance':
          return `${baseClasses} bg-cyan-500/30 border-cyan-400 text-cyan-300`;
        default:
          return `${baseClasses} bg-purple-500/30 border-purple-400 text-purple-300`;
      }
    }

    // Estado inactivo
    switch (genre) {
      case 'techno':
        return `${baseClasses} border border-purple-500/50 text-purple-300 hover:bg-purple-500/20`;
      case 'house':
        return `${baseClasses} border border-pink-500/50 text-pink-300 hover:bg-pink-500/20`;
      case 'psytrance':
        return `${baseClasses} border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20`;
      case 'trance':
        return `${baseClasses} border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20`;
      default:
        return `${baseClasses} border border-purple-500/50 text-purple-300 hover:bg-purple-500/20`;
    }
  }

  // Formatear fecha para mostrar
  formatEventDate(date: Date): string {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Mañana';
    } else if (diffDays > 0 && diffDays <= 7) {
      return `En ${diffDays} días`;
    } else if (diffDays < 0) {
      return 'Evento pasado';
    }

    return eventDate.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  // Verificar si un evento es próximo (dentro de los próximos 3 días)
  isUpcoming(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 3;
  }

  // Verificar si un evento ya pasó
  isPastEvent(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);
    return eventDate < now;
  }

  // Obtener color del género para badges
  getGenreColor(genre: string): string {
    switch (genre?.toLowerCase()) {
      case 'techno':
        return 'bg-purple-500/80 text-white';
      case 'house':
        return 'bg-pink-500/80 text-white';
      case 'psytrance':
        return 'bg-yellow-500/80 text-black';
      case 'trance':
        return 'bg-cyan-500/80 text-white';
      case 'progressive':
        return 'bg-blue-500/80 text-white';
      case 'drum & bass':
        return 'bg-green-500/80 text-white';
      case 'dubstep':
        return 'bg-red-500/80 text-white';
      default:
        return 'bg-gray-500/80 text-white';
    }
  }

  // Obtener icono del género
  getGenreIcon(genre: string): string {
    switch (genre?.toLowerCase()) {
      case 'techno':
        return 'zap';
      case 'house':
        return 'home';
      case 'psytrance':
        return 'eye';
      case 'trance':
        return 'radio';
      case 'progressive':
        return 'trending-up';
      case 'drum & bass':
        return 'activity';
      case 'dubstep':
        return 'volume-x';
      default:
        return 'music';
    }
  }

  // Formatear precio para mostrar
  formatPrice(price: any): string {
    if (!price || !price.min) {
      return 'Gratis';
    }

    const currency = price.currency === 'COP' ? '$' : price.currency;
    const min = this.formatNumber(price.min);

    if (price.max && price.max !== price.min) {
      const max = this.formatNumber(price.max);
      return `${currency}${min} - ${currency}${max}`;
    }

    return `${currency}${min}`;
  }

  // Formatear números con separadores de miles
  private formatNumber(num: number): string {
    return new Intl.NumberFormat('es-CO').format(num);
  }

  // Obtener imagen por defecto si no hay imagen
  getEventImage(event: Event): string {
    return event.imageUrl || this.getDefaultImageByGenre(event.genre || '');
  }

  private getDefaultImageByGenre(genre: string): string {
    const defaultImages: { [key: string]: string } = {
      'techno': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'house': 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800&h=600&fit=crop',
      'psytrance': 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=600&fit=crop',
      'trance': 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
    };

    return defaultImages[genre.toLowerCase()] || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop';
  }
}
