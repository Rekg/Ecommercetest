import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';


export const selectCartState = createFeatureSelector<CartState>('cart');


export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectCartItemsCount = createSelector(
  selectCartState,
  (state) => state.items.reduce((total, item) => total + item.quantity, 0)
);


export const selectCartTotals = createSelector(
  selectCartState,
  (state) => ({
    totalPrice: state.totalPrice,
    tax: state.tax,
    discount: state.discount
  })
);

export const selectIsCartLoading = createSelector(
  selectCartState,
  (state) => state.loading
);