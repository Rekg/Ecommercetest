export interface FilterCriteria {
  searchTerm: string;
  categoryId: number | null;     
  categoryName: string | null;   
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}