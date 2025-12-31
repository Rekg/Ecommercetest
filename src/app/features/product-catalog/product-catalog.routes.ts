import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const PRODUCT_CATALOG_ROUTES: Routes = [
  {
    path: '',
    // Renamed m.list to m.ProductListPage
    loadComponent: () => import('./pages/list/list').then((m) => m.ProductListPage),
  },
  {
    path: 'categories',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/category-management/category-management').then(m => m.CategoryManagement),
  },
  {
    path: 'add',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/edit/edit').then((m) => m.edit), // Keep m.edit if you didn't rename it yet
  },
  {
    path: 'edit/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/edit/edit').then((m) => m.edit),
  },
  {
    path: ':id',
    // Renamed m.detail to m.ProductDetailPage
    loadComponent: () => import('./pages/detail/detail').then((m) => m.ProductDetailPage),
  },
];