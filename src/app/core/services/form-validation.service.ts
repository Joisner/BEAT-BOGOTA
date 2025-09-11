import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  /**
   * Shows form errors and scrolls to the first error
   * @param message Optional custom message to log
   */
  showFormErrors(message: string = 'Form has errors, please check all fields'): void {
    console.log(message);
    const firstError = document.querySelector('.text-red-400');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Shows a success message
   * @param message Custom success message
   */
  showSuccessMessage(message: string = '¡Operación exitosa!'): void {
    console.log(message);
    // You can integrate with a notification service here
  }

  /**
   * Shows an error message
   * @param message Custom error message
   */
  showErrorMessage(message: string = 'Ha ocurrido un error. Por favor intenta de nuevo.'): void {
    console.error(message);
    // You can integrate with a notification service here
  }

  /**
   * Checks if a form field is invalid
   */
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Checks if a nested form field is invalid
   */
  isNestedFieldInvalid(form: FormGroup, groupName: string, fieldName: string): boolean {
    const field = form.get(`${groupName}.${fieldName}`);
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Gets the error message for a form field
   */
  getFieldError(control: AbstractControl | null): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Este campo es requerido';
    }
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['email']) {
      return 'Email inválido';
    }
    if (errors['min']) {
      return `El valor mínimo es ${errors['min'].min}`;
    }

    return 'Campo inválido';
  }
}
