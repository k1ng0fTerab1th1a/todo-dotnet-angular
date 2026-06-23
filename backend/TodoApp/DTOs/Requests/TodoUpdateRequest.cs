using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Requests;

public record TodoUpdateRequest
{
    [StringLength(200, MinimumLength = 1)]
    public string? Title { get; init; }
    public bool? IsCompleted { get; init; }
    public List<int>? CategoryIds { get; init; }
}
