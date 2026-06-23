import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-create-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-create-card.html',
  styleUrl: './todo-create-card.scss'
})
export class TodoCreateCard {
  title = signal('');
  create = output<string>();

  onCreate() {
    const t = this.title().trim();
    if (t) {
      this.create.emit(t);
      this.title.set('');
    }
  }
}
