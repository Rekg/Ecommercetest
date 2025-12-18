import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store'; 
import { selectCartTotalQuantity } from '../../../features/shopping-cart/state/cart.selectors'; 
import { Observable, map } from 'rxjs'; 
import { WishlistStateService } from '../../../features/wishlist/services/wishlist-state.service'; 

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  template: `
   <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">

          
          <a
            [routerLink]="['/products']"
            class="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition"
          >
            G-STORE
          </a>

          
          <div class="ml-auto flex items-center gap-6 pr-6">
            
            
            <a
  [routerLink]="['/products']"
  routerLinkActive="text-indigo-600 font-semibold"
  [routerLinkActiveOptions]="{ exact: true }"
  class="p-2 flex items-center
         text-gray-700 hover:text-indigo-600
         transition"
>
  <span class="leading-none">Products</span>
</a>

            
            <a
  [routerLink]="['/products/add']"
  routerLinkActive="text-indigo-600"
  class="p-2 flex items-center justify-center
         text-gray-700 hover:text-indigo-600
         transition"
  title="Add Product"
>
  <span class="text-2xl font-semibold leading-none">+</span>
</a>

            
            <a
              [routerLink]="['/wishlist']"
              class="relative p-2 text-gray-700 hover:text-red-600 transition"
              routerLinkActive="text-red-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682
                     a4.5 4.5 0 00-6.364-6.364L12 7.636l-.318-.318
                     a4.5 4.5 0 00-6.364 0z"
                />
              </svg>

              <span
                *ngIf="wishlistCount$ | async as count"
                class="absolute -top-1 -right-1 w-5 h-5
                       bg-red-600 text-white text-xs font-bold
                       flex items-center justify-center rounded-full"
                [class.hidden]="count === 0"
              >
                {{ count }}
              </span>
            </a>

            
            <a
              [routerLink]="['/cart']"
              class="relative p-2 text-gray-700 hover:text-indigo-600 transition"
              routerLinkActive="text-indigo-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4
                     M7 13L5.4 5
                     M7 13l-2.293 2.293
                     c-.63.63-.184 1.707.707 1.707H17
                     m0 0a2 2 0 100 4
                     2 2 0 000-4
                     zm-8 2a2 2 0 11-4 0
                     2 2 0 014 0z"
                />
              </svg>

              <span
                *ngIf="cartTotalQuantity$ | async as count"
                class="absolute -top-1 -right-1 w-5 h-5
                       bg-red-600 text-white text-xs font-bold
                       flex items-center justify-center rounded-full"
                [class.hidden]="count === 0"
              >
                {{ count }}
              </span>
            </a>

          </div>

        </div>
      </div>
    </header>
  `,
})
export class header {
  private store = inject(Store);
  private wishlistService = inject(WishlistStateService); 

  
  cartTotalQuantity$: Observable<number> = this.store.select(selectCartTotalQuantity);

  
  wishlistCount$: Observable<number> = this.wishlistService.wishlist$.pipe(
    map(items => items.length)
  );

  constructor() {}
}