// src/app/app.config.ts
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; // Added withInterceptors & withFetch
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { cartReducer } from './features/shopping-cart/state/cart.reducer';
import { provideEffects } from '@ngrx/effects'; // Add this import
import { CartEffects } from './features/shopping-cart/state/cart.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor'; // Import the interceptor we created

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Updated provideHttpClient to include the Auth Interceptor
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor]) 
    ),

    // NgRx Store Setup
    provideStore({
      cart: cartReducer,
    }),
    provideEffects([CartEffects]),
    
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};