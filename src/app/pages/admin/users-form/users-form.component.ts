import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../core/module/icons.module';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { FormValidationService } from '../../../core/services/form-validation.service';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, IconsModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.css'
})
export class UsersFormComponent {
  userForm!: FormGroup;
  editMode = false
  userId: string | null = null
  pageTitle = "Crear Nuevo Usuario"
  submitButtonText = "Crear Usuario"
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
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      role: ["", [Validators.required]]
    })
  }

  checkMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.editMode = true
        this.userId = id
        this.pageTitle = "Editar Usuario"
        this.submitButtonText = "Guardar Cambios"
        this.loadUserData(this.userId)
      }
    })
  }

  loadUserData(id: string){
   /*  this.userService.getUserById(id).subscribe((user) => {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role
      })
    }) */
  }

  onSubmit(){
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched()
      this.showFormErrors()
      return
    }
  }
  
  private showFormErrors(): void {
   this.formValidationService.showFormErrors();
  }
}
