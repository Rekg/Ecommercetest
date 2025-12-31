import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // If the request already has a 'token' parameter (like your validate-token call), 
  // or if we are logging in/registering, don't add the Bearer header.
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  const hasTokenParam = req.params.has('token');

  if (token && !isAuthRequest && !hasTokenParam) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};