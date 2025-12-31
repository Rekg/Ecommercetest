export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderUuid: string;
  userId: string;
  items: OrderItem[];
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  totalAmount: number;
  shippingAddress: any; // Can be string or object from server
  billingAddress: any;
}

export interface OrderRequest {
  cartItemIds: number[];
  shippingAddress: string; // Changed from Object to String
  billingAddress: string;  // Changed from Object to String
  paymentMethod: string;
}