import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  isLoading = signal(false);
  emailSent = signal(false);

  onSubmit() {
    this.isLoading.set(true);
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.emailSent.set(true);
        this.isLoading.set(false);
        this.toast.success('Reset link sent!');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error(err.error?.message || 'Email not found or server error.');
      }
    });
  }
}