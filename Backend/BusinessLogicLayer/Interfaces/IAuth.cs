using BusinessLogicLayer.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IAuth
    {
        public object GenerateToken(Models.Login user,bool isAuth = false, string? refreshToken = null);
        public TokenValidationParameters GetTokenValidationParameters();
        public object AuthenticateValidToken(Refresh_Token refreshToken);
        
        public object TokenRevoke(Refresh_Token data);
    }
}
