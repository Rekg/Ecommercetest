import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  password = '';
  confirmPassword = '';
  token = '';
  isLoading = signal(false);

  ngOnInit() {
    // Automatically grab the token from the URL: ?token=xyz
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.token) {
      this.toast.error('Invalid or missing reset token.');
      this.router.navigate(['/auth/login']);
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toast.error('Passwords do not match!');
      return;
    }

    if (this.password.length < 6) {
      this.toast.error('Password must be at least 6 characters.');
      return;
    }

    this.isLoading.set(true);
    
    // Payload matches standard reset flows
    const resetData = {
      token: this.token,
      newPassword: this.password
    };

    this.authService.resetPassword(resetData).subscribe({
      next: () => {
        this.toast.success('Password updated successfully! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error(err.error?.message || 'Failed to reset password. Link may be expired.');
      }
    });
  }
}