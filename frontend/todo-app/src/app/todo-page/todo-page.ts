import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../core/services/todo';
import { CategoryResponse, TodoItemResponse, TodoUpdateRequest } from '../core/models/todo';
import { TodoCard } from '../components/todo-card/todo-card';
import { TodoCreateCard } from '../components/todo-create-card/todo-create-card';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [FormsModule, TodoCard, TodoCreateCard],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPage implements OnInit {
  private todoService = inject(TodoService);

  todos = signal<TodoItemResponse[]>([]);
  categories = signal<CategoryResponse[]>([]);
  
  pageIndex = signal(1);
  pageSize = signal(5);
  totalCount = signal(0);
  
  searchQuery = signal('');
  selectedCategoryIds = signal<number[]>([]);

  errorMessage = signal<string | null>(null);

  private handleError(err: any) {
    console.error(err);
    this.errorMessage.set(err.error?.detail || err.error?.title || 'An unexpected error occurred. Please try again.');
    setTimeout(() => this.errorMessage.set(null), 5000);
  }

  ngOnInit() {
    this.loadCategories();
    this.loadTodos();
  }

  loadCategories() {
    this.todoService.getCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: err => this.handleError(err)
    });
  }

  loadTodos() {
    this.todoService.getTodos({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      searchQuery: this.searchQuery(),
      categoryIds: this.selectedCategoryIds()
    }).subscribe({
      next: page => {
        this.todos.set(page.items);
        this.totalCount.set(page.totalCount);
      },
      error: err => this.handleError(err)
    });
  }
  
  toggleCategoryFilter(categoryId: number) {
    const current = this.selectedCategoryIds();
    if (current.includes(categoryId)) {
      this.selectedCategoryIds.set(current.filter(id => id !== categoryId));
    } else {
      this.selectedCategoryIds.set([...current, categoryId]);
    }
    this.pageIndex.set(1);
    this.loadTodos();
  }

  onSearch() {
    this.pageIndex.set(1);
    this.loadTodos();
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategoryIds.set([]);
    this.pageIndex.set(1);
    this.loadTodos();
  }

  deleteCategory(categoryId: number, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this category? It will be removed from all associated todos.')) {
      this.todoService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.selectedCategoryIds.update(ids => ids.filter(id => id !== categoryId));
          this.loadCategories();
          this.loadTodos();
        },
        error: err => this.handleError(err)
      });
    }
  }

  createTodo(title: string) {
    this.todoService.createTodo({ title }).subscribe({
      next: () => this.loadTodos(),
      error: err => this.handleError(err)
    });
  }

  updateTodo(event: { id: number, request: TodoUpdateRequest }) {
    this.todoService.updateTodo(event.id, event.request).subscribe({
      next: () => this.loadTodos(),
      error: err => this.handleError(err)
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.loadTodos(),
      error: err => this.handleError(err)
    });
  }

  createCategoryForTodo(event: { name: string, todoId: number }) {
    this.todoService.createCategory({ name: event.name }).subscribe({
      next: newCat => {
        this.loadCategories();
        
        const todo = this.todos().find(t => t.id === event.todoId);
        if (todo) {
          const currentCatIds = todo.categories.map(c => c.id);
          this.updateTodo({
            id: event.todoId,
            request: { categoryIds: [...currentCatIds, newCat.id] }
          });
        }
      },
      error: err => this.handleError(err)
    });
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalCount() / this.pageSize()));
  }

  nextPage() {
    if (this.pageIndex() < this.totalPages) {
      this.pageIndex.update(v => v + 1);
      this.loadTodos();
    }
  }

  prevPage() {
    if (this.pageIndex() > 1) {
      this.pageIndex.update(v => v - 1);
      this.loadTodos();
    }
  }
}
