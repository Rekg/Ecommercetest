import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { FilterCriteria } from '../../../core/models/filter-criteria.model';
import {signal} from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ProductFilterService {
  private defaultCriteria: FilterCriteria = {
    searchTerm: '',
    categoryId: null,
    categoryName: '',
    minPrice: null,
    maxPrice: null,
    sortBy: 'name',
    sortOrder: 'asc'
  };

  private criteriaSubject = new BehaviorSubject<FilterCriteria>(this.defaultCriteria);
  filters$ = this.criteriaSubject.asObservable();

  
  updateFilters(updates: Partial<FilterCriteria>) {
  this.criteriaSubject.next({ ...this.criteriaSubject.value, ...updates });
  
}

  clearFilters() {
    this.criteriaSubject.next(this.defaultCriteria);
  }

  hasActiveFilters(): boolean {
    const c = this.criteriaSubject.value;
    return !!(c.searchTerm || c.categoryName || c.minPrice || c.maxPrice);
  }

  applyLocalSort(products: Product[], criteria: FilterCriteria): Product[] {
    const temp = [...products];
    return temp.sort((a, b) => {
      const field = criteria.sortBy as keyof Product;
      const valA = a[field]?.toString().toLowerCase() || '';
      const valB = b[field]?.toString().toLowerCase() || '';
      const res = valA < valB ? -1 : (valA > valB ? 1 : 0);
      return criteria.sortOrder === 'asc' ? res : -res;
    });
  }
  showFilters = signal(false);

toggleFilters() {
  this.showFilters.update(v => !v);
}
}