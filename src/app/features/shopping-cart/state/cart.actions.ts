// src/app/features/shopping-cart/state/cart.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Cart } from '../../../core/models/cart.model';

export const CartActions = createActionGroup({
  source: 'Cart API',
  events: {
    'Fetch Cart Request': emptyProps(),
    'Fetch Cart Success': props<{ cart: Cart }>(),
    'Fetch Cart Failure': props<{ error: string }>(),

    'Add To Cart Request': props<{ productId: number; quantity: number }>(),
    'Add To Cart Success': props<{ cart: Cart }>(),
    'Add To Cart Failure': props<{ error: string }>(),

    'Update Cart Item Request': props<{ productId: number; quantity: number }>(),
    'Update Cart Item Success': props<{ cart: Cart }>(),
    'Update Cart Item Failure': props<{ error: string }>(),

    'Remove From Cart Request': props<{ productId: number }>(),
    'Remove From Cart Success': props<{ cart: Cart }>(),
    'Remove From Cart Failure': props<{ error: string }>(),

    'Clear Cart Request': emptyProps(),
    'Clear Cart Success': emptyProps(),
    'Clear Cart Failure': props<{ error: string }>(),
    
    'Reset Cart State': emptyProps() // Used when logging out
  }
});