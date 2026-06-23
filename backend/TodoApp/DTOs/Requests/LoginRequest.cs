using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Requests;

public record LoginRequest(
    [Required] string Username,
    [Required] string Password
);
