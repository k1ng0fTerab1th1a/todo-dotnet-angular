using Microsoft.AspNetCore.Identity;

namespace TodoApp.Data.Models;

public class TodoItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public bool IsCompleted { get; set; }
    public required string UserId { get; set; }
    public IdentityUser User { get; set; } = null!;
    public ICollection<Category> Categories { get; set; } = [];
}
