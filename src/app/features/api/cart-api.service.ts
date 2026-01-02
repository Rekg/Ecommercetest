import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../../core/models/cart.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cart`;

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl);
  }

  
  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.baseUrl}/add`, 
      { productId, quantity }, 
      this.httpOptions
    );
  }

  
  updateItem(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.baseUrl}/update`, 
      { cartItemId, quantity }, 
      this.httpOptions
    );
  }

  
  removeItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/remove`, {
      ...this.httpOptions,
      body: { cartItemId } 
    });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clear`);
  }
}