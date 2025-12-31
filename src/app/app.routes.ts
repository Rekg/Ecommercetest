import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // --- Auth ---
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register').then(m => m.RegisterComponent) },
      { path: 'forgot-password', loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
      { path: 'reset-password', loadComponent: () => import('./features/auth/pages/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
    ],
  },

  // --- Products ---
  {
    path: 'products',
    loadChildren: () => import('./features/product-catalog/product-catalog.routes').then(m => m.PRODUCT_CATALOG_ROUTES)
  },
  
  // --- Cart & Checkout ---
  {
    path: 'cart',
    loadComponent: () => import('./features/shopping-cart/pages/cart/cart').then(m => m.CartPage),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/pages/checkout/checkout').then(m => m.CheckoutPage),
  },

  // --- Orders (User & Admin) ---
{
  path: 'orders',
  canActivate: [authGuard],
  children: [
    {
      path: '', // URL: /orders (User History)
      loadComponent: () => import('./features/orders/pages/order-history/order-history').then(m => m.OrderHistoryPage),
    },
    {
      path: 'management', // URL: /orders/management (Admin View)
      loadComponent: () => import('./features/orders/pages/order-management/order-management').then(m => m.OrderManagementPage),
    },
    {
      path: 'confirmation', // URL: /orders/confirmation
      loadComponent: () => import('./features/orders/pages/order-confirmation/order-confirmation').then(m => m.OrderConfirmationPage),
    },
    {
      path: ':uuid', // URL: /orders/:uuid (Order Details)
      loadComponent: () => import('./features/orders/pages/order-detail/order-detail').then(m => m.OrderDetailPage),
    }
  ]
},
// --- Profile Section ---
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/pages/profile-layout/profile-layout').then(m => m.ProfileLayoutComponent),
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadComponent: () => import('./features/profile/pages/personal-info/personal-info').then(m => m.PersonalInfoComponent) },
      { path: 'addresses', loadComponent: () => import('./features/profile/pages/addresses/addresses').then(m => m.AddressesComponent) },
      { path: 'payments', loadComponent: () => import('./features/profile/pages/payment-methods/payment-methods').then(m => m.PaymentMethodsComponent) },
    ]
  },
  

  { path: '**', redirectTo: 'products' },
];