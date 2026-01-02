// src/app/features/wishlist/services/wishlist-state.service.ts
//import { Injectable, inject } from '@angular/core';
//import { BehaviorSubject, Observable, map } from 'rxjs';
//import { Product } from '../../../core/models/product.model';
//import { ToastService } from '../../../core/services/toast.service';
//import { Store } from '@ngrx/store';
// FIX: Corrected the relative path from '../../..' to '../../'
//import { CartActions } from '../../shopping-cart/state/cart.actions'; 

/**
 * Defines the structure for an item inside the Wishlist.
 */
//interface WishlistItem extends Product {}

//@Injectable({
  //providedIn: 'root',
//})
//export class WishlistStateService {
  //private toastService = inject(ToastService); 
  //private store = inject(Store); 

  //private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  //public wishlist$ = this.wishlistSubject.asObservable();

//  isProductInWishlist(productId: number): Observable<boolean> {
  //  return this.wishlist$.pipe(
    //  map(items => items.some(item => item.id === productId))
    //);
  //}

  /**
   * Toggles a product in the wishlist (Add or Remove) and handles the toast notification.
   */
  //toggleItem(product: Product): void {
    //const currentItems = this.wishlistSubject.getValue();
    //const index = currentItems.findIndex(item => item.id === product.id);
//
  //  if (index > -1) {
      // Item exists, remove it
      //const updatedItems = currentItems.filter(item => item.id !== product.id);
      //this.wishlistSubject.next(updatedItems);
      // TOAST HANDLED INTERNALLY
      //this.toastService.info(`💔 "${product.name}" removed from wishlist.`);
    //} else {
      // Item does not exist, add it
      //const newItem: WishlistItem = { ...product };
      //this.wishlistSubject.next([...currentItems, newItem]);
      // TOAST HANDLED INTERNALLY
      //this.toastService.success(`💖 "${product.name}" added to wishlist!`);
    //}
  //}

  /**
   * Moves a wishlist item to the shopping cart.
   */
  //moveItemToCart(product: WishlistItem): void {
    // 1. FIX: Dispatch Cart action using the strong action creator
    //this.store.dispatch(CartActions.addItem({ product, quantity: 1 })); 

    // 2. Remove from wishlist
    //this.removeItem(product.id);

    // 3. Notify user
    // TOAST HANDLED INTERNALLY
  //  this.toastService.success(`🛒 "${product.name}" moved to cart!`);
  //}

  /**
   * Helper to remove an item by ID.
   */
  //removeItem(productId: number): void {
    //const currentItems = this.wishlistSubject.getValue();
    //const updatedItems = currentItems.filter(item => item.id !== productId);
    //this.wishlistSubject.next(updatedItems);
  //}
//}
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ToastService } from '../../../core/services/toast.service';
// import { Store } from '@ngrx/store'; // Muted for now
// import { CartActions } from '../../shopping-cart/state/cart.actions'; // Muted for now

interface WishlistItem extends Product {}

@Injectable({
  providedIn: 'root',
})
export class WishlistStateService {
  private toastService = inject(ToastService); 
  // private store = inject(Store); // Muted to prevent state errors 

  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  isProductInWishlist(productId: number): Observable<boolean> {
    return this.wishlist$.pipe(
      map(items => items.some(item => item.id === productId))
    );
  }

  toggleItem(product: Product): void {
    const currentItems = this.wishlistSubject.getValue();
    const index = currentItems.findIndex(item => item.id === product.id);

    if (index > -1) {
      const updatedItems = currentItems.filter(item => item.id !== product.id);
      this.wishlistSubject.next(updatedItems);
      this.toastService.info(`💔 "${product.name}" removed from wishlist.`);
    } else {
      this.wishlistSubject.next([...currentItems, { ...product }]);
      this.toastService.success(` "${product.name}" added to wishlist!`);
    }
  }

  moveItemToCart(product: WishlistItem): void {
    // SILENT MODE: We don't dispatch to NgRx yet to avoid errors
    // this.store.dispatch(CartActions.addItem({ product, quantity: 1 })); 

    this.removeItem(product.id);
    this.toastService.success(`🛒 "${product.name}" moved to cart (Placeholder)!`);
  }

  removeItem(productId: number): void {
    const currentItems = this.wishlistSubject.getValue();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.wishlistSubject.next(updatedItems);
  }
}