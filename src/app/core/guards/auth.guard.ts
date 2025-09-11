import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly adminRoutes = [
    '/admin/events',
    '/admin/events/new',
    '/admin/events/edit',
    '/admin/promotores',
    '/admin/descuentos',
    '/admin/descuentos/new',
    '/admin/descuentos/edit',
    '/admin/etapas-boleta',
    '/admin/etapas-boleta/new',
    '/admin/etapas-boleta/edit'
  ];

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the requested URL is an admin route
    const isAdminRoute = this.isAdminRoute(state.url);
    
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        // If user is not authenticated, redirect to login
        if (!user) {
          return of(this.redirectToLogin(state.url));
        }

        // For admin routes, check if user has admin role
        if (isAdminRoute && user.role !== 'admin') {
          return of(this.redirectToEvents());
        }

        // Check if token is about to expire (within 5 minutes)
        return this.checkTokenValidity().pipe(
          map(isValid => {
            if (!isValid) {
              return this.redirectToEvents();
            }
            return true;
          }),
          catchError(() => of(this.redirectToEvents()))
        );
      })
    );
  }

  private isAdminRoute(url: string): boolean {
    return this.adminRoutes.some(route => url.startsWith(route));
  }

  private redirectToLogin(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl }
    });
  }

  private redirectToEvents(): UrlTree {
    return this.router.createUrlTree(['/events']);
  }

  private checkTokenValidity(): Observable<boolean> {
    // Try to refresh the token to check if it's still valid
    return from(this.authService.refreshToken()
      .then(token => !!token)
      .catch(() => false)
    );
  }
}
