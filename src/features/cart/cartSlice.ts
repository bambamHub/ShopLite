import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
        return;
      }
      const { id, title, price, thumbnail } = action.payload;
      state.items.push({ id, title, price, thumbnail, quantity: 1 });
    },
    increment(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrement(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
