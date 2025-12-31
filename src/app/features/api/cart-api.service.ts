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

  /**
   * POST: Uses productId because the CartItem doesn't exist yet
   */
  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.baseUrl}/add`, 
      { productId, quantity }, 
      this.httpOptions
    );
  }

  /**
   * PUT: Matches UpdateCartItemRequest.java (cartItemId)
   */
  updateItem(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.baseUrl}/update`, 
      { cartItemId, quantity }, // Changed key to cartItemId
      this.httpOptions
    );
  }

  /**
   * DELETE: Matches RemoveCartItemRequest.java (cartItemId)
   */
  removeItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/remove`, {
      ...this.httpOptions,
      body: { cartItemId } // Changed key to cartItemId
    });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clear`);
  }
}