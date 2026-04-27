using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using BusinessLogicLayer;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Interfaces;
using Azure.Core;
using System.Net.Sockets;
using System.Net;
using System.Net.NetworkInformation;
using System.Text.Json.Serialization;

namespace PresentationLayer.Controllers
{
    [ApiController]
    [Route("auth/[action]")]
    //[EnableCors("cors_policy")]
    public class AuthController : ControllerBase
    {

        private readonly IAuth _authRepo;
        private readonly IConfiguration _configuration;


        public AuthController(IAuth authRepo, IConfiguration configuration)
        {
            _authRepo = authRepo;
            _configuration = configuration;
        }


        public static string GetLocalIPAddress()
        {
            int index = -1;
            if (NetworkInterface.GetIsNetworkAvailable())
            {
                var host = Dns.GetHostEntry(Dns.GetHostName());
                var a = "";
                a += "[";
                if (index > -1)
                {
                    a += "{\"address" + index.ToString() + "\":";
                    a += "\"" + host.AddressList[index] + "\"";
                    a += "},";
                }
                else
                {
                    for (int i = 0; i < host.AddressList.Length; i++)
                    {
                        a += "{\"address" + i.ToString() + "\":";
                        a += "\"" + host.AddressList[i] + "\"";
                        a += "},";
                    }
                }

                foreach (var ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork)
                    {
                        ip.ToString();
                    }
                }
                a = a.Substring(0, a.Length - 1) + "]";
                return a;
                throw new Exception("No network adapters with an IPv4 address in the system!");
            }
            else
            {
                return "No network available!";
            }

        }


        [HttpPost]
        public object GenerateToken(Login user)
        {
                var result = _authRepo.GenerateToken(user);
            try
            {

                if (result != null && ((Auth)result).email != null)
                {
                    if (result == null)
                    {
                        return Unauthorized("{CODE:0,ERROR: \"No Data Found\" }");
                    }
                    return Ok(result);
                }
                else
                {
                    return Unauthorized();
                }

            }
            catch (Exception ex)
            {
                if (((DataAccessLayer.Models.Message)result).ERROR != null)
                {
                    return BadRequest((DataAccessLayer.Models.Message)result);
                }
                return Unauthorized(ex.Message);
            }

        }

        [HttpPost]
        public object AuthenticateValidToken(Refresh_Token refresh_token)
        {

            var result = _authRepo.AuthenticateValidToken(refresh_token);
            if (result == null)
            {
                return Unauthorized();
            }
            return Ok(result);
        }
        [HttpPost]
        public object TokenRevoke(Refresh_Token data)
        {

            var result = _authRepo.TokenRevoke(data);
            if (result == null)
            {
                return Unauthorized();
            }
            return Ok(result);
        }
        //[HttpPost]
        //public object RefreshToken(string email, string refreshToken)
        //{
        //    var result = _authRepo.RefreshToken(email, refreshToken);
        //    return result;
        //}
    }
}
