import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../../../../core/models/cart.model'; 
import { CartActions } from '../../state/cart.actions';
import {
  selectCartItems,
  selectCartTotals,
  selectCartItemsCount,
} from '../../state/cart.selectors';
import { ToastService } from '../../../../core/services/toast.service';
import { OrderApiService } from '../../../api/order-api.service';
import { OrderRequest } from '../../../../core/models/order.model';

@Component({
  standalone: true,
  selector: 'shopping-cart-page',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.html',
})
export class CartPage {
  private store = inject(Store);
  private router = inject(Router);
  private orderApi = inject(OrderApiService);
  public toastService = inject(ToastService);

  items$: Observable<CartItem[]> = this.store.select(selectCartItems);
  totalQuantity$: Observable<number> = this.store.select(selectCartItemsCount);
  totals$ = this.store.select(selectCartTotals);

  isProcessing = signal(false);

  updateQuantity(item: CartItem, newQuantity: number | string): void {
    const quantity = Number(newQuantity);
    if (quantity > 0) {
      this.store.dispatch(CartActions.updateCartItemRequest({ productId: item.id, quantity }));
    } else {
      this.removeItem(item.id);
    }
  }

  incrementQuantity(item: CartItem): void {
    this.store.dispatch(CartActions.updateCartItemRequest({ productId: item.id, quantity: item.quantity + 1 }));
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.store.dispatch(CartActions.updateCartItemRequest({ productId: item.id, quantity: item.quantity - 1 }));
    }
  }

  removeItem(cartItemId: number): void {
    this.store.dispatch(CartActions.removeFromCartRequest({ productId: cartItemId }));
  }

  clearCart(): void {
    if (confirm('Are you sure you want to empty your cart?')) {
      this.store.dispatch(CartActions.clearCartRequest());
    }
  }

  onCheckout() {
  let currentItems: CartItem[] = [];
  this.items$.subscribe(items => currentItems = items).unsubscribe();

  if (currentItems.length === 0) {
    this.toastService.error('Your cart is empty!');
    return;
  }

  
  this.router.navigate(['/checkout']);
}
}