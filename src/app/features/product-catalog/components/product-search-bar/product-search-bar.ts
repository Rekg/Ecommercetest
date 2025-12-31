import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFilterService } from '../../services/product-filter.service';

@Component({
  selector: 'app-product-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search-bar.html',
})
export class ProductSearchBarComponent implements OnInit {
  // Changed to public so the HTML template can see filterService.showFilters()
  public filterService = inject(ProductFilterService);
  query = '';

  ngOnInit() {
    // Keep the input in sync if filters are cleared from elsewhere
    this.filterService.filters$.subscribe(f => this.query = f.searchTerm);
  }

  onType(val: string) {
    this.filterService.updateFilters({ searchTerm: val });
  }

  toggle() {
    // Toggles the signal we added to the service
    this.filterService.toggleFilters();
  }
}