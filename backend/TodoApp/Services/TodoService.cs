using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Data.Models;
using TodoApp.DTOs.Mappers;
using TodoApp.DTOs.Requests;
using TodoApp.DTOs.Responses;
using TodoApp.Exceptions;
using TodoApp.Interfaces;

namespace TodoApp.Services;

public class TodoService : ITodoService
{
    private readonly ApplicationDbContext _context;

    public TodoService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PageOf<TodoItemResponse>> GetPageAsync(TodoPageRequest request, string userId, CancellationToken cancellationToken)
    {
        var todosQuery = _context.TodoItems
            .Where(todo => todo.UserId == userId);

        if (request.CategoryIds.Count != 0)
        {
            todosQuery = todosQuery.Where(todo => todo.Categories.Any(c => request.CategoryIds.Contains(c.Id)));
        }
        if (!string.IsNullOrWhiteSpace(request.SearchQuery))
        {
            todosQuery = todosQuery.Where(todo => todo.Title.Contains(request.SearchQuery));
        }

        var totalCount = await todosQuery.CountAsync(cancellationToken);

        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var todos = await todosQuery
            .Include(todo => todo.Categories)
            .Skip(pageSize * (request.PageIndex - 1))
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PageOf<TodoItemResponse>
        {
            Items = todos.Select(todo => todo.ToResponse()).ToList(),
            PageIndex = request.PageIndex,
            PageSize = pageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<TodoItemResponse> CreateAsync(TodoCreateRequest request, string userId, CancellationToken cancellationToken)
    {
        var todo = new TodoItem
        {
            Title = request.Title,
            UserId = userId,
        };

        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync(cancellationToken);

        return todo.ToResponse();
    }

    public async Task<TodoItemResponse> UpdateAsync(int id, TodoUpdateRequest request, string userId, CancellationToken cancellationToken)
    {
        var todo = await _context.TodoItems
            .Include(t => t.Categories)
            .FirstOrDefaultAsync(todo => todo.Id == id && todo.UserId == userId, cancellationToken)
            ?? throw new NotFoundException("Todo not found.");

        todo.Title = request.Title ?? todo.Title;
        todo.IsCompleted = request.IsCompleted ?? todo.IsCompleted;

        if (request.CategoryIds is not null)
        {
            var categories = await _context.Categories
                .Where(c => request.CategoryIds.Contains(c.Id) && c.UserId == userId)
                .ToListAsync(cancellationToken);

            if (categories.Count != request.CategoryIds.Count)
            {
                throw new NotFoundException("One or more categories were not found.");
            }

            todo.Categories = categories;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return todo.ToResponse();
    }

    public async Task DeleteAsync(int id, string userId, CancellationToken cancellationToken)
    {
        var todo = await _context.TodoItems.FirstOrDefaultAsync(todo => todo.Id == id && todo.UserId == userId, cancellationToken)
            ?? throw new NotFoundException("Todo not found.");

        _context.TodoItems.Remove(todo);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
