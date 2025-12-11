export type UserRole = 'customer' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'veg' | 'non-veg' | 'vegan';
  spiciness: 1 | 2 | 3;
  rating: number;
}

export interface CartItem extends Pizza {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'out-for-delivery' | 'delivered';
export type PaymentMethod = 'card' | 'upi' | 'cod';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

export interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
}
