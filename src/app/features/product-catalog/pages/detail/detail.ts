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
  templateUrl: './detail.html',
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

  ngOnInit() {
    this.isAdmin.set(this.authService.getRole() === 'ADMIN');
    this.route.params.pipe(
      switchMap(params => this.apiService.getProductById(+params['id'])),
      catchError(() => { 
        this.isLoading = false; 
        this.toastService.error('Product not found');
        return of(null); 
      })
    ).subscribe(data => {
      this.product = data;
      this.isLoading = false;
    });
  }

  addToCart() {
    if (this.product) {
      this.store.dispatch(CartActions.addToCartRequest({ 
        productId: this.product.id, 
        quantity: 1 
      }));
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this product?') && this.product) {
      this.apiService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.toastService.success('Product removed successfully');
          this.router.navigate(['/products']);
        },
        error: () => this.toastService.error('Failed to delete product')
      });
    }
  }
}