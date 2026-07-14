using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class SetUsersController : ControllerBase
    {
        private readonly ISetUsersRepository _setUser;
        public SetUsersController(ISetUsersRepository setUser)
        {
            _setUser = setUser;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetUsers([FromQuery] SetUsers users)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUser.GetUsers(users);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet]
        [Authorize]
        public IActionResult GetAgentUsers([FromQuery] SetUsers users)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUser.GetAgentUsers(users);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        [EnableRateLimiting("auth")]
        public IActionResult RegisterUser(SetUsers users)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                // USER_TYPE 4 = public registrant — enforced at API level, not accepted from client.
                users.USER_TYPE = 4;

                var result = _setUser.CreateUsers(users);
                if (result == null)
                    return BadRequest("Request Failed!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateUsers(SetUsers users)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUser.CreateUsers(users);
                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Authorize]
        public IActionResult UpdateUsers(SetUsers users)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUser.UpdateUsers(users);
                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete]
        [Authorize]
        public IActionResult DeleteUsers([Required] int USER_CODE, [Required] int USER)
        {
            SetUsers users = new SetUsers();
            users.USER_CODE = USER_CODE;
            users.USER = USER;

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUser.DeleteUsers(users);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPost]
        [Authorize]
        public IActionResult ChangePassword(ChangePassword changePassword)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUser.ChangePassword(changePassword);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }

    }
}
