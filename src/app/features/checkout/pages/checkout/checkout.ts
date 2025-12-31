import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { OrderApiService } from '../../../api/order-api.service';
import { PaymentApiService } from '../../../api/payment-api.service';
import { CheckoutApiService } from '../../../api/checkout-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { OrderRequest } from '../../../../core/models/order.model';
import { selectCartItems, selectCartTotals } from '../../../shopping-cart/state/cart.selectors';
import { CartActions } from '../../../shopping-cart/state/cart.actions';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #312e81; border-radius: 10px; }
  `]
})
export class CheckoutPage {
  private fb = inject(FormBuilder);
  private orderApi = inject(OrderApiService);
  private paymentApi = inject(PaymentApiService);
  private checkoutApi = inject(CheckoutApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private store = inject(Store);

  currentStep = signal(1);
  isProcessing = signal(false);
  cartItems$ = this.store.select(selectCartItems);
  totals$ = this.store.select(selectCartTotals);

  checkoutForm = this.fb.group({
    shippingAddress: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    }),
    billingAddress: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    }),
    payment: this.fb.group({
      method: ['CASH_ON_DELIVERY', Validators.required],
      cardNumber: [''],
      expiry: [''],
      cvv: ['']
    })
  });

  nextStep() { this.currentStep.update(s => s + 1); window.scrollTo(0, 0); }
  prevStep() { this.currentStep.update(s => s - 1); window.scrollTo(0, 0); }
  
  syncAddresses(event: any) {
    if (event.target.checked) {
      this.checkoutForm.get('billingAddress')?.patchValue(this.checkoutForm.get('shippingAddress')?.value as any);
    }
  }

  

  // Change this to a cleaner format without commas to see if it fixes the 400 error
private formatAddressString(addr: any): string {
  if (!addr) return '';
  return `${addr.street} ${addr.city} ${addr.state} ${addr.zip} ${addr.country}`;
}

async processFinalOrder() {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);

    try {
      const formValue = this.checkoutForm.value;
      const currentItems = await firstValueFrom(this.cartItems$);
      const itemIds = currentItems.map(item => item.id);

      const orderReq: OrderRequest = {
        cartItemIds: itemIds,
        shippingAddress: this.formatAddressString(formValue.shippingAddress),
        billingAddress: this.formatAddressString(formValue.billingAddress),
        paymentMethod: formValue.payment?.method || 'CASH_ON_DELIVERY'
      };

      const order = await firstValueFrom(this.orderApi.createOrder(orderReq));
      
      if (orderReq.paymentMethod === 'CREDIT_CARD') {
        await firstValueFrom(this.paymentApi.initiatePayment({
          orderId: order.id,
          amount: order.totalAmount,
          paymentMethod: 'CREDIT_CARD',
          cardNumber: formValue.payment?.cardNumber || '',
          expiryDate: formValue.payment?.expiry || '',
          cvv: formValue.payment?.cvv || ''
        }));
      }

      await firstValueFrom(this.checkoutApi.finalizeCheckout(order.id, orderReq.paymentMethod));

      this.toast.success('Order Placed Successfully!');
      this.store.dispatch(CartActions.clearCartRequest());
      this.store.dispatch(CartActions.resetCartState());

      this.router.navigate(['/orders/confirmation'], { 
        queryParams: { orderId: order.id } 
      });

    } catch (err: any) {
      console.error('Final Checkout Error:', err);
      const msg = err.error?.message || 'Server rejected the order details. Check address format.';
      this.toast.error(msg);
    } finally {
      this.isProcessing.set(false);
    }
  }
}