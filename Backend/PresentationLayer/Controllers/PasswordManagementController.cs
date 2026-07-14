using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [ApiController]
    [EnableRateLimiting("auth")]
    public class PasswordManagementController : ControllerBase
    {
        private readonly IPasswordManagementRepository _passwordManagementRepository;
        //injecting the IMailService into the constructor
        public PasswordManagementController(IPasswordManagementRepository passwordManagementRepository)
        {
            _passwordManagementRepository = passwordManagementRepository;
        }

        [HttpPost]
        [Route("ForgotPassword")]
        public object ForgotPassword([Required] string email)
        {
            try
            {
                return Ok(_passwordManagementRepository.ForgotPassword(email));

            }
            catch (Exception ex)
            {

                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpPost]
        [Route("ResetPassword")]
        public object ResetPassword([Required] string key, [Required] string password)
        {
            try
            {
                return Ok(_passwordManagementRepository.ResetPassword(key,password));
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet]
        [Route("GetResetRequest")]
        public object GetResetRequest([Required] string key)
        {
            try
            {
                return Ok(_passwordManagementRepository.GetResetRequest(key));

            }
            catch (Exception ex)
            {

                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
