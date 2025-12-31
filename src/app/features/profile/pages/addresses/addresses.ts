import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Address {
  id: number;
  type: string; // Home, Work, etc.
  street: string;
  city: string;
  isDefault: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addresses.html',
})
export class AddressesComponent {
  showForm = signal(false);
  
  // Local state for Demo
  addresses = signal<Address[]>([
    { id: 1, type: 'Home', street: '123 Tech Lane', city: 'San Francisco', isDefault: true },
    { id: 2, type: 'Office', street: '456 Corporate Way', city: 'New York', isDefault: false }
  ]);

  newAddr = { type: '', street: '', city: '' };

  addAddress() {
    if (this.newAddr.street && this.newAddr.city) {
      const id = Math.max(...this.addresses().map(a => a.id)) + 1;
      this.addresses.update(current => [...current, { ...this.newAddr, id, isDefault: false }]);
      this.showForm.set(false);
      this.newAddr = { type: '', street: '', city: '' };
    }
  }

  deleteAddress(id: number) {
    this.addresses.update(current => current.filter(a => a.id !== id));
  }

  setDefault(id: number) {
    this.addresses.update(current => 
      current.map(a => ({ ...a, isDefault: a.id === id }))
    );
  }
}