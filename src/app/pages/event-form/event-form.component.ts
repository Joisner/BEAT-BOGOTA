import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { IconsModule } from '../../core/module/icons.module';
import { LucideAngularModule } from 'lucide-angular';

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
      tagsInput: [''] // Campo temporal para capturar las etiquetas como string
    });

    // Validador personalizado para asegurar que el precio máximo sea mayor al mínimo
    this.eventForm.get('price')?.setValidators(this.priceRangeValidator);
  }

  // Validador personalizado para el rango de precios
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
    
    // Procesar las etiquetas
    const tags = formValue.tagsInput 
      ? formValue.tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];

    // Preparar los datos del evento
    const eventData = {
      name: formValue.name,
      date: new Date(formValue.date),
      location: formValue.location,
      description: formValue.description,
      promoter: formValue.promoter,
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

    this.eventService.addEvent(eventData).subscribe({
      next: (createdEvent) => {
        console.log('Event created successfully!', createdEvent);
        this.showSuccessMessage();
        // Redirigir al evento creado después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          this.router.navigate(['/events', createdEvent.id]);
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating event:', err);
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