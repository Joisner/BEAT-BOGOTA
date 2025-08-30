import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';
    this.authService.login(this.email, this.password)
      .then(user => {
        // Redirige o realiza acciones tras el login exitoso
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.error = 'Usuario o contraseña incorrectos';
      });
  }

  loginWithGoogle() {
    this.error = '';
    this.authService.loginWithGoogle()
      .then(user => {
        debugger;
        localStorage.setItem('auth_firebase', JSON.stringify(user.providerData))
        this.router.navigate(['/admin/events']);
      })
      .catch(err => {
        this.error = 'No se pudo iniciar sesión con Google';
      });
  }
}
