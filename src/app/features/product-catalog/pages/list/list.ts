import { Component, OnInit, inject, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { ProductApiService } from '../../../api/product-api.service';
import { Product } from '../../../../core/models/product.model';
import { CardComponent } from '../../components/card/card'; 
import { ToastService } from '../../../../core/services/toast.service';
import { ProductSearchBarComponent } from '../../components/product-search-bar/product-search-bar';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters';
import { ProductFilterService } from '../../services/product-filter.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, CardComponent, ProductSearchBarComponent, ProductFiltersComponent],
  templateUrl: './list.html',
})
export class ProductListPage implements OnInit, OnDestroy {
  private apiService = inject(ProductApiService);
  private toastService = inject(ToastService);
  public filterService = inject(ProductFilterService);

  products = signal<Product[]>([]);
  isLoading = signal(false);
  displayLimit = signal(9);
  
  displayedProducts = computed(() => this.products().slice(0, this.displayLimit()));
  canLoadMore = computed(() => this.displayLimit() < this.products().length);

  private filterSub?: Subscription;

  ngOnInit(): void {
    this.filterSub = this.filterService.filters$
      .pipe(debounceTime(300))
      .subscribe(criteria => {
        this.displayLimit.set(9); 
        this.fetchFilteredProducts(criteria);
      });
  }

  loadMore(): void {
    this.displayLimit.update(current => current + 3);
  }

  fetchFilteredProducts(criteria: any): void {
    this.isLoading.set(true);
    const hasFilters = !!(criteria.searchTerm || criteria.categoryName || criteria.minPrice || criteria.maxPrice);
    
    const request$ = hasFilters 
      ? this.apiService.searchProducts(criteria)
      : this.apiService.getProducts(0, 50);

    request$.subscribe({
      next: (res: any) => {
        let results = res?.data || res?.content || (Array.isArray(res) ? res : []);
        results = this.filterService.applyLocalSort(results, criteria);
        this.products.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Failed to load products.');
      }
    });
  }

  ngOnDestroy(): void {
    this.filterSub?.unsubscribe();
  }
}