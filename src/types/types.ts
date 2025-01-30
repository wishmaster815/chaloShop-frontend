export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  photo: string;
};

export type shippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type cartItem = {
  quantity: number;
  stock: number;
  photo: string;
  price: number;
  name: string;
  productId: string;
};

// export type orderItem = {
//   productId: string;
//   photo: string;
//   name: string;
//   price: number;
//   quantity: number;
//   _id: string;
// };

// alterante method
export type orderItem = Omit<cartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: orderItem[];
  shippingInfo: shippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

type ChangeAndCount = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};
type latestTransaction = {
  _id: string;
  status: string;
  amount: number;
  discount: number;
  quantity: number;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: ChangeAndCount;
  count: ChangeAndCount;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransaction: latestTransaction[];
};

export type Pie = {
  orderFulfillment: {
    processing: number;
    shipped: number;
    delivered: number;
  };
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  userAgegroup: {
    teen: number;
    adult: number;
    old: number;
  };
  adminCustomers: {
    admin: number;
    customers: number;
  };
};

export type Bar = {
  products: number[];
  users: number[];
  orders: number[];
};
export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};
