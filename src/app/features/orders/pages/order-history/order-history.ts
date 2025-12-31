import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderApiService } from '../../../api/order-api.service';
import { Order } from '../../../../core/models/order.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-order-history',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.html',
})
export class OrderHistoryPage implements OnInit {
  private orderApi = inject(OrderApiService);
  orders$!: Observable<Order[]>;

  ngOnInit() {
    this.orders$ = this.orderApi.getOrderHistory().pipe(
      catchError(() => of([]))
    );
  }

  getStatusClass(status: string): string {
    const base = "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ";
    switch (status) {
      case 'DELIVERED': return base + "bg-green-100 text-green-700";
      case 'CANCELLED': return base + "bg-red-100 text-red-700";
      default: return base + "bg-indigo-100 text-indigo-700";
    }
  }
}