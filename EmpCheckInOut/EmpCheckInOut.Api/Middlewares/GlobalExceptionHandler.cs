using EmpCheckInOut.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

namespace EmpCheckInOut.Api.Middlewares;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IWebHostEnvironment _env;

    public GlobalExceptionHandler(
        RequestDelegate next,
        ILogger<GlobalExceptionHandler> logger,
        IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        int statusCode = StatusCodes.Status500InternalServerError;
        string title = "An error occurred while processing your request.";
        string detail = "An internal error occurred. Please try again later.";

        switch (exception)
        {
            case AuthenticationException:
                statusCode = StatusCodes.Status401Unauthorized;
                title = "Authentication Failed";
                detail = exception.Message;
                break;

            case ResourceNotFoundException:
                statusCode = StatusCodes.Status404NotFound;
                title = "Resource Not Found";
                detail = exception.Message;
                break;

            case BusinessRuleViolationException:
                statusCode = StatusCodes.Status400BadRequest;
                title = "Business Rule Violation";
                detail = exception.Message;
                break;

            case ConflictException:
                statusCode = StatusCodes.Status409Conflict;
                title = "Conflict";
                detail = exception.Message;
                break;
        }

        _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path,
            Extensions =
            {
                ["traceId"] = Activity.Current?.Id ?? context.TraceIdentifier
            }
        };

        if (_env.IsDevelopment())
        {
            problemDetails.Extensions["exception"] = exception.ToString();
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var json = JsonSerializer.Serialize(problemDetails);
        await context.Response.WriteAsync(json);
    }
}