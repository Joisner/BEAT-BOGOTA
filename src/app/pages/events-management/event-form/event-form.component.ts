import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { IconsModule } from '../../../core/module/icons.module';
import { LucideAngularModule } from 'lucide-angular';
import { Event } from '../../../core/models/event.model';
import { PromotorService } from '../../../core/services/promotor.service';
import { Promotor } from '../../../core/models/promotor.model';
import { EtapaBoletaService } from '../../../core/services/etapa-boleta.service';
import { EtapaBoleta } from '../../../core/models/etapa-boleta.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconsModule,
    LucideAngularModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isSubmitting = false;
  editMode = false;
  private eventId: number | null = null;
  pageTitle = 'Crear Nuevo Evento';
  submitButtonText = 'Crear Evento';

  promotores: Promotor[] = [];
  etapas: EtapaBoleta[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private promotorService: PromotorService,
    private etapaBoletaService: EtapaBoletaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    debugger;
    this.initForm();
    this.checkMode();
    this.promotorService.getPromotores().subscribe({
      next: (promotores) => {
        this.promotores = promotores;
      },
      error: (error) => {
        console.error(`${`No fue posible cargar promotores ${error}`}`)
      }
    });
    this.etapaBoletaService.getEtapas(this.eventId!.toString()).subscribe({
      next: (etapas) => {
        this.etapas = etapas;
      },
      error: (error) => {
        console.error(`${`No fue posible cargar etapas ${error}`}`)
      }
    });
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      promotores: [[], [Validators.required]],
      etapas: [[], [Validators.required]],
      imageUrl: [''],
      genre: ['', [Validators.required]],
      capacity: ['', [Validators.min(1)]],
      featured: [false],
      price: this.fb.group({
        min: ['', [Validators.min(0)]],
        max: ['', [Validators.min(0)]],
        currency: ['COP', [Validators.required]]
      }),
      contact: this.fb.group({
        type: ['whatsapp', [Validators.required]],
        value: ['', [Validators.required]]
      }),
      tagsInput: ['']
    });
    this.eventForm.get('price')?.setValidators(this.priceRangeValidator);
  }

  private checkMode(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.eventId = +id;
        this.pageTitle = 'Editar Evento';
        this.submitButtonText = 'Guardar Cambios';
        this.loadEventData(this.eventId);
      }
    });
  }

  private loadEventData(id: number): void {
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        debugger;
        if (event) {
          this.eventForm.patchValue({
            ...event,
            date: this.formatDateForInput(event.date),
            tagsInput: event.tags?.join(', ') || ''
          });
        } else {
          // Handle case where event is not found
          this.router.navigate(['/admin/events']);
        }
      },
      error: () => this.router.navigate(['/admin/events'])
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  priceRangeValidator(group: any) {
    const min = group.get('min')?.value;
    const max = group.get('max')?.value;
    if (min && max && parseFloat(max) <= parseFloat(min)) {
      return { priceRangeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.showFormErrors();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.eventForm.value;
    
    const tags = formValue.tagsInput 
      ? formValue.tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];

    const eventData: Partial<Event> = {
      name: formValue.name,
      date: new Date(formValue.date),
      location: formValue.location,
      description: formValue.description,
      promotores: formValue.promotores,
      imageUrl: formValue.imageUrl || this.getDefaultImage(formValue.genre),
      genre: formValue.genre,
      capacity: formValue.capacity ? parseInt(formValue.capacity) : undefined,
      featured: formValue.featured || false,
      price: this.buildPriceObject(formValue.price),
      contact: {
        type: formValue.contact.type,
        value: formValue.contact.value
      },
      tags: tags.length > 0 ? tags : undefined
    };

    this.eventService.addEvent(eventData as Event).subscribe({
      next: (result) => {
        debugger;
        this.showSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/admin/events']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error saving event:', err);
        this.showErrorMessage();
        this.isSubmitting = false;
      }
    });
    const operation = this.editMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, eventData)
      : this.eventService.addEvent(eventData as Event);

    operation.subscribe({
      next: (result) => {
        this.showSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/admin/events']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error saving event:', err);
        this.showErrorMessage();
        this.isSubmitting = false;
      }
    });
  }

  private buildPriceObject(priceForm: any) {
    if (!priceForm.min && !priceForm.max) {
      return undefined;
    }

    const priceObj: any = {
      currency: priceForm.currency || 'COP'
    };

    if (priceForm.min) {
      priceObj.min = parseFloat(priceForm.min);
    }

    if (priceForm.max) {
      priceObj.max = parseFloat(priceForm.max);
    }

    return priceObj;
  }

  private getDefaultImage(genre: string): string {
    // Retorna una imagen por defecto basada en el género
    const defaultImages: { [key: string]: string } = {
      'Techno': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'House': 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800&h=600&fit=crop',
      'Psytrance': 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=600&fit=crop',
      'Trance': 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
      'Progressive': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      'Drum & Bass': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'Dubstep': 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800&h=600&fit=crop',
      'Multi-género': 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop'
    };

    return defaultImages[genre] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop';
  }

  private showFormErrors(): void {
    // Aquí puedes implementar un sistema de notificaciones
    console.log('Form has errors, please check all fields');
    
    // Scroll al primer error
    const firstError = document.querySelector('.text-red-400');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private showSuccessMessage(): void {
    // Implementa aquí tu sistema de notificaciones de éxito
    console.log('¡Evento creado exitosamente!');
  }

  private showErrorMessage(): void {
    // Implementa aquí tu sistema de notificaciones de error
    console.log('Error al crear el evento. Por favor intenta de nuevo.');
  }

  // Métodos auxiliares para mejorar la UX
  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.eventForm.get(`${groupName}.${fieldName}`);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo es requerido';
    }
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    if (field.errors['min']) {
      return `El valor mínimo es ${field.errors['min'].min}`;
    }

    return 'Campo inválido';
  }

  // Método para preview de imagen
  previewImage(): string | null {
    const imageUrl = this.eventForm.get('imageUrl')?.value;
    if (imageUrl && this.isValidUrl(imageUrl)) {
      return imageUrl;
    }
    return null;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Método para formatear el contacto según el tipo seleccionado
  formatContactPlaceholder(): string {
    const contactType = this.eventForm.get('contact.type')?.value;
    return contactType === 'whatsapp' 
      ? 'ej. 573101234567 (sin espacios ni símbolos)'
      : 'ej. https://ticketshop.com/mi-evento';
  }

  // Método para validar el formato del número de WhatsApp
  isValidWhatsAppNumber(number: string): boolean {
    const whatsappRegex = /^[1-9]\d{8,14}$/;
    return whatsappRegex.test(number);
  }

  // Método para limpiar el formulario
  resetForm(): void {
    this.eventForm.reset({
      contact: { type: 'whatsapp' },
      price: { currency: 'COP' },
      featured: false
    });
  }
}