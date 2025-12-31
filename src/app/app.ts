import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header';
import { ToastNotification } from './core/components/toast-notification/toast-notification';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, ToastNotification],
  template: `
        <app-header />    
    <main class="container mx-auto p-4 flex-grow">      <router-outlet />    </main>
        <app-toast-notification />    
    <footer class="bg-gray-200 text-center p-4 mt-8 text-gray-600">
            &copy; 2025 E-commerce Catalog. G Store.    
    </footer>
     
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
    `,
  ],
})
export class App {
  title = 'ecommerce-app';
}
