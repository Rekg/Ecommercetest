import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loginData = { email: '', password: '' };
  isLoading = signal(false);

  onSubmit() {
    this.isLoading.set(true);
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.toast.success('Login successful! ');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Invalid credentials. Please try again.');
      }
    });
  }
}