using TodoApp.DTOs.Requests;
using TodoApp.DTOs.Responses;

namespace TodoApp.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllAsync(string userId, CancellationToken cancellationToken);
    Task<CategoryResponse> CreateAsync(CategoryCreateRequest request, string userId, CancellationToken cancellationToken);
    Task DeleteAsync(int id, string userId, CancellationToken cancellationToken);
}
