import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService, ToastType } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-notification',
  imports: [CommonModule],
  templateUrl: './toast-notification.html',
})
export class ToastNotification implements OnInit {
  private toastService = inject(ToastService);
  activeToasts: Toast[] = [];

  ngOnInit() {
    this.toastService.toasts$.subscribe((toast) => {
      
      const existingToastIndex = this.activeToasts.findIndex((t) => t.id === toast.id);

      if (toast.message === '') {
        
        if (existingToastIndex > -1) {
          this.activeToasts.splice(existingToastIndex, 1);
        }
      } else {
       
        if (existingToastIndex === -1) {
          this.activeToasts.push(toast);
        }
      }
    });
  }

  removeToast(id: number) {
    this.activeToasts = this.activeToasts.filter((t) => t.id !== id);
  }

  getToastClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-600';
      case 'info':
      default:
        return 'bg-indigo-600';
    }
  }
}
