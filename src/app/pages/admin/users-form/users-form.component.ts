import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../core/module/icons.module';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { UserAuth } from '../../../core/models/users.model';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, IconsModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.css'
})
export class UsersFormComponent {
  userForm!: FormGroup;
  editMode = false;
  userId: string | null = null;
  loading = false;
  showPassword = false;

  // Page content
  pageTitle = 'Crear Nuevo Usuario';
  submitButtonText = 'Crear Usuario';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {

  }
  ngOnInit(): void {
    this.initForm()
    this.checkMode()
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
    });
  }

  checkMode(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.userId = id;
      this.pageTitle = 'Editar Usuario';
      this.submitButtonText = 'Actualizar Usuario';
      this.loadUser(id);
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (user: UserAuth) => {
        this.userForm.patchValue({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role
        });
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
        this.notificationService.error('Error', 'No se pudo cargar la información del usuario');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showFormErrors();
      return;
    }

    this.loading = true;
    const userData: Partial<UserAuth> = { ...this.userForm.value };

    const request = this.editMode && this.userId
      ? this.userService.updateUser(this.userId, userData)
      : this.userService.createUser({
        name: userData.name || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        role: (userData.role as 'ADMIN' | 'PROMOTER' | 'ASSISTANT') || 'user'
      });

    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        const message = this.editMode ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente';
        this.notificationService.success('Éxito', message);
        this.router.navigate(['/admin/users']);
      },
      error: (error: any) => {
        console.error('Error saving user:', error);
        const message = this.editMode
          ? 'No se pudo actualizar el usuario'
          : 'No se pudo crear el usuario';
        this.notificationService.error('Error', message);
      }
    });
  }

  private showFormErrors(): void {
    this.formValidationService.showFormErrors();
  }
}
