
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


export interface ProductPageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}


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

