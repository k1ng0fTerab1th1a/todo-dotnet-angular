using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Data.Models;
using TodoApp.DTOs.Mappers;
using TodoApp.DTOs.Requests;
using TodoApp.DTOs.Responses;
using TodoApp.Exceptions;
using TodoApp.Interfaces;

namespace TodoApp.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync(string userId, CancellationToken cancellationToken)
    {
        var categories = await _context.Categories.Where(c => c.UserId == userId).ToListAsync(cancellationToken);
        return categories.Select(c => c.ToResponse());
    }

    public async Task<CategoryResponse> CreateAsync(CategoryCreateRequest request, string userId, CancellationToken cancellationToken)
    {
        var category = new Category
        {
            Name = request.Name,
            UserId = userId,
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        return category.ToResponse();
    }

    public async Task DeleteAsync(int id, string userId, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId, cancellationToken)
            ?? throw new NotFoundException("Todo not found.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
