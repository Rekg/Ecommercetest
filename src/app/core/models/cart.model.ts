export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  tax: number;
  discount: number;
}