using Microsoft.AspNetCore.Mvc;
using TodoApp.DTOs.Requests;
using TodoApp.Interfaces;

namespace TodoApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.LoginAsync(request.Username, request.Password);
        if (token == null)
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(new { token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request.Username, request.Password);
        if (!result.Succeeded)
            return BadRequest(new
            {
                message = "User registration failed.",
                errors = result.Errors.Select(e => e.Description)
            });

        return Ok(new { message = "User registered successfully" });
    }
}
