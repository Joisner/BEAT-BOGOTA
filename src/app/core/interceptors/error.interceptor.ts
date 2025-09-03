import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError, Observable } from 'rxjs';

export const errorInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const toastr = inject(ToastrService);
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';
      
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión.';
        } else if (error.status === 400) {
          errorMessage = error.error.message || 'Solicitud incorrecta';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción';
        } else if (error.status === 404) {
          errorMessage = 'Recurso no encontrado';
        } else if (error.status === 422) {
          errorMessage = 'Error de validación';
          // Mostrar errores de validación específicos si están disponibles
          if (error.error.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            validationErrors.forEach((err: any) => {
              toastr.error(err, 'Error de validación');
            });
            return throwError(() => error);
          }
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor. Por favor, inténtalo más tarde.';
        }
      }
      
      // Mostrar el mensaje de error
      toastr.error(errorMessage, 'Error');
      
      return throwError(() => error);
    })
  );
};
