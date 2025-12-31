import { Component, EventEmitter, Input, OnInit, Output, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Product, Category } from '../../../../core/models/product.model';
import { Subscription } from 'rxjs';
import { ProductApiService } from '../../../api/product-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
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
  
  // Moved options here to fix the compilation error
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6.1"', '6.7"'];

  private _initialProduct: Product | null = null;

  @Input() set initialProduct(value: Product | null) {
    this._initialProduct = value;
    if (value && this.productForm) this.fillForm(value);
  }
  
  get initialProduct(): Product | null { return this._initialProduct; }

  @Output() productSubmit = new EventEmitter<any>();

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.setupImagePreviewSubscription();
    if (this._initialProduct) this.fillForm(this._initialProduct);
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      categoryId: [null, Validators.required],
      imageUrl: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      color: ['#4f46e5'],
      size: [''],
      weight: ['']
    });
  }

  setSize(val: string) {
    this.productForm.patchValue({ size: val });
  }

  private fillForm(p: Product) {
    this.productForm.patchValue({
      name: p.name, price: p.price, description: p.description,
      categoryId: p.categoryId, imageUrl: p.imageUrl,
      stockQuantity: p.stockQuantity, color: p.color,
      size: p.size, weight: p.weight
    }, { emitEvent: false });
    this.previewImageUrl = p.imageUrl;
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
        error: () => this.toast.error('Failed to create category')
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
        error: () => {
          this.isUploading = false;
          this.toast.error('Upload failed');
        }
      });
    }
  }

  getImageUrl(path: string | null): string {
    if (!path) return 'assets/images/placeholder_product.jpg';
    if (path.startsWith('http') || path.startsWith('assets/')) return path;
    return environment.apiUrl + path;
  }

  setupImagePreviewSubscription(): void {
    this.imageSubscription = this.productForm.get('imageUrl')?.valueChanges.subscribe(v => {
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