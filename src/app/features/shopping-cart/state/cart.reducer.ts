import { createReducer, on } from '@ngrx/store';
import { CartActions } from './cart.actions';
import { CartItem } from '../../../core/models/cart.model';

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  tax: number;
  discount: number;
  loading: boolean;
  error: string | null;
}

export const initialState: CartState = {
  items: [],
  totalPrice: 0,
  tax: 0,
  discount: 0,
  loading: false,
  error: null
};

export const cartReducer = createReducer(
  initialState,

  
  on(CartActions.fetchCartRequest, (state) => ({ 
    ...state, 
    loading: true 
  })),

  
  on(
    CartActions.fetchCartSuccess,
    CartActions.addToCartSuccess,
    CartActions.updateCartItemSuccess,
    CartActions.removeFromCartSuccess,
    (state, { cart }) => ({
      ...state,
      items: cart.items,
      totalPrice: cart.totalPrice,
      tax: cart.tax,
      discount: cart.discount,
      loading: false,
      error: null
    })
  ),

  
  on(
    CartActions.fetchCartFailure,
    CartActions.addToCartFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error: error
    })
  ),

  
  on(CartActions.clearCartSuccess, () => initialState),
  on(CartActions.resetCartState, () => initialState)
);