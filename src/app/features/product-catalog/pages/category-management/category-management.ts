import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { ProductApiService } from '../../../api/product-api.service';
import { Category } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './category-management.html',
})
export class CategoryManagement implements OnInit {
  private api = inject(ProductApiService);
  private toast = inject(ToastService);
  categories = signal<Category[]>([]);

  
  isModalOpen = signal(false);
  modalMode = signal<'add' | 'edit' | 'delete'>('add');
  
  
  currentCategory = signal<Partial<Category>>({ name: '', description: '' });
  selectedCategoryId: number | null = null;

  ngOnInit() { this.load(); }

  load() {
  this.api.getCategories().subscribe((res: { content: Category[] }) => {
    this.categories.set(res.content || []);
  });
}

  
  addCategory() {
    this.modalMode.set('add');
    this.currentCategory.set({ name: '', description: '' });
    this.isModalOpen.set(true);
  }

  editCategory(cat: Category) {
    this.modalMode.set('edit');
    this.selectedCategoryId = cat.id;
    this.currentCategory.set({ ...cat });
    this.isModalOpen.set(true);
  }

  deleteCategory(id: number) {
    this.modalMode.set('delete');
    this.selectedCategoryId = id;
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  
  confirmAction() {
    const catData = this.currentCategory();
    
    if (this.modalMode() === 'add') {
      this.api.createCategory({ name: catData.name!, description: catData.description || '' }).subscribe({
        next: () => { this.toast.success('Category Added'); this.load(); this.closeModal(); },
        error: () => this.toast.error('Failed to add category')
      });
    } else if (this.modalMode() === 'edit' && this.selectedCategoryId) {
      this.api.updateCategory(this.selectedCategoryId, { name: catData.name!, description: catData.description || '' }).subscribe({
        next: () => { this.toast.success('Category Updated'); this.load(); this.closeModal(); },
        error: () => this.toast.error('Update failed')
      });
    } else if (this.modalMode() === 'delete' && this.selectedCategoryId) {
      this.api.deleteCategory(this.selectedCategoryId).subscribe({
        next: () => { this.toast.success('Category Deleted'); this.load(); this.closeModal(); },
        error: () => this.toast.error('Could not delete category')
      });
    }
  }
}