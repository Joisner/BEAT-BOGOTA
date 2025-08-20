import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event$!: Observable<Event | null | undefined>;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.event$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.eventService.getEvent(+id).pipe(
            catchError(err => {
              console.error(err);
              // Return null if event not found or on error
              return of(null);
            })
          );
        }
        // Return null if no ID is present in the URL
        return of(null);
      })
    );
  }
}
