import { Component, Input, inject, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { WishlistStateService } from '../../../wishlist/services/wishlist-state.service';
import { Store } from '@ngrx/store';
import { ToastService } from '../../../../core/services/toast.service';
import { CartActions } from '../../../shopping-cart/state/cart.actions';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [RouterModule, NgOptimizedImage, CommonModule],
  templateUrl: './card.html',
})
export class CardComponent implements OnInit {
  private wishlistService = inject(WishlistStateService);
  private store = inject(Store);
  private toast = inject(ToastService);

  @Input({ required: true }) product!: Product;
  isInWishlist$!: Observable<boolean>;

  ngOnInit(): void {
    this.isInWishlist$ = this.wishlistService.isProductInWishlist(this.product.id);
  }

  // src/app/features/product-catalog/components/card/card.ts

getFullImageUrl(path: string | null): string {
  if (!path) return 'assets/images/placeholder-product.png';
  if (path.startsWith('http') || path.startsWith('assets/')) return path;

  // Match the detail page exactly: use the full apiUrl (with /api/v1)
  // path already starts with / (e.g., /uploads/...)
  return environment.apiUrl + path;
}

  quickAddToCart(event: Event): void {
    event.stopPropagation();
    this.store.dispatch(CartActions.addToCartRequest({
      productId: this.product.id,
      quantity: 1
    }));
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleItem(this.product);
  }
}