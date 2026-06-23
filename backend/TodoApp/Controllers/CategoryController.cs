using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApp.DTOs.Requests;
using TodoApp.Interfaces;

namespace TodoApp.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        var categories = await _categoryService.GetAllAsync(userId, cancellationToken);

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryCreateRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        var category = await _categoryService.CreateAsync(request, userId, cancellationToken);
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("No user ID in the token, JWT is misconfigured");

        await _categoryService.DeleteAsync(id, userId, cancellationToken);

        return Ok();
    }
}
