import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Event } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';
import { PromotorService } from '../../../core/services/promotor.service';
import { Promotor } from '../../../core/models/promotor.model';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, IconsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events$!: Observable<Event[]>;
  promotores: Promotor[] = [];

  constructor(private eventService: EventService, private promotorService: PromotorService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getEvents();
    this.promotorService.getPromotores().subscribe(promotores => {
      this.promotores = promotores;
    });
  }

  getPromotorNombres(ids: string[]): string {
    if (!ids || !Array.isArray(ids)) return '';
    return this.promotores
      .filter(p => ids.includes(p.id))
      .map(p => p.name)
      .join(', ');
  }

  deleteEvent(eventId: number): void {
    // Usar una confirmación antes de borrar
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          // Refrescar la lista de eventos
          this.events$ = this.eventService.getEvents();
          // Aquí podrías añadir una notificación de éxito
          console.log(`Evento con id: ${eventId} eliminado exitosamente.`);
        },
        error: (err) => {
          // Manejo de errores, por ejemplo, mostrar una notificación
          console.error('Error al eliminar el evento:', err);
        }
      });
    }
  }
}
