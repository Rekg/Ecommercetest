import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService, ToastType } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-notification',
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
      <div
        *ngFor="let toast of activeToasts"
        [ngClass]="getToastClasses(toast.type)"
        class="relative w-80 p-4 rounded-lg shadow-xl transform transition-all duration-300 ease-out pointer-events-auto"
        role="alert"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 text-white mr-3">
            <svg
              *ngIf="toast.type === 'success'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <svg
              *ngIf="toast.type === 'error'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <svg
              *ngIf="toast.type === 'info'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="flex-grow">
            <p class="font-semibold text-white">{{ toast.message }}</p>
          </div>
          <button
            (click)="removeToast(toast.id)"
            class="ml-4 p-1 rounded-full text-white opacity-70 hover:opacity-100 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ToastNotification implements OnInit {
  private toastService = inject(ToastService);
  activeToasts: Toast[] = [];

  ngOnInit() {
    this.toastService.toasts$.subscribe((toast) => {
      // Logic to handle toast visibility and removal
      const existingToastIndex = this.activeToasts.findIndex((t) => t.id === toast.id);

      if (toast.message === '') {
        // This is a removal signal
        if (existingToastIndex > -1) {
          this.activeToasts.splice(existingToastIndex, 1);
        }
      } else {
        // This is a show signal
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
