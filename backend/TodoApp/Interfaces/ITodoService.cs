using TodoApp.DTOs.Requests;
using TodoApp.DTOs.Responses;

namespace TodoApp.Interfaces;

public interface ITodoService
{
    Task<PageOf<TodoItemResponse>> GetPageAsync(TodoPageRequest request, string userId, CancellationToken cancellationToken);
    Task<TodoItemResponse> CreateAsync(TodoCreateRequest request, string userId, CancellationToken cancellationToken);
    Task<TodoItemResponse> UpdateAsync(int id, TodoUpdateRequest request, string userId, CancellationToken cancellationToken);
    Task DeleteAsync(int id, string userId, CancellationToken cancellationToken);
}
