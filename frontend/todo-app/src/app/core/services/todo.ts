import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TodoPageRequest,
  PageOf,
  TodoItemResponse,
  TodoCreateRequest,
  TodoUpdateRequest,
  CategoryResponse,
  CategoryCreateRequest
} from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private todoApiUrl = `${environment.apiUrl}/todo`;
  private categoryApiUrl = `${environment.apiUrl}/category`;

  getTodos(request: TodoPageRequest): Observable<PageOf<TodoItemResponse>> {
    let params = new HttpParams();
    
    if (request.pageIndex !== undefined) {
      params = params.set('pageIndex', request.pageIndex.toString());
    }
    if (request.pageSize !== undefined) {
      params = params.set('pageSize', request.pageSize.toString());
    }
    if (request.searchQuery) {
      params = params.set('searchQuery', request.searchQuery);
    }
    if (request.categoryIds && request.categoryIds.length > 0) {
      request.categoryIds.forEach(id => {
        params = params.append('categoryIds', id.toString());
      });
    }

    return this.http.get<PageOf<TodoItemResponse>>(this.todoApiUrl, { params });
  }

  createTodo(request: TodoCreateRequest): Observable<TodoItemResponse> {
    return this.http.post<TodoItemResponse>(this.todoApiUrl, request);
  }

  updateTodo(id: number, request: TodoUpdateRequest): Observable<TodoItemResponse> {
    return this.http.patch<TodoItemResponse>(`${this.todoApiUrl}/${id}`, request);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.todoApiUrl}/${id}`);
  }

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.categoryApiUrl);
  }

  createCategory(request: CategoryCreateRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.categoryApiUrl, request);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoryApiUrl}/${id}`);
  }
}
