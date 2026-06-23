using Microsoft.AspNetCore.Identity;

namespace TodoApp.Interfaces;

public interface IAuthService
{
    Task<string?> LoginAsync(string username, string password);
    Task<IdentityResult> RegisterAsync(string username, string password);
}
