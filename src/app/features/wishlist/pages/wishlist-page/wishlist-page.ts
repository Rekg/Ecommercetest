// src/app/features/wishlist/pages/wishlist-page/wishlist-page.ts
import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { WishlistStateService } from '../../services/wishlist-state.service';
import { Product } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast.service';
import { RouterModule } from '@angular/router'; // NEW: Import RouterModule for [routerLink]

@Component({
  standalone: true,
  selector: 'app-wishlist-page',
  imports: [CommonModule, NgOptimizedImage, CurrencyPipe, RouterModule], // ADDED: RouterModule
  templateUrl: './wishlist-page.html',
})
export class Wishlist {
  private wishlistService = inject(WishlistStateService);
  private toastService = inject(ToastService);

  public wishlist$: Observable<Product[]> = this.wishlistService.wishlist$;

  moveItemToCart(product: Product): void {
    // Toast is handled inside WishlistStateService
    this.wishlistService.moveItemToCart(product);
  }

  removeItem(id: number, title: string): void {
    if (confirm(`Remove "${title}" from wishlist?`)) {
      this.wishlistService.removeItem(id); // TOAST HANDLED INTERNALLY by the component
      this.toastService.info(`💔 "${title}" removed.`);
    }
  }

  trackByProductId(index: number, item: Product): number {
    return item.id;
  }
}
