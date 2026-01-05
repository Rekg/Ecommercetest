import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, UserDTO } from '../models/user.model';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { Store } from '@ngrx/store';
import { CartActions } from '../../features/shopping-cart/state/cart.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private store = inject(Store);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<UserDTO | null>(this.getInitialUser());

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(userData: any): Observable<any> {
    
    const payload = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'CUSTOMER'
    };
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  logout() {
    const token = this.getToken();
    
      if (token) {
        this.http.post(`${this.baseUrl}/logout`, { token }, { responseType: 'text' })
          .subscribe({
            next: () => this.handleLogoutCleanup(),
            error: () => this.handleLogoutCleanup()
          });
      } else {
        this.handleLogoutCleanup();
      
    }
  }

  private handleLogoutCleanup() {
    this.clearSession();
    this.store.dispatch(CartActions.resetCartState());
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('token', authResult.token);
    if (authResult.refreshToken) localStorage.setItem('refreshToken', authResult.refreshToken);
    if (authResult.user) {
      localStorage.setItem('user', JSON.stringify(authResult.user));
      this.currentUser.set(authResult.user);
    }
  }

  private clearSession() {
    localStorage.clear();
    this.currentUser.set(null);
  }

  private getInitialUser(): UserDTO | null {
    const savedUser = localStorage.getItem('user');
    try { return savedUser ? JSON.parse(savedUser) : null; } catch { return null; }
  }

  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
  getRole(): string | null { return this.currentUser()?.role || null; }
}