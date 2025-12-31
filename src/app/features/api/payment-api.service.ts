import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRequest, PaymentResponse } from '../../core/models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/payment`;

  /**
   * 3.8.1 Initiate Payment
   * Sends order details and card information to the backend gateway.
   */
  initiatePayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/initiate`, request);
  }

  /**
   * 3.8.2 Get Payment by Order
   */
  getPaymentByOrderId(orderId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.baseUrl}/order/${orderId}`);
  }

  /**
   * 3.8.3 Get Latest Payment for User
   */
  getLatestPaymentForUser(): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.baseUrl}/user/latest`);
  }
}