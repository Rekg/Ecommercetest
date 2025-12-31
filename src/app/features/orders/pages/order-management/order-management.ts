import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderApiService } from '../../../api/order-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Order } from '../../../../core/models/order.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-order-management',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-management.html',
})
export class OrderManagementPage implements OnInit {
  private orderApi = inject(OrderApiService);
  private toast = inject(ToastService);
  
  orders$!: Observable<Order[]>;
  searchUuid: string = '';
  isFiltered: boolean = false;
  showOnlyActive: boolean = true;

  ngOnInit() { 
    this.loadOrders(); 
  }

  loadOrders() {
    this.orders$ = this.orderApi.getOrderHistory().pipe(
      map(orders => {
        if (this.showOnlyActive && !this.isFiltered) {
          return orders.filter(o => 
            ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status)
          );
        }
        return orders;
      })
    );
  }

  toggleActiveFilter(activeOnly: boolean) {
    this.showOnlyActive = activeOnly;
    this.isFiltered = false;
    this.searchUuid = '';
    this.loadOrders();
  }

  searchOrder() {
    if (!this.searchUuid.trim()) {
      this.resetSearch();
      return;
    }
    this.orderApi.getOrderByUuid(this.searchUuid.trim()).subscribe({
      next: (order) => { 
        this.orders$ = of([order]); 
        this.isFiltered = true; 
      },
      error: () => {
        this.toast.error('Order not found');
        this.resetSearch();
      }
    });
  }

  resetSearch() { 
    this.searchUuid = ''; 
    this.isFiltered = false; 
    this.loadOrders(); 
  }

  onStatusChange(order: Order) {
    this.orderApi.updateOrderStatus(order.orderUuid, order.status).subscribe({
      next: () => {
        this.toast.success(`Order set to ${order.status}`);
        // If we are in "Active" mode and just marked something as "Delivered", 
        // it should disappear from the list on refresh
        if (this.showOnlyActive) this.loadOrders();
      },
      error: () => { 
        this.toast.error('Failed to update status'); 
        this.loadOrders(); 
      }
    });
  }

  getStatusStyles(status: string): string {
    const styles: any = { 
      PENDING: 'bg-amber-100 text-amber-700', 
      PROCESSING: 'bg-blue-100 text-blue-700', 
      SHIPPED: 'bg-indigo-100 text-indigo-700', 
      DELIVERED: 'bg-emerald-100 text-emerald-700', 
      CANCELLED: 'bg-rose-100 text-rose-700' 
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  }
}