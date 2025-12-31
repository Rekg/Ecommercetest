export interface PaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'DECLINED';
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}