import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckoutResponse {
  id: number;
  orderId: number;
  userId: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/checkout`;

  
  finalizeCheckout(orderId: number, paymentMethod: string): Observable<CheckoutResponse> {
    const url = `${this.baseUrl}/${orderId}?paymentMethod=${paymentMethod}`;
    return this.http.post<CheckoutResponse>(url, {});
  }

  
  getCheckoutByOrderId(orderId: number): Observable<CheckoutResponse> {
    return this.http.get<CheckoutResponse>(`${this.baseUrl}/order/${orderId}`);
  }

  
  getLatestCheckoutForUser(userId: string): Observable<CheckoutResponse> {
    return this.http.get<CheckoutResponse>(`${this.baseUrl}/user/${userId}/latest`);
  }
}