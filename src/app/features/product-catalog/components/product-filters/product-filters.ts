import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../../api/product-api.service';
import { ProductFilterService } from '../../services/product-filter.service';
import { Category } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-filters.html',
})
export class ProductFiltersComponent implements OnInit {
  private api = inject(ProductApiService);
  public fs = inject(ProductFilterService);

  categories = signal<Category[]>([]);
  activeId: number | null = null;
  activeOrder = 'asc';
  minVal: number | null = null;
  maxVal: number | null = null;

  ngOnInit() {
    this.api.getCategories().subscribe((res) => {
      const cats = Array.isArray(res) ? res : res?.content || [];
      this.categories.set(cats);
    });

    this.fs.filters$.subscribe((f) => {
      this.activeId = f.categoryId;
      this.activeOrder = f.sortOrder;
      this.minVal = f.minPrice;
      this.maxVal = f.maxPrice;
    });
  }

  updatePrice(key: string, event: any) {
    const val = event.target.value ? parseFloat(event.target.value) : null;
    this.fs.updateFilters({ [key]: val });
  }

  selectCat(cat: any) {
    this.fs.updateFilters({ categoryId: cat?.id || null, categoryName: cat?.name || '' });
  }

  sort(dir: 'asc' | 'desc') {
    this.fs.updateFilters({ sortBy: 'name', sortOrder: dir });
  }

  reset() {
    this.fs.clearFilters();
  }
}
