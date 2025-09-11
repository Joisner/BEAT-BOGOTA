import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  loading = false;
  returnUrl: string = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el usuario guardado
    const savedUser = localStorage.getItem('currentUser');
    
    // Si hay un usuario guardado, redirigir según su rol
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.redirectBasedOnRole(user);
      return;
    }
    
    // Si no hay usuario guardado pero está autenticado, obtener el usuario actual
    if (this.authService.isAuthenticated()) {
      const subscription = this.authService.currentUser$.subscribe({
        next: (user) => {
          if (user) {
            this.redirectBasedOnRole(user);
            subscription.unsubscribe(); // Importante: desuscribirse para evitar fugas de memoria
          }
        },
        error: (error) => {
          console.error('Error al obtener el usuario actual:', error);
          subscription.unsubscribe();
        }
      });
    }
  }

  // Método auxiliar para redirigir según el rol
  private redirectBasedOnRole(user: any): void {
    if (user.role === 'admin') {
      this.router.navigate(['/admin/events']);
    } else if (user.role === 'promotor') {
      this.router.navigate(['/promotor']);
    } else if (user.role === 'asistente') {
      this.router.navigate(['/asistente']);
    } else {
      this.router.navigate(['/events']);
    }
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingrese su correo y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.login(this.email, this.password);
      // No es necesario redirigir aquí, ya que el servicio se encarga de eso
    } catch (error: any) {
      this.error = error.message || 'Error al iniciar sesión. Por favor intente de nuevo.';
      console.error('Login error:', error);
    } finally {
      this.loading = false;
    }
  }

  async onGoogleLogin() {
    this.loading = true;
    this.error = '';
    debugger;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      this.error = error.message || 'Error al iniciar sesión con Google. Por favor intente de nuevo.';
      console.error('Google login error:', error);
    } finally {
      this.loading = false;
    }
  }
}
