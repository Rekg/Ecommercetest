import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  
  if (!authService.isLoggedIn()) {
    toast.error('Please login to access this area.');
    router.navigate(['/auth/login']);
    return false;
  }

  
  const role = authService.getRole();
  if (role === 'ADMIN') {
    return true;
  }

  
  toast.error('Access Denied: Admin permissions required.');
  router.navigate(['/products']);
  return false;
};