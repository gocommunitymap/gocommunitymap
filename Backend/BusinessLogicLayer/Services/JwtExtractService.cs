using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Services
{
    public class JwtExtractService : IJwtExtractService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public JwtExtractService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

        }
        private int UserCode { get; set; }

        public int? GetUserIdFromToken()
        {
            int? userId = null;
            try
            {
                var authHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();
                    var handler = new JwtSecurityTokenHandler();

                    var jwtToken = handler.ReadJwtToken(token);
                    var usercode = jwtToken.Claims.FirstOrDefault(c => c.Type == "usercode")?.Value;

                    UserCode = Convert.ToInt32(usercode);

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return UserCode;
        }

    }
}
