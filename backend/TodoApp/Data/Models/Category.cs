using Microsoft.AspNetCore.Identity;

namespace TodoApp.Data.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string UserId { get; set; }
    public IdentityUser User { get; set; } = null!;
    public ICollection<TodoItem> Todos { get; set; } = [];
}
