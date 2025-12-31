import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CheckoutApiService } from '../../../api/checkout-api.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-order-confirmation',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.html',
})
export class OrderConfirmationPage implements OnInit {
  private checkoutApi = inject(CheckoutApiService);
  private route = inject(ActivatedRoute);
  
  orderData$!: Observable<any>;

  ngOnInit() {
    const orderId = this.route.snapshot.queryParams['orderId'];
    if (orderId) {
      this.orderData$ = this.checkoutApi.getCheckoutByOrderId(orderId);
    }
  }
}