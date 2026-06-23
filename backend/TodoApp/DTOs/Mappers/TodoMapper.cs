using TodoApp.Data.Models;
using TodoApp.DTOs.Responses;

namespace TodoApp.DTOs.Mappers;

public static class TodoMapper
{
    public static TodoItemResponse ToResponse(this TodoItem todo)
    {
        return new TodoItemResponse
        {
            Id = todo.Id,
            Title = todo.Title,
            IsCompleted = todo.IsCompleted,
            Categories = todo.Categories.Select(c => c.ToResponse()).ToList(),
        };
    }

    public static CategoryResponse ToResponse(this Category category)
    {
        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
        };
    }
}
