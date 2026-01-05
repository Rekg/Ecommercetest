import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, of, switchMap } from 'rxjs';
import { Product } from '../../../../core/models/product.model';
import { ProductApiService } from '../../../api/product-api.service';
import { CartActions } from '../../../shopping-cart/state/cart.actions';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'product-detail-page',
  imports: [CommonModule, RouterModule, LoadingSpinner],
  template: `
    <div class="container mx-auto px-4 py-12 font-['Outfit']">
      <button
        routerLink="/products"
        class="mb-8 inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition uppercase text-xs tracking-widest"
      >
        ← Back to Listings
      </button>

      <div *ngIf="isLoading" class="flex justify-center py-24">
        <app-loading-spinner />
      </div>

      <div
        *ngIf="product && !isLoading"
        class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
      >
        <div class="flex items-center justify-center bg-gray-50 rounded-2xl p-8 sticky top-8 h-fit overflow-hidden">
          <img
            [src]="apiUrl + product.imageUrl"
            [alt]="product.name"
            class="max-h-[500px] w-full object-contain drop-shadow-xl"
          />
        </div>

        <div class="flex flex-col">
          <div class="mb-6">
            <span
              class="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              {{ product.categoryName || 'Product' }}
            </span>

            <h1 class="text-4xl font-black text-gray-900 mt-4 mb-2">
              {{ product.name }}
            </h1>

            <p class="text-3xl font-bold text-indigo-600">
              ETB {{ product.price | number : '1.2-2' }}
            </p>
          </div>

          <p class="text-gray-600 leading-relaxed mb-8 text-sm">
            {{ product.description }}
          </p>

          <div class="bg-gray-50 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Availability
              </span>
              <span
                class="font-bold"
                [ngClass]="product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ product.stockQuantity > 0
                  ? product.stockQuantity + ' in stock'
                  : 'Out of Stock' }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <button
              (click)="addToCart()"
              [disabled]="product.stockQuantity <= 0"
              class="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest
                     hover:bg-indigo-700 transition-all shadow-xl active:scale-95
                     disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
            >
              Add to Cart
            </button>

            <ng-container *ngIf="isAdmin()">
              <div class="flex gap-3">
                <button
                  [routerLink]="['/products/edit', product.id]"
                  class="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest
                         hover:bg-amber-600 transition-colors"
                >
                  Edit
                </button>

                <button
                  (click)="onDelete()"
                  class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest
                         hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="showDeleteModal()" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="handleDeleteResponse(false)"></div>
      
      <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900">Delete Product</h3>
          <p class="text-gray-500 mt-2 text-sm leading-relaxed">
            Are you sure you want to remove <strong>{{ product?.name }}</strong>? This action cannot be undone.
          </p>
        </div>

        <div class="flex gap-3 mt-8">
          <button (click)="handleDeleteResponse(false)" class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition text-xs uppercase tracking-widest">
            Cancel
          </button>
          <button (click)="handleDeleteResponse(true)" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition text-xs uppercase tracking-widest">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ProductApiService);
  private authService = inject(AuthService);
  private store = inject(Store);
  private toastService = inject(ToastService);

  protected apiUrl = environment.apiUrl;

  product: Product | null = null;
  isLoading = true;
  isAdmin = signal(false);
  showDeleteModal = signal(false);

  ngOnInit() {
    this.isAdmin.set(this.authService.getRole() === 'ADMIN');
    this.route.params
      .pipe(
        switchMap((params) => this.apiService.getProductById(+params['id'])),
        catchError(() => {
          this.isLoading = false;
          this.toastService.error('Product not found');
          return of(null);
        })
      )
      .subscribe((data) => {
        this.product = data;
        this.isLoading = false;
      });
  }

  addToCart() {
    if (this.product) {
      this.store.dispatch(
        CartActions.addToCartRequest({
          productId: this.product.id,
          quantity: 1,
        })
      );
    }
  }

  onDelete() {
    this.showDeleteModal.set(true);
  }

  handleDeleteResponse(confirmed: boolean) {
    this.showDeleteModal.set(false);
    
    if (confirmed && this.product) {
      this.apiService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.toastService.success('Product removed successfully');
          this.router.navigate(['/products']);
        },
        error: () => this.toastService.error('Unable to delete product'),
      });
    }
  }
}