import { Component, inject, OnInit } from '@angular/core';
import { Product, ProductRequest } from '../../../../core/models/product.model';
import { ProductApiService } from '../../../api/product-api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  finalize,
  catchError,
  of,
  switchMap,
  filter,
  tap,
  map,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductForm } from '../../components/product-form/product-form';
import { ToastService } from '../../../../core/services/toast.service';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'product-edit-page',
  imports: [CommonModule, ProductForm, RouterModule],
  templateUrl: './edit.html',
})
export class EditComponent implements OnInit {
  private apiService = inject(ProductApiService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private toastService = inject(ToastService);
  private titleService = inject(Title);

  productId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  initialProduct$ = new BehaviorSubject<Product | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        map((idString) => (idString ? parseInt(idString, 10) : null)),
        tap((id) => {
          this.productId = id;
          this.titleService.setTitle(id ? 'Edit Product' : 'Add New Product');
        }),
        filter((id) => !!id),
        switchMap((id) => this.loadProductForEditing(id as number))
      )
      .subscribe();
  }

  loadProductForEditing(id: number): Observable<Product | null> {
    this.isLoading = true;
    return this.apiService.getProductById(id).pipe(
      tap((product: Product) => {
        const mappedProduct: Product = {
          ...product,
          categoryId: product.categoryId || 1,
        };
        this.initialProduct$.next(null); 
        this.initialProduct$.next(mappedProduct);
      }),
      catchError(() => {
        this.errorMessage = 'Could not fetch product details.';
        return of(null);
      }),
      finalize(() => (this.isLoading = false))
    );
  }

  toggleStatus(product: Product): void {
    if (!this.productId) return;

    const newStatus = !product.active;

    this.apiService.toggleProductStatus(this.productId, newStatus).subscribe({
      next: (updatedProduct) => {
        this.initialProduct$.next(updatedProduct);
        this.toastService.success(
          `Product ${updatedProduct.active ? 'Activated' : 'Deactivated'} successfully`
        );
      },
      error: () => this.toastService.error('Failed to change product status'),
    });
  }

  handleFormSubmission(formData: any): void {
    this.isLoading = true;
    this.errorMessage = null;

    const productRequest: ProductRequest = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      categoryId: Number(formData.categoryId),
      imageUrl: formData.imageUrl || '',
      color: formData.color || '',
      size: formData.size || '',
      weight: formData.weight ? String(formData.weight) : '',
    };

    const apiCall$ = this.productId
      ? this.apiService.updateProduct(this.productId, productRequest)
      : this.apiService.addProduct(productRequest);

    apiCall$
      .pipe(
        finalize(() => (this.isLoading = false)),
        catchError((error) => {
          const action = this.productId ? 'update' : 'add';
          this.errorMessage = error.message || `Failed to ${action} product.`;
          this.toastService.error(' Operation failed!');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          const action = this.productId ? 'updated' : 'added';
          this.toastService.success(` Product successfully ${action}!`);
          this.router.navigate(['/products']);
        }
      });
  }
}
