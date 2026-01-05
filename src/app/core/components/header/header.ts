import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectCartItemsCount } from '../../../features/shopping-cart/state/cart.selectors';
import { Observable, map } from 'rxjs';
import { WishlistStateService } from '../../../features/wishlist/services/wishlist-state.service';
import { AuthService } from '../../services/auth.service';
import { CartActions } from '../../../features/shopping-cart/state/cart.actions';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  public authService = inject(AuthService);
  private wishlistService = inject(WishlistStateService);

  isMobileMenuOpen = signal(false);
  showLogoutModal = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  cartTotalQuantity$: Observable<number> = this.store
    .select(selectCartItemsCount)
    .pipe(map((count) => (this.authService.isLoggedIn() ? count : 0)));

  wishlistCount$: Observable<number> = this.wishlistService.wishlist$.pipe(
    map((items) => items.length)
  );

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.store.dispatch(CartActions.fetchCartRequest());
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.getRole() === 'ADMIN';
  }

  
  confirmLogout() {
    this.showLogoutModal.set(true);
    if (this.isMobileMenuOpen()) this.isMobileMenuOpen.set(false);
  }

  
  handleLogoutResponse(confirmed: boolean) {
    this.showLogoutModal.set(false);
    if (confirmed) {
      this.authService.logout();
    }
  }
}
