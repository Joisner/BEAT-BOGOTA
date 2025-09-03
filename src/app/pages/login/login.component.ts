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
    debugger;
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
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
      this.router.navigate([this.returnUrl]);
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
