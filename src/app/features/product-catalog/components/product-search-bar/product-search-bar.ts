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
  
  public filterService = inject(ProductFilterService);
  query = '';

  ngOnInit() {
    
    this.filterService.filters$.subscribe(f => this.query = f.searchTerm);
  }

  onType(val: string) {
    this.filterService.updateFilters({ searchTerm: val });
  }

  toggle() {
   
    this.filterService.toggleFilters();
  }
}