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
using BusinessLogicLayer.Services;

namespace BusinessLogicLayer.Repositories
{
	public class Auth : IAuth
	{
		private readonly IDataAccess _db;
		public static string? selectedDatabase = "";
		private readonly IAppSettingsService _appSettingsService;
		private readonly IEncryptionRepository _encryption;
		private readonly ILogService _logService;
		private DataAccessLayer.Models.User m_user;
		private DataAccessLayer.Models.Message msg;
		private readonly JwtSettings jwtSettings;
		private readonly ConnectionStrings connectionStrings;
		public Auth(IDataAccess db, IEncryptionRepository encryption, ILogService logService, IAppSettingsService appSettingsService)
		{
			_db = db;
			_encryption = encryption;
			selectedDatabase = appSettingsService.GetDatabase();
			jwtSettings = appSettingsService.GetJwtSettings();
			connectionStrings = appSettingsService.GetConnectionStrings();
			_logService = logService;
		}

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
				_logService.Add("GetLocalIPAddress", "Step", "1");
				if (NetworkInterface.GetIsNetworkAvailable())
				{
					_logService.Add("GetLocalIPAddress", "Step", "2");

					var host = Dns.GetHostEntry(Dns.GetHostName());
					_logService.Add("GetLocalIPAddress", "Step", "3" + host.AddressList.Length.ToString());
					string[] list = new string[3];
					//for (int i = 0; i < host.AddressList.Length; i++)
					//{
					//    if(i > 1 ) break;

					//    if (list.Length > i)
					//    {
					//        list[i] = host.AddressList[i].ToString();
					//        _logService.Add("GetLocalIPAddress", "Step", "4: "+"("+i.ToString()+")" + list[i]);
					//    }
					//}
					list[0] = host.AddressList[0]?.ToString() ?? "";
					list[1] = host.AddressList[1]?.ToString() ?? "";
					list[2] = host.HostName;

					return list;
				}
				else
				{
					return "No network available!";
				}
			}
			catch (Exception ex)
			{
				_logService.Add("GetLocalIPAddress", "Step", "5: " + ex.Message);
				throw;
			}


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

				if (dyParam == null)
				{
					_logService.Add("dyParam", "is", "null");
				}

				var result = action == Actions.DELETE.ToString() ? _db.ExecuteProc(sp_name, dyParam) : _db.ExecuteProcUser(sp_name, dyParam);

				return result;
			}
			catch (Exception ex)
			{
				_logService.Add("ExecuteProc", "Step", "4: " + ex.Message);
				throw;
			}
		}

		public object GenerateToken(Models.Login user, bool isAuth = false, string? refreshToken = null, DataAccessLayer.Models.User UserDetail = null)
		{
			try
			{
				_logService.Add("GenerateToken", "Step", "1");
				var _tokenValidityInMinutes = jwtSettings.TokenValidityInMinutes;
				int _TokenExpiry = jwtSettings.RefreshTokenValidityInMinutes;
				var hostDetail = (GetLocalIPAddress() as string[]);
				_logService.Add("GenerateToken", "Step", "2");
				var _refreshToken = new TokenRefresh().GenerateRefreshToken(100);
				_logService.Add("GenerateToken", "Step", "2.1");
				List<Models.User> items = new List<Models.User>();
				_logService.Add("GenerateToken", "Step", "2.2");
				Models.User item = new Models.User();
				_logService.Add("GenerateToken", "Step", "2.3");
				DataAccessLayer.Models.User usr = new DataAccessLayer.Models.User();
				_logService.Add("GenerateToken", "Step", "2.4");
				DateTime tokenExpiry = DateTime.Now.AddMinutes(Convert.ToDouble(_TokenExpiry));
				_logService.Add("GenerateToken", "Step", "3");
				if (!isAuth)
				{
					//var hostDetail = new string[] { "NA", "NA", "NA" };
					//_logService.Add("GenerateToken", "Step", "4 ["+ hostDetail[0] + " | "+ hostDetail[1] + " | "+ hostDetail[2] + "]");
					var result = ExecuteProc(user.email, user.password, _refreshToken, hostDetail[0], hostDetail[2], Actions.LOGIN.ToString(), tokenExpiry);
					try
					{
						_logService.Add("GenerateToken", "Step", "5");
						usr = (DataAccessLayer.Models.User)result;

					}
					catch (Exception ex)
					{
						_logService.Add("GenerateToken", "Step", "6: " + ex.Message);
						DataAccessLayer.Models.Message msg = new DataAccessLayer.Models.Message();
						msg = (DataAccessLayer.Models.Message)result;
						return msg;
					}

				}
				if (isAuth)
				{

					usr.email = user.email;
					usr.token_expiry = DateTime.Now.AddMinutes(Convert.ToDouble(_tokenValidityInMinutes));
					usr.user_code = UserDetail.user_code;

                }

				if (usr.email != null || isAuth)
				{
					_logService.Add("GenerateToken", "Step", "7");
					var securityKey = Encoding.UTF8.GetBytes(jwtSettings.Secret);
					DateTime _expiry = Convert.ToDateTime(usr.token_expiry);
					var claims = new Claim[] { new Claim("email", user.email), new Claim("usercode", usr.user_code.ToString()) };

					var credentials = new SigningCredentials(new SymmetricSecurityKey(securityKey), SecurityAlgorithms.HmacSha512);
					var token = new JwtSecurityToken(
						jwtSettings.Issuer,
						jwtSettings.Issuer,
						claims,
						expires: _expiry,
						signingCredentials: credentials);
					var authToken = new Models.Auth { usercode = usr.user_code, user_name = usr.user_name, email = usr.email, contact_no = usr.contact_no, user_type = usr.user_type, role_name = usr.role_name, refresh_token = isAuth ? refreshToken : _refreshToken, token = new JwtSecurityTokenHandler().WriteToken(token) };
					return authToken;
				}
				else
				{
					return null;
				}


			}
			catch (Exception ex)
			{

				_logService.Add("GenerateToken", "Step", "8:" + ex.Message);
				return null;
			}
		}

		private object CheckRefreshToken(string[] data, Refresh_Token refreshToken)
		{
			try
			{
				var _tokenValidityInMinutes = jwtSettings.TokenValidityInMinutes;
				DateTime tokenExpiry = DateTime.Now.AddMinutes(Convert.ToDouble(_tokenValidityInMinutes));

				string _email = refreshToken.Email;
				var hostDetail = (GetLocalIPAddress() as string[]);
				//var hostDetail = new string[] { "NA", "NA", "NA" };
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
			var securityKey = Encoding.UTF8.GetBytes(jwtSettings.Secret);

			return new TokenValidationParameters
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(securityKey),
				ValidIssuers = new string[] { jwtSettings.Issuer },
				ValidAudiences = new string[] { jwtSettings.Issuer },
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
            DataAccessLayer.Models.User usr = new DataAccessLayer.Models.User();
            var handler = new JwtSecurityTokenHandler();
			SecurityToken validatedToken;
			var tokenValidationParameters = GetTokenValidationParameters();
			var claims = handler.ValidateToken(refreshToken.Token, tokenValidationParameters, out validatedToken);
			var _email = claims.Claims.FirstOrDefault(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value ?? "";
			var usercode = claims.Claims.FirstOrDefault(x => x.Type == "usercode")?.Value ?? "";
			//var _data = _encryption.Decrypt(data).Split(',');

			var result = CheckRefreshToken(null, refreshToken);
			//DataAccessLayer.Models.User usr = CheckRefreshToken(null, refreshToken);
			try
			{
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
				object newAuth = GenerateToken(user, true, refreshToken.RefreshToken,usr);

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
			//var hostDetail = new string[] { "NA", "NA", "NA" };

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
			var connectionString = connectionStrings.MSSQL_CONNECTION_STRINGS.ToString();
			var conn = new SqlConnection(connectionString);
			return conn;
		}
	}
}
