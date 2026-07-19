import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);
