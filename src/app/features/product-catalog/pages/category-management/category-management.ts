import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Added for the back link
import { ProductApiService } from '../../../api/product-api.service';
import { Category } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-management.html',
})
export class CategoryManagement implements OnInit {
  private api = inject(ProductApiService);
  private toast = inject(ToastService);
  categories = signal<Category[]>([]);

  ngOnInit() { this.load(); }

  load() {
    this.api.getCategories().subscribe(res => {
      this.categories.set(res.content || []);
    });
  }

  addCategory() {
    const name = prompt('Enter Category Name:');
    if (name) {
      const description = prompt('Enter Category Description (Optional):', '');
      this.api.createCategory({ name, description: description || '' }).subscribe({
        next: () => {
          this.toast.success('Category Added');
          this.load();
        },
        error: () => this.toast.error('Failed to add category')
      });
    }
  }

  editCategory(cat: Category) {
    const newName = prompt('Update Category Name:', cat.name);
    if (newName) {
      const newDesc = prompt('Update Description:', cat.description || '');
      this.api.updateCategory(cat.id, { 
        name: newName, 
        description: newDesc || '' 
      }).subscribe({
        next: () => {
          this.toast.success('Category Updated');
          this.load();
        },
        error: () => this.toast.error('Update failed')
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure? This will affect products associated with this category.')) {
      this.api.deleteCategory(id).subscribe({
        next: () => {
          this.toast.success('Category Deleted');
          this.load();
        },
        error: () => this.toast.error('Could not delete category')
      });
    }
  }
}