import { cartItem, shippingInfo, User } from "./types";

export interface userReducerInitialStateTypes {
  user: User | null;
  loading: boolean;
}

export interface cartReducerInitialStateTypes {
  loading: boolean;
  cartItems: cartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: shippingInfo;
}
