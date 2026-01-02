
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CartApiService } from '../../api/cart-api.service'; // 
import { CartActions } from './cart.actions';
import { ToastService } from '../../../core/services/toast.service';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartApi = inject(CartApiService);
  private toast = inject(ToastService);

  fetchCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.fetchCartRequest),
      mergeMap(() =>
        this.cartApi.getCart().pipe(
          map((cart) => CartActions.fetchCartSuccess({ cart })),
          catchError((error) => of(CartActions.fetchCartFailure({ error: error.message })))
        )
      )
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCartRequest),
      mergeMap((action) =>
        this.cartApi.addItem(action.productId, action.quantity).pipe(
          map((cart) => {
            this.toast.success('Item added to cart');
            return CartActions.addToCartSuccess({ cart });
          }),
          catchError((error) => {
            this.toast.error(error.error?.message || 'Failed to add item');
            return of(CartActions.addToCartFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItemRequest),
      mergeMap((action) =>
        this.cartApi.updateItem(action.productId, action.quantity).pipe(
          map((cart) => CartActions.updateCartItemSuccess({ cart })),
          catchError((error) => of(CartActions.updateCartItemFailure({ error: error.message })))
        )
      )
    )
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCartRequest),
      mergeMap((action) =>
        this.cartApi.removeItem(action.productId).pipe(
          map((cart) => {
            this.toast.info('Item removed');
            return CartActions.removeFromCartSuccess({ cart });
          }),
          catchError((error) => of(CartActions.removeFromCartFailure({ error: error.message })))
        )
      )
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCartRequest),
      mergeMap(() =>
        this.cartApi.clearCart().pipe(
          map(() => CartActions.clearCartSuccess()),
          catchError((error) => of(CartActions.clearCartFailure({ error: error.message })))
        )
      )
    )
  );
}