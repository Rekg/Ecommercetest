import { Component, inject } from '@angular/core';
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
  templateUrl:'./header.html' ,
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);
  public authService = inject(AuthService);
  private wishlistService = inject(WishlistStateService); 

  cartTotalQuantity$: Observable<number> = this.store.select(selectCartItemsCount).pipe(
    map(count => this.authService.isLoggedIn() ? count : 0)
  );
  
  wishlistCount$: Observable<number> = this.wishlistService.wishlist$.pipe(
    map(items => items.length)
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

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}