import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationOptions {
  title?: string;
  timeOut?: number;
  positionClass?: string;
  closeButton?: boolean;
  progressBar?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private defaultOptions: NotificationOptions = {
    timeOut: 5000,
    positionClass: 'toast-bottom-right',
    closeButton: true,
    progressBar: true,
  };

  constructor(private toastr: ToastrService) {}

  /**
   * Shows a success notification
   * @param message The message to display
   * @param title Optional title
   * @param options Custom options
   */
  success(message: string, title?: string, options?: NotificationOptions): void {
    this.showNotification('success', message, title, options);
  }

  /**
   * Shows an error notification
   * @param message The error message to display
   * @param title Optional title
   * @param options Custom options
   */
  error(message: string, title: string = 'Error', options?: NotificationOptions): void {
    this.showNotification('error', message, title, options);
  }

  /**
   * Shows an info notification
   * @param message The message to display
   * @param title Optional title
   * @param options Custom options
   */
  info(message: string, title?: string, options?: NotificationOptions): void {
    this.showNotification('info', message, title, options);
  }

  /**
   * Shows a warning notification
   * @param message The warning message to display
   * @param title Optional title
   * @param options Custom options
   */
  warning(message: string, title?: string, options?: NotificationOptions): void {
    this.showNotification('warning', message, title, options);
  }

  /**
   * Generic method to show a notification
   * @param type The type of notification
   * @param message The message to display
   * @param title Optional title
   * @param options Custom options
   */
  private showNotification(
    type: MessageType,
    message: string,
    title: string = '',
    options: NotificationOptions = {}
  ): void {
    const config = { ...this.defaultOptions, ...options };
    
    switch (type) {
      case 'success':
        this.toastr.success(message, title, config);
        break;
      case 'error':
        this.toastr.error(message, title, config);
        break;
      case 'info':
        this.toastr.info(message, title, config);
        break;
      case 'warning':
        this.toastr.warning(message, title, config);
        break;
    }
  }
}
