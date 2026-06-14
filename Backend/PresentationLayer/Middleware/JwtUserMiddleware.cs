using BusinessLogicLayer.Interfaces;
using System.IdentityModel.Tokens.Jwt;

namespace PresentationLayer.Middleware
{
    public class JwtUserMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogService _logService;

        public JwtUserMiddleware(RequestDelegate next, ILogService logService)
        {
            _next = next;
            _logService = logService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            _logService.Add("System", "JwtUserMiddleware", $"Processing request: {context.Request.Method} {context.Request.Path}");
            var authHeader = context.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();

                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    var jwtToken = handler.ReadJwtToken(token);

                    // Extract claims from token
                    var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "userId")?.Value;
                    var username = jwtToken.Claims.FirstOrDefault(c => c.Type == "unique_name" || c.Type == "name")?.Value;
                    var role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

                    // Store in HttpContext for downstream use
                    context.Items["CurrentUser"] = new
                    {
                        UserId = userId,
                        Username = username,
                        Role = role
                    };
                }
                catch
                {
                    _logService.Add("System", "JwtUserMiddleware", "Invalid JWT token");
                    // ignore invalid token
                }
            }
            await _next(context);
        }
    }
}
