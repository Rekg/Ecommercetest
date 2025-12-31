import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderRequest } from '../../core/models/order.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  createOrder(request: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/create`, request);
  }

  getOrderHistory(): Observable<Order[]> {
    return this.http.get<any>(`${this.baseUrl}/history`).pipe(
      map(response => {
        if (!response) return [];
        // If it's a single object (the "one order" issue), wrap it in an array
        return Array.isArray(response) ? response : [response];
      })
    );
  }

  getOrderByUuid(uuid: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${uuid}`);
  }

  cancelOrder(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cancel/${uuid}`);
  }

  updateOrderStatus(orderUuid: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/update-status`, {
      orderUuid: orderUuid,
      status: status
    });
  }
}