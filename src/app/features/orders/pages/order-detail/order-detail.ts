import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderApiService } from '../../../api/order-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Order } from '../../../../core/models/order.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CartActions } from '../../../shopping-cart/state/cart.actions';

@Component({
  standalone: true,
  selector: 'app-order-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.html',
})
export class OrderDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private orderApi = inject(OrderApiService);
  private toast = inject(ToastService);
  private store = inject(Store);
  
  order$!: Observable<Order>;
  statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  ngOnInit() { this.loadOrder(); }

  loadOrder() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) this.order$ = this.orderApi.getOrderByUuid(uuid);
  }

  formatAddress(addr: any): string {
    if (!addr) return 'No address provided';
    if (typeof addr === 'string') return addr;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`;
  }

  onCancelOrder(uuid: string) {
    if (confirm('Are you sure you want to cancel?')) {
      this.orderApi.cancelOrder(uuid).subscribe({
        next: () => { this.toast.success('Order Cancelled'); this.loadOrder(); },
        error: (err) => this.toast.error(err.error?.message || 'Failed to cancel')
      });
    }
  }

  reorderItems(order: Order) {
    order.items.forEach(item => {
      this.store.dispatch(CartActions.addToCartRequest({ productId: item.productId, quantity: item.quantity }));
    });
    this.toast.success('All items added to cart!');
  }

  isCompleted(currentStatus: string, stepStatus: string): boolean {
    if (currentStatus === 'CANCELLED') return false;
    return this.statuses.indexOf(stepStatus) <= this.statuses.indexOf(currentStatus);
  }
}