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

  
  initiatePayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/initiate`, request);
  }

 
  getPaymentByOrderId(orderId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.baseUrl}/order/${orderId}`);
  }

  getLatestPaymentForUser(): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.baseUrl}/user/latest`);
  }
}