import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoItemResponse, CategoryResponse, TodoUpdateRequest } from '../../core/models/todo';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-card.html',
  styleUrl: './todo-card.scss'
})
export class TodoCard {
  todo = input.required<TodoItemResponse>();
  availableCategories = input.required<CategoryResponse[]>();

  update = output<{ id: number, request: TodoUpdateRequest }>();
  delete = output<number>();
  createCategory = output<{ name: string, todoId: number }>();

  isEditing = signal(false);
  editTitle = signal('');
  newCategoryName = signal('');
  showCategoryDropdown = signal(false);

  unassignedCategories() {
    const currentIds = this.todo().categories.map(c => c.id);
    return this.availableCategories().filter(c => !currentIds.includes(c.id));
  }

  startEditing() {
    this.editTitle.set(this.todo().title);
    this.isEditing.set(true);
  }

  saveTitle() {
    const t = this.editTitle().trim();
    if (t && t !== this.todo().title) {
      this.update.emit({ id: this.todo().id, request: { title: t } });
    }
    this.isEditing.set(false);
  }

  cancelEditing() {
    this.isEditing.set(false);
  }

  toggleCompleted() {
    this.update.emit({ 
      id: this.todo().id, 
      request: { isCompleted: !this.todo().isCompleted } 
    });
  }

  removeCategory(categoryId: number) {
    const currentIds = this.todo().categories.map(c => c.id);
    const newIds = currentIds.filter(id => id !== categoryId);
    this.update.emit({ 
      id: this.todo().id, 
      request: { categoryIds: newIds } 
    });
  }

  addCategory(categoryId: number) {
    const currentIds = this.todo().categories.map(c => c.id);
    if (!currentIds.includes(categoryId)) {
      this.update.emit({ 
        id: this.todo().id, 
        request: { categoryIds: [...currentIds, categoryId] } 
      });
    }
    this.showCategoryDropdown.set(false);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.delete.emit(this.todo().id);
    }
  }

  onCreateCategory() {
    const name = this.newCategoryName().trim();
    if (name) {
      this.createCategory.emit({ name, todoId: this.todo().id });
      this.newCategoryName.set('');
      this.showCategoryDropdown.set(false);
    }
  }
}
