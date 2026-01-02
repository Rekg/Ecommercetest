import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Product, ProductPageResponse, ProductRequest, 
  CategoryPageResponse, Category 
} from '../../core/models/product.model';
import { FilterCriteria } from '../../core/models/filter-criteria.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  getCategories(): Observable<CategoryPageResponse> {
    return this.http.get<CategoryPageResponse>(`${this.baseUrl}/categories`);
  }

  getProducts(page = 0, size = 10): Observable<ProductPageResponse> {
    return this.http.get<ProductPageResponse>(`${this.baseUrl}/products`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  searchProducts(criteria: FilterCriteria): Observable<ProductPageResponse> {
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '20')
      .set('sortBy', criteria.sortBy)
      .set('sortDir', criteria.sortOrder);

    if (criteria.searchTerm) params = params.set('name', criteria.searchTerm);
    if (criteria.categoryName) params = params.set('category', criteria.categoryName);
    if (criteria.minPrice) params = params.set('minPrice', criteria.minPrice.toString());
    if (criteria.maxPrice) params = params.set('maxPrice', criteria.maxPrice.toString());

    return this.http.get<ProductPageResponse>(`${this.baseUrl}/products/search`, { params });
  }

  addProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  
  

  toggleProductStatus(id: number, active: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/products/${id}/status`, { active });
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/products/upload-image`, formData, { 
      responseType: 'text' 
    });
  }

  
  uploadImages(files: FileList): Observable<string[]> {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    return this.http.post<string[]>(`${this.baseUrl}/products/upload-images`, formData);
  }
  createCategory(category: { name: string; description?: string }): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  updateCategory(id: number, category: { name: string; description?: string }): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }
}