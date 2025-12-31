import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

// 1. Grab the entire 'cart' feature from the global state
export const selectCartState = createFeatureSelector<CartState>('cart');

// 2. Select the items array
export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

// 3. Calculate the total count for the header icon
export const selectCartItemsCount = createSelector(
  selectCartState,
  (state) => state.items.reduce((total, item) => total + item.quantity, 0)
);

// 4. Select totals for the Cart Page
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