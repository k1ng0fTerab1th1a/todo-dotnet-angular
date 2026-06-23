namespace TodoApp.DTOs.Responses;

public record TodoItemResponse
{
    public required int Id { get; init; }
    public required string Title { get; init; }
    public required bool IsCompleted { get; init; }
    public required IList<CategoryResponse> Categories { get; set; } = [];
}
