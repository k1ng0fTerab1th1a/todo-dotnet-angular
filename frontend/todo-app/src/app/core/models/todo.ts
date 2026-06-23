export interface CategoryResponse {
  id: number;
  name: string;
}

export interface TodoItemResponse {
  id: number;
  title: string;
  isCompleted: boolean;
  categories: CategoryResponse[];
}

export interface PageOf<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface TodoPageRequest {
  pageIndex?: number;
  pageSize?: number;
  searchQuery?: string;
  categoryIds?: number[];
}

export interface TodoCreateRequest {
  title: string;
}

export interface TodoUpdateRequest {
  title?: string;
  isCompleted?: boolean;
  categoryIds?: number[];
}

export interface CategoryCreateRequest {
  name: string;
}
