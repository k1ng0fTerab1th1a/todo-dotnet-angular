using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApp.DTOs.Requests;
using TodoApp.Interfaces;

namespace TodoApp.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPage([FromQuery] TodoPageRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        var page = await _todoService.GetPageAsync(request, userId, cancellationToken);

        return Ok(page);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TodoCreateRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        var todo = await _todoService.CreateAsync(request, userId, cancellationToken);
        return Ok(todo);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] TodoUpdateRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        var todo = await _todoService.UpdateAsync(id, request, userId, cancellationToken);
        return Ok(todo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        await _todoService.DeleteAsync(id, userId, cancellationToken);

        return Ok();
    }
}
