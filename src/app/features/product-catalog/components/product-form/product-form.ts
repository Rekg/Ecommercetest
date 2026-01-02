import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  OnDestroy,signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';
import { Subscription } from 'rxjs';
import { ProductApiService } from '../../../api/product-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Category } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment';
@Component({
  standalone: true,
  selector: 'product-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form *ngIf="productForm" [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-bold text-gray-700">
          Product Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          formControlName="name"
          class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Wireless Headphones"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label for="price" class="block text-sm font-bold text-gray-700">
            Price (ETB) <span class="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            formControlName="price"
            class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="categoryId" class="block text-sm font-bold text-gray-700">
            Category <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2 mt-1">
            <select
              id="categoryId"
              formControlName="categoryId"
              class="block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option [value]="null" disabled>Select a Category</option>
              <option *ngFor="let cat of categories()" [value]="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <button 
              type="button" 
              (click)="onQuickAddCategory()"
              class="px-4 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div>
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Color</label>
          <input type="text" formControlName="color" placeholder="Black" class="w-full border-none bg-transparent focus:ring-0 p-0 text-sm font-bold text-gray-800" />
        </div>
        <div>
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Size</label>
          <input type="text" formControlName="size" placeholder="6.1 inches" class="w-full border-none bg-transparent focus:ring-0 p-0 text-sm font-bold text-gray-800" />
        </div>
        <div>
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Weight</label>
          <input type="text" formControlName="weight" placeholder="170g" class="w-full border-none bg-transparent focus:ring-0 p-0 text-sm font-bold text-gray-800" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700">Product Image</label>
        <div class="mt-1 flex items-center space-x-4">
          <div class="flex-grow">
            <input
              type="file"
              (change)="onFileSelected($event)"
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div *ngIf="previewImageUrl" class="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <img [src]="getImageUrl(previewImageUrl)" 
                 class="w-full h-full object-contain" />
          </div>
        </div>
        <input type="text" formControlName="imageUrl" class="mt-2 block w-full border border-gray-300 rounded-xl shadow-sm p-2 text-xs bg-gray-50" placeholder="Manual Path" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label for="stockQuantity" class="block text-sm font-bold text-gray-700">Stock Quantity *</label>
          <input id="stockQuantity" type="number" formControlName="stockQuantity" class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="description" class="block text-sm font-bold text-gray-700">Description</label>
          <textarea id="description" formControlName="description" rows="1" class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t">
        <button
          type="submit"
          [disabled]="productForm.invalid || isUploading"
          class="py-4 px-10 bg-indigo-600 text-white font-black rounded-2xl transition duration-300 hover:bg-indigo-700 shadow-lg disabled:opacity-50"
        >
          {{ isUploading ? 'Uploading...' : (initialProduct?.id ? 'Save Changes' : 'Create Product') }}
        </button>
      </div>
    </form>
  `,
})
export class ProductForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private apiService = inject(ProductApiService);
  private toast = inject(ToastService);
  private imageSubscription: Subscription | undefined;

  productForm!: FormGroup;
  previewImageUrl: string | null = null;
  categories = signal<Category[]>([]);
  isUploading = false;
  private _initialProduct: Product | null = null;

  @Input() set initialProduct(value: Product | null) {
    this._initialProduct = value;
    if (value && this.productForm) {
      this.fillForm(value);
    }
  }

  get initialProduct(): Product | null {
    return this._initialProduct;
  }

  @Output() productSubmit = new EventEmitter<any>();

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.setupImagePreviewSubscription();

    if (this._initialProduct) {
      this.fillForm(this._initialProduct);
    }
  }

  

  private fillForm(p: Product) {
    this.productForm.patchValue(
      {
        name: p.name,
        price: p.price,
        description: p.description,
        categoryId: p.categoryId,
        imageUrl: p.imageUrl,
        stockQuantity: p.stockQuantity,
        color: p.color,
        size: p.size,
        weight: p.weight,
      },
      { emitEvent: false }
    );
    this.previewImageUrl = p.imageUrl;
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      categoryId: [null, Validators.required],
      imageUrl: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      color: [''],
      size: [''],
      weight: [''],
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe((res) => {
      this.categories.set(res.content || []);
    });
  }

  onQuickAddCategory() {
    const name = prompt('New Category Name:');
    if (name) {
      this.apiService.createCategory({ name, description: '' }).subscribe({
        next: (newCat) => {
          this.toast.success(`Category "${newCat.name}" created!`);
          this.loadCategories();
          this.productForm.patchValue({ categoryId: newCat.id });
        },
        error: () => this.toast.error('Failed to create category'),
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.apiService.uploadImage(file).subscribe({
        next: (path: string) => {
          
          this.productForm.patchValue({ imageUrl: path });
          this.previewImageUrl = path;
          this.isUploading = false;
          this.toast.success('Image uploaded!');
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.isUploading = false;
          this.toast.error('Upload failed');
        },
      });
    }
  }



  getImageUrl(path: string | null): string {
    const fallback = 'assets/images/placeholder-product.png';
    if (!path) return fallback;
    if (path.startsWith('http') || path.startsWith('assets/')) return path;

    

    return environment.apiUrl + path;
  }
  setupImagePreviewSubscription(): void {
    this.imageSubscription = this.productForm.get('imageUrl')?.valueChanges.subscribe((v) => {
      this.previewImageUrl = v;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productSubmit.emit(this.productForm.value);
    }
  }

  ngOnDestroy(): void {
    this.imageSubscription?.unsubscribe();
  }
}
