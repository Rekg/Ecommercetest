import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-layout.html',
})
export class ProfileLayoutComponent {
  public authService = inject(AuthService);
}