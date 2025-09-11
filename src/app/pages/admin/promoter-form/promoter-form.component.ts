import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';
import { PromoterService } from '../../../core/services/promoter.service';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Promoter } from '../../../core/models/promoter.model';
import { UserService } from '../../../core/services/user.service';
import { UserAuth } from '../../../core/models/users.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-promoter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, IconsModule],
  templateUrl: './promoter-form.component.html',
  styleUrl: './promoter-form.component.css'
})
export class PromoterFormComponent {
  promoterForm!: FormGroup
  isSubmitting = false
  isEditMode = false
  private promoterId: string | null = null
  pageTitle = "Crear Nuevo Promotor"
  submitButtonText = "Crear Promotor"
  promoters: UserAuth[] = []
  constructor(
    private fb: FormBuilder,
    private promoterService: PromoterService,
    private formValidationService: FormValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.checkMode()
    this.getPromoters()
  }

  private initForm(): void {
    this.promoterForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastname: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      promotores: this.fb.control([])
    })
  }

  private checkMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.isEditMode = true
        this.promoterId = id
        this.pageTitle = "Editar Promotor"
        this.submitButtonText = "Guardar Cambios"
        this.loadPromoterData(this.promoterId)
      }
    })
  }

  get hasPromoters(): boolean {
    return this.promoters && this.promoters.length > 0;
  }

  private updateFormState(): void {
    if (!this.hasPromoters && !this.isEditMode) {
      this.promoterForm.disable();
    } else {
      this.promoterForm.enable();
    }
  }

  getPromoters(): void {
    this.userService.getUsers().subscribe({
      next: (promoters: UserAuth[]) => {
        this.promoters = promoters.filter((user: UserAuth) => user.role === 'promoter')
        this.updateFormState();
      },
      error: () => this.router.navigate(["/admin/promotores"]),
    });
  }
  private loadPromoterData(id: string): void {
    this.promoterService.getPromoter(id).subscribe({
      next: (promoter: Promoter) => {
        debugger;
        if (promoter) {
          this.promoterForm.patchValue({
            ...promoter,
          })
        } else {
          this.router.navigate(["/admin/promotores"])
        }
      },
      error: () => this.router.navigate(["/admin/promotores"]),
    })
  }

  onPromoterSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedIds = Array.from(select.selectedOptions).map(opt => opt.value);
    
    console.log('🎯 Selected IDs:', selectedIds);
    
    if (selectedIds.length > 0) {
      const selectedPromoter = this.promoters.find(p => p.id === selectedIds[0].split("'")[1]);
      
      if (selectedPromoter) {
        console.log('🎯 Found promoter:', selectedPromoter);
        
        this.promoterForm.patchValue({
          name: selectedPromoter.name,
          lastname: selectedPromoter.lastname, // Make sure this matches the form control name
          email: selectedPromoter.email,
        });
        
        console.log('🎯 Form values after patch:', this.promoterForm.value);
      }
    }
  }



  onSubmit(): void {
    if (this.promoterForm.invalid) {
      this.promoterForm.markAllAsTouched()
      this.showFormErrors()
      return
    }

    this.isSubmitting = true
    const formValue = this.promoterForm.value

    const specialties = formValue.specialties
      ? formValue.specialties
        .split(",")
        .map((specialty: string) => specialty.trim())
        .filter((specialty: string) => specialty)
      : []

    const promoterData: Partial<Promoter> = {
      name: formValue.name,
      user_email: formValue.email,
      phone: formValue.phone,
      whatsapp: formValue.phone,
      profile_url: formValue.profileImage || this.getDefaultProfileImage(),
    }

    const operation =
      this.isEditMode && this.promoterId
        ? this.promoterService.updatePromoter(this.promoterId, promoterData)
        : this.promoterService.createPromoter(promoterData as Promoter)

    operation.subscribe({
      next: (result) => {
        this.showSuccessMessage()
        setTimeout(() => {
          this.router.navigate(["/admin/promotores"])
          this.notificationService.success(`Promotor ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`)
        }, 1500)
      },
      error: (err) => {
        console.error("Error saving promotor:", err)
        this.showErrorMessage()
        this.isSubmitting = false
      },
    })
  }

  private getDefaultProfileImage(): string {
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  }

  showFormErrors(): void {
    this.formValidationService.showFormErrors('El formulario tiene errores, por favor verifica todos los campos');
  }

  private showSuccessMessage(): void {
    const message = this.isEditMode
      ? '¡Promotor actualizado exitosamente!'
      : '¡Promotor creado exitosamente!';
    this.formValidationService.showSuccessMessage(message);
  }

  private showErrorMessage(): void {
    const message = this.isEditMode
      ? 'Error al actualizar el promotor. Por favor intenta de nuevo.'
      : 'Error al crear el promotor. Por favor intenta de nuevo.';
    this.formValidationService.showErrorMessage(message);
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formValidationService.isFieldInvalid(this.promoterForm, fieldName);
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    return this.formValidationService.isNestedFieldInvalid(this.promoterForm, groupName, fieldName);
  }

  getFieldError(fieldName: string): string {
    const field = this.promoterForm.get(fieldName);
    return this.formValidationService.getFieldError(field);
  }

  previewImage(): string | null {
    const imageUrl = this.promoterForm.get("profileImage")?.value
    if (imageUrl && this.isValidUrl(imageUrl)) {
      return imageUrl
    }
    return null
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  resetForm(): void {
    this.promoterForm.reset({
      featured: false,
    })
  }
}

