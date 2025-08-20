import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      promoter: ['', [Validators.required]],
      contact: this.fb.group({
        type: ['whatsapp', [Validators.required]],
        value: ['', [Validators.required]]
      })
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const formValue = this.eventForm.value;
    const eventData = {
      ...formValue,
      date: new Date(formValue.date)
    };

    this.eventService.addEvent(eventData).subscribe({
      next: () => {
        console.log('Event created successfully!');
        this.router.navigate(['/events']);
      },
      error: (err) => console.error('Error creating event:', err)
    });
  }
}
