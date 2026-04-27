using BusinessLogicLayer.Models;
using DataAccessLayer.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net.NetworkInformation;
using System.Net;
using System.Security.Claims;
using System.Text;
using DataAccessLayer.Data;
using System.Security.Cryptography;
using BusinessLogicLayer.Interfaces;
using static BusinessLogicLayer.Config.DatabaseObjects;
using System;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Repositories
{
    public class Auth : IAuth
    {
        private readonly IDataAccess _db;
        public static string? selectedDatabase = "";
        private readonly IConfiguration _configuration;
        private readonly IEncryptionRepository _encryption;
        private DataAccessLayer.Models.User m_user;
        private DataAccessLayer.Models.Message msg;

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
        public object GetLocalIPAddress()
        {
            try
            {
                if (NetworkInterface.GetIsNetworkAvailable())
                {
                    var host = Dns.GetHostEntry(Dns.GetHostName());
                    string[] list = new string[3];
                    for (int i = 0; i < host.AddressList.Length; i++)
                    {
                        if (list.Length > i)
                        {
                            list[i] = host.AddressList[i].ToString();
                        }
                    }
                    list[host.AddressList.Length] = host.HostName;

                    return list;
                }
                else
                {
                    return "No network available!";
                }
            }
            catch (Exception)
            {

                throw;
            }


        }

        public Auth(IConfiguration configuration, IDataAccess db, IEncryptionRepository encryption)
        {
            _configuration = configuration;
            _db = db;
            _encryption = encryption;
            selectedDatabase = _configuration["database"];
        }

        //-----------------------------------------------------------------------------//

        private object ExecuteProc(string email, string password, string refreshToken, string ip_address, string host_name, string action, DateTime tokenExiry)
        {
            try
            {
                string sp_name = Procedures.SP_AUTH.ToString();

                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, action);
                dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, email);
                dyParam.AddDynamicParams("PASSWORD", DbType.String, ParameterDirection.Input, password);
                dyParam.AddDynamicParams("REFRESH_TOKEN", DbType.String, ParameterDirection.Input, refreshToken);
                dyParam.AddDynamicParams("TOKEN_EXPIRY", DbType.DateTime, ParameterDirection.Input, tokenExiry);
                dyParam.AddDynamicParams("IP_ADDRESS", DbType.String, ParameterDirection.Input, ip_address);
                dyParam.AddDynamicParams("HOST_NAME", DbType.String, ParameterDirection.Input, host_name);
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                var result = action == Actions.DELETE.ToString() ? _db.ExecuteProc(sp_name, dyParam) : _db.ExecuteProcUser(sp_name, dyParam);

                return result;
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public object GenerateToken(Models.Login user, bool isAuth = false, string? refreshToken = null)
        {
            try
            {
                var _tokenValidityInMinutes = _configuration["Jwt:TokenValidityInMinutes"];
                int _TokenExpiry = int.Parse(_configuration["Jwt:RefreashTokenValidityInMinutes"]);
                var hostDetail = (GetLocalIPAddress() as string[]);
                var _refreshToken = new TokenRefresh().GenerateRefreshToken(100);
                List<Models.User> items = new List<Models.User>();
                Models.User item = new Models.User();
                DataAccessLayer.Models.User usr = new DataAccessLayer.Models.User();
                DateTime tokenExpiry = DateTime.Now.AddMinutes(Convert.ToDouble(_TokenExpiry));
                if (!isAuth)
                {
                    var result = ExecuteProc(user.email, user.password, _refreshToken, hostDetail[0], hostDetail[2], Actions.LOGIN.ToString(), tokenExpiry);
                    try
                    {
                        usr = (DataAccessLayer.Models.User)result;

                    }
                    catch (Exception)
                    {

                        DataAccessLayer.Models.Message msg = new DataAccessLayer.Models.Message();
                        msg = (DataAccessLayer.Models.Message)result;
                        return msg;
                    }

                }
                if (isAuth)
                {

                    usr.email = user.email;
                    usr.token_expiry = DateTime.Now.AddMinutes(Convert.ToDouble(_tokenValidityInMinutes));
                }

                if (usr.email != null || isAuth)
                {
                    var securityKey = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]);
                    DateTime _expiry = Convert.ToDateTime(usr.token_expiry);
                    var claims = new Claim[] { new Claim("email", user.email) };

                    var credentials = new SigningCredentials(new SymmetricSecurityKey(securityKey), SecurityAlgorithms.HmacSha512);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Issuer"],
                        claims,
                        expires: _expiry,
                        signingCredentials: credentials);
                    var authToken = new Models.Auth { usercode = usr.user_code, user_name = usr.user_name, email = usr.email, user_type=usr.user_type, role_name = usr.role_name, refresh_token = isAuth ? refreshToken : _refreshToken, token = new JwtSecurityTokenHandler().WriteToken(token) };
                    return authToken;
                }
                else
                {
                    return null;
                }


            }
            catch (Exception)
            {

                return null;
            }
        }

        private object CheckRefreshToken(string[] data, Refresh_Token refreshToken)
        {
            try
            {
                var _tokenValidityInMinutes = _configuration["Jwt:TokenValidityInMinutes"];
                DateTime tokenExpiry = DateTime.Now.AddMinutes(Convert.ToDouble(_tokenValidityInMinutes));

                string _email = refreshToken.Email;
                var hostDetail = (GetLocalIPAddress() as string[]);

                List<Models.User> items = new List<Models.User>();
                Models.User item = new Models.User();
                DataAccessLayer.Models.User usr = new DataAccessLayer.Models.User();
                var result = ExecuteProc(_email, null, refreshToken.RefreshToken, hostDetail[0], hostDetail[2], Actions.AUTH.ToString(), tokenExpiry);

                //usr = (DataAccessLayer.Models.User)result;
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public TokenValidationParameters GetTokenValidationParameters()
        {
            var securityKey = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]);

            return new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(securityKey),
                ValidIssuers = new string[] { _configuration["Jwt:Issuer"] },
                ValidAudiences = new string[] { _configuration["Jwt:Issuer"] },
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false
            };
        }

        public object AuthenticateValidToken(Refresh_Token refreshToken)
        {

            if (refreshToken == null)
            {
                return "Invalid request";
            }

            var handler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;
            var tokenValidationParameters = GetTokenValidationParameters();
            var claims = handler.ValidateToken(refreshToken.Token, tokenValidationParameters, out validatedToken);
            var _email = claims.Claims.FirstOrDefault(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value ?? "";
            //var data = claims.Claims.FirstOrDefault(x => x.Type == "data")?.Value ?? "";
            //var _data = _encryption.Decrypt(data).Split(',');

            var result = CheckRefreshToken(null, refreshToken);
            //DataAccessLayer.Models.User usr = CheckRefreshToken(null, refreshToken);
            try
            {
                DataAccessLayer.Models.User usr = (DataAccessLayer.Models.User)result;
                usr = (DataAccessLayer.Models.User)result;
            }
            catch (Exception)
            {
                msg = new DataAccessLayer.Models.Message();
                msg = (DataAccessLayer.Models.Message)result;
            }

            if (msg == null)
            {

                //m_user = usr;
                var user = new Models.Login { email = _email };
                object newAuth = GenerateToken(user, true, refreshToken.RefreshToken);

                return newAuth;
                //}
            }
            else { return msg; }
        }

        public object TokenRevoke(Refresh_Token TokenData)
        {
            if (TokenData == null)
            {
                return "Invalid request";
            }
            var handler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;
            var tokenValidationParameters = GetTokenValidationParameters();
            var claim = handler.ValidateToken(TokenData.Token, tokenValidationParameters, out validatedToken);
            var hostDetail = (GetLocalIPAddress() as string[]);

            var result = ExecuteProc(TokenData.Email, null, TokenData.RefreshToken, hostDetail[0], hostDetail[2], Actions.DELETE.ToString(), DateTime.Now);
            return result;
        }


        //public object RefreshToken(string email, string refreshToken)
        //{
        //    string? refToken = "";

        //    string query = "Token_Validate_or_Update @action='validate', @email='" + email + "', @token='" + refreshToken + "'";
        //    _db.Query<Models.User, dynamic>(query, new { });

        //    RefreshTokenStore.TryGetValue(email, out refToken);

        //    return refToken.Equals(refreshToken);
        //}
        public IDbConnection GetConnection()
        {
            var connectionString = _configuration.GetConnectionString("MSSQL_CONNECTION_STRINGS");
            var conn = new SqlConnection(connectionString);
            return conn;
        }
    }
}
