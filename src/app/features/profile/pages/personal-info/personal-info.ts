import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info.html',
})
export class PersonalInfoComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  isEditing = signal(false);
  
  
  profileData = {
    firstName: this.authService.currentUser()?.firstName || '',
    lastName: this.authService.currentUser()?.lastName || '',
    email: this.authService.currentUser()?.email || ''
  };

  saveProfile() {
    
    this.toast.success('Profile updated successfully!');
    this.isEditing.set(false);
    
    
  }
}