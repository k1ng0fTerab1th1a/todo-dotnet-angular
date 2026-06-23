using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Requests;

public record TodoPageRequest
{
    [Range(1, int.MaxValue)]
    public int PageIndex { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 5;
    public string? SearchQuery { get; init; }
    public List<int> CategoryIds { get; init; } = [];
}
