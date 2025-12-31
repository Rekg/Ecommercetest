import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SavedCard {
  id: number;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-methods.html',
    
})
export class PaymentMethodsComponent {
  showForm = signal(false);
  
  cards = signal<SavedCard[]>([
    { id: 1, brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, brand: 'Mastercard', last4: '8812', expiry: '05/25', isDefault: false }
  ]);

  newCard = { number: '', expiry: '', cvv: '' };

  addCard() {
    if (this.newCard.number.length >= 15) {
      const id = Date.now();
      const last4 = this.newCard.number.slice(-4);
      const brand = this.newCard.number.startsWith('4') ? 'Visa' : 'Mastercard';
      
      this.cards.update(prev => [...prev, { 
        id, brand, last4, expiry: this.newCard.expiry, isDefault: false 
      }]);
      
      this.showForm.set(false);
      this.newCard = { number: '', expiry: '', cvv: '' };
    }
  }

  deleteCard(id: number) {
    this.cards.update(prev => prev.filter(c => c.id !== id));
  }

  setDefault(id: number) {
    this.cards.update(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
  }
}