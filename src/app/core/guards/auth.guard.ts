import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Basic Auth Guard: Protects routes like Cart or Orders.
 * Allows any logged-in user (Customer or Admin).
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Redirect to login if not authenticated
    // Optional: we pass the 'returnUrl' so they come back here after logging in
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
};

/**
 * Admin Guard: Protects Product Management routes.
 * Strictly requires the 'ADMIN' role from your backend.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check login and specific role
  if (authService.isLoggedIn() && authService.getRole() === 'ADMIN') {
    return true;
  } else {
    // If they are a CUSTOMER trying to access admin paths, send them to products
    router.navigate(['/products']);
    return false;
  }
};