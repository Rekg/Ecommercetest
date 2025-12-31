// src/app/features/auth/pages/register/register.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  regData = { email: '', password: '', firstName: '', lastName: '', role: 'CUSTOMER' };
  confirmPassword = '';
  acceptTerms = false;
  isLoading = signal(false);

  onSubmit() {
    if (this.regData.password !== this.confirmPassword) {
      this.toast.error('Passwords do not match!');
      return;
    }
    this.isLoading.set(true);
    this.authService.register(this.regData).subscribe({
      next: () => {
        this.toast.success('Registration successful! Please login. 🎉');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error(err.error?.message || 'Registration failed.');
      }
    });
  }
}