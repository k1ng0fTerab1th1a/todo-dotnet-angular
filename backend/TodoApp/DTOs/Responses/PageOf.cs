namespace TodoApp.DTOs.Responses;

public record PageOf<T>
{
    public required IList<T> Items { get; set; }
    public required int TotalCount { get; set; }
    public required int PageIndex { get; set; }
    public required int PageSize { get; set; }
}
