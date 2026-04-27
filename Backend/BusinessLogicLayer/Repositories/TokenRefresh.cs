using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Repositories
{
    public class TokenRefresh
    {
        public string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString();
        }
        public string GenerateRefreshToken(int size = 32)
        {
            var refToken = new byte[size];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(refToken);

                return Convert.ToBase64String(refToken);
            }
        }
    }
}
