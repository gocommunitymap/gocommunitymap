using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UtilitiesController : ControllerBase
    {
        private readonly IUtilitiesRepository _setUtilities;
        public UtilitiesController(IUtilitiesRepository setUtilities)
        {
            _setUtilities = setUtilities;
        }
        [HttpGet]
        //[Authorize]
        public IActionResult GetUtilities([FromQuery] Utilities utilities)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUtilities.GetUtilities(utilities);

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
        public IActionResult CreateUtilities(Utilities utilities)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUtilities.CreateUtilities(utilities);
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
        public IActionResult UpdateUtilities(Utilities utilities)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUtilities.UpdateUtilities(utilities);
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
        public IActionResult DeleteUtilities([Required] int UTILITY_ID, [Required] int USER)
        {
            BusinessLogicLayer.Models.Utilities utilities = new BusinessLogicLayer.Models.Utilities();
            utilities.UTILITY_ID = UTILITY_ID;
            utilities.USER = USER;


            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUtilities.DeleteUtilities(utilities);

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
