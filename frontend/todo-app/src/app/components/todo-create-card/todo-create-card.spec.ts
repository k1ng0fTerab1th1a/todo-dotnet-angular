import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreateCard } from './todo-create-card';

describe('TodoCreateCard', () => {
  let component: TodoCreateCard;
  let fixture: ComponentFixture<TodoCreateCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCreateCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCreateCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
