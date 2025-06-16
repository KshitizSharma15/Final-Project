using CogniProject.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace CogniProject.Exceptions
{
    public class ApiExceptionAttribute : Attribute, IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is NotFoundException)
            {
                context.Result = new NotFoundObjectResult(context.Exception.Message);
                context.HttpContext.Response.StatusCode = 404;
            }
            else if (context.Exception is BadRequestException)
            {
                context.Result = new BadRequestObjectResult(context.Exception.Message);
                context.HttpContext.Response.StatusCode = 400;
            }
            else if (context.Exception is ConflictException)
            {
                context.Result = new ConflictObjectResult(context.Exception.Message);
                context.HttpContext.Response.StatusCode = 409;
            }
            else if (context.Exception is UnauthorizedException)
            {
                context.Result = new UnauthorizedObjectResult(context.Exception.Message);
                context.HttpContext.Response.StatusCode = 401;
            }
            else
            {
                // Handle other exceptions (e.g., log them, return a 500 Internal Server Error)
                context.Result = new StatusCodeResult(500);
                context.HttpContext.Response.StatusCode = 500;
            }

            context.ExceptionHandled = true;
        }
    }
}