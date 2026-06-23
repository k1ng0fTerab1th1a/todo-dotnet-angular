namespace TodoApp.Exceptions;

public class NotFoundException(string message) : Exception(message)
{
}
