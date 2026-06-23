using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Requests;

public record TodoCreateRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Title { get; init; }
}
