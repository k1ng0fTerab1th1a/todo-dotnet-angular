namespace TodoApp.DTOs.Responses;

public record CategoryResponse
{
    public required int Id { get; set; }
    public required string Name { get; set; }
}
