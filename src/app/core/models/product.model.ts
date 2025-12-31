// The core Product entity (Matching GET responses)
export interface Product {
  id: number;
  productUuid?: string;
  name: string;
  categoryName: string;
  categoryId?: number;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  weight: string;
  size: string;
  color: string;
  active: boolean;
  lowStock?: boolean;
}

// RESTORED: For POST and PUT (Matching Postman 3.3.4)
export interface ProductRequest {
  name: string;
  categoryId: number;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  weight: string;
  size: string;
  color: string;
}

// RESTORED: For Paginated GET (Matching Postman 3.3.1)
export interface ProductPageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// RESTORED: For Category List (Matching Postman 3.4.1)
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryPageResponse {
  content: Category[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

