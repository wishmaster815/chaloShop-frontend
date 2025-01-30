import {
  Bar,
  cartItem,
  Line,
  Order,
  Pie,
  Product,
  shippingInfo,
  Stats,
  User,
} from "./types";

export type customError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type userResponse = {
  success: boolean;
  user: User;
};

export type allUserResponse = {
  users: User[];
  success: boolean;
};

export type allProductsResponse = {
  success: boolean;
  products: Product[];
};

export type categoriesResponse = {
  success: boolean;
  categories: string[];
};

export type allOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type orderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};

// charts apitypes

export type statsResponse = {
  success: boolean;
  stats: Stats;
};

export type pieResponse = {
  success: boolean;
  charts: Pie;
};

export type barResponse = {
  success: boolean;
  charts: Bar;
};

export type lineResponse = {
  success: boolean;
  charts: Line;
};

export type searchProductsResponse = allProductsResponse & {
  totalPage: number;
};
/* Alternatively you can use this 
export type allProductsResponse = {
  success: boolean;
  products: product[];
  totalPage: number;
};
*/

export type searchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type newProductRequest = {
  id: string;
  formData: FormData;
};

export type deleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type updateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type deleteProductRequest = {
  userId: string;
  productId: string;
};

export type newOrderRequest = {
  shippingInfo: shippingInfo;
  orderItems: cartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type updateOrderRequest = {
  userId: string;
  orderId: string;
};
