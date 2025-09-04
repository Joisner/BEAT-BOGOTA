import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';
import { PromotorService } from '../../../core/services/promotor.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Promotor } from '../../../core/models/promotor.model';

@Component({
  selector: 'app-promoter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, IconsModule],
  templateUrl: './promoter-form.component.html',
  styleUrl: './promoter-form.component.css'
})
export class PromoterFormComponent {
  promotorForm!: FormGroup
  isSubmitting = false
  editMode = false
  private promotorId: string | null = null
  pageTitle = "Crear Nuevo Promotor"
  submitButtonText = "Crear Promotor"

  constructor(
    private fb: FormBuilder,
    private promotorService: PromotorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.checkMode()
  }

  private initForm(): void {
    this.promotorForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      bio: ["", [Validators.maxLength(500)]],
      socialMedia: this.fb.group({
        instagram: [""],
        facebook: [""],
        twitter: [""],
        website: [""],
      }),
      profileImage: [""],
      specialties: [""],
      experience: ["", [Validators.min(0)]],
      location: [""],
      featured: [false],
    })
  }

  private checkMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.editMode = true
        this.promotorId = id
        this.pageTitle = "Editar Promotor"
        this.submitButtonText = "Guardar Cambios"
        this.loadPromotorData(this.promotorId)
      }
    })
  }

  private loadPromotorData(id: string): void {
    this.promotorService.getPromotor(id).subscribe({
      next: (promotor: Promotor) => {
        if (promotor) {
          this.promotorForm.patchValue({
            ...promotor,
          })
        } else {
          this.router.navigate(["/admin/promotores"])
        }
      },
      error: () => this.router.navigate(["/admin/promotores"]),
    })
  }

  onSubmit(): void {
    if (this.promotorForm.invalid) {
      this.promotorForm.markAllAsTouched()
      this.showFormErrors()
      return
    }

    this.isSubmitting = true
    const formValue = this.promotorForm.value

    const specialties = formValue.specialties
      ? formValue.specialties
          .split(",")
          .map((specialty: string) => specialty.trim())
          .filter((specialty: string) => specialty)
      : []

    const promotorData: Partial<Promotor> = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      whatsapp: formValue.whatsapp,
      profile_url: formValue.profileImage || this.getDefaultProfileImage(),
    }

    const operation =
      this.editMode && this.promotorId
        ? this.promotorService.updatePromotor(this.promotorId, promotorData)
        : this.promotorService.createPromotor(promotorData as Promotor)

    operation.subscribe({
      next: (result) => {
        this.showSuccessMessage()
        setTimeout(() => {
          this.router.navigate(["/admin/promotores"])
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

  private showFormErrors(): void {
    console.log("Form has errors, please check all fields")
    const firstError = document.querySelector(".text-red-400")
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  private showSuccessMessage(): void {
    console.log("¡Promotor creado exitosamente!")
  }

  private showErrorMessage(): void {
    console.log("Error al crear el promotor. Por favor intenta de nuevo.")
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.promotorForm.get(fieldName)
    return field ? field.invalid && field.touched : false
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.promotorForm.get(`${groupName}.${fieldName}`)
    return field ? field.invalid && field.touched : false
  }

  getFieldError(fieldName: string): string {
    const field = this.promotorForm.get(fieldName)
    if (!field || !field.errors || !field.touched) {
      return ""
    }

    if (field.errors["required"]) {
      return "Este campo es requerido"
    }
    if (field.errors["minlength"]) {
      return `Mínimo ${field.errors["minlength"].requiredLength} caracteres`
    }
    if (field.errors["maxlength"]) {
      return `Máximo ${field.errors["maxlength"].requiredLength} caracteres`
    }
    if (field.errors["email"]) {
      return "Email inválido"
    }
    if (field.errors["min"]) {
      return `El valor mínimo es ${field.errors["min"].min}`
    }

    return "Campo inválido"
  }

  previewImage(): string | null {
    const imageUrl = this.promotorForm.get("profileImage")?.value
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
    this.promotorForm.reset({
      featured: false,
    })
  }
}

