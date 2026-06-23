using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Requests;

public record CategoryCreateRequest
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public required string Name { get; init; }
}
