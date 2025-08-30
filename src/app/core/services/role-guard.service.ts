import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

canActivate(route: any): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const user = this.authService.getCurrentUser(); // Debe retornar el usuario autenticado
    const expectedRole = route.data?.role;
    // Suponiendo que el rol está en user.customClaims.role
    const userRole = (user as any)?.customClaims?.role;
    if (user && userRole === expectedRole) {
        return true;
    }
    // Redirige según el rol o a login
    if (user && userRole === 'promotor') {
        return this.router.parseUrl('/promotor/profile');
    }
    if (user && userRole === 'asistente') {
        return this.router.parseUrl('/asistente/profile');
    }
    return this.router.parseUrl('/login');
}
}
