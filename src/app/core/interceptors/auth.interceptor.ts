import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, mergeMap, take, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding token for authentication requests
    if (request.url.includes('/auth/') || request.url.includes('firebase')) {
      return next.handle(request);
    }

    const token = this.authService.getToken();
    
    // If no token, just continue with the request (it will fail with 401 if protected)
    if (!token) {
      return next.handle(request);
    }

    // Clone the request and add the token to the headers
    const authReq = this.addTokenToRequest(request, token);

    // Handle the request and catch 401 errors
    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized) {
          // Try to refresh the token
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return from(this.authService.refreshToken()).pipe(
        mergeMap((newToken) => {
          this.isRefreshing = false;
          
          if (newToken) {
            this.refreshTokenSubject.next(newToken);
            // Retry the original request with the new token
            return next.handle(this.addTokenToRequest(request, newToken));
          }
          
          // If refresh failed, log out and redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => new Error('Session expired. Please log in again.'));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    } else {
      // If token is being refreshed, wait for it to complete and retry
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        mergeMap(token => {
          return next.handle(this.addTokenToRequest(request, token as string));
        })
      );
    }
  }
}
