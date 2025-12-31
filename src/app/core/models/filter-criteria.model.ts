export interface FilterCriteria {
  searchTerm: string;
  categoryId: number | null;     // For UI highlight
  categoryName: string | null;   // For Backend API
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}