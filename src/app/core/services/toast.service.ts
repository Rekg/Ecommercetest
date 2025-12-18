import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  private toastCounter = 0;

  get toasts$(): Observable<Toast> {
    return this.toastSubject.asObservable();
  }

  show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    const id = this.toastCounter++;
    const toast: Toast = { message, type, id };
    this.toastSubject.next(toast);

    
    setTimeout(() => this.toastSubject.next({ ...toast, message: '' }), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000); 
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}
