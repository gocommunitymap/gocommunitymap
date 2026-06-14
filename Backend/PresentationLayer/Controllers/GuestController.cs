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
    public class GuestController : ControllerBase
    {
        private readonly IGuestRepository _guest;
        public GuestController(IGuestRepository guest)
        {
            _guest = guest;
        }
        [HttpGet]
        public IActionResult GetProperties([FromQuery] GetPropertiesFilters getProperties, int PAGE_NUMBER, int PAGE_SIZE)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _guest.GetProperties(getProperties, PAGE_NUMBER, PAGE_SIZE);

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
        public IActionResult GetPropertiesForMap([FromQuery] GetPropertiesFiltersForMap getProperties)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _guest.GetPropertiesForMap(getProperties);

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
        public IActionResult GetPropertiesFullDetails([FromQuery] GetProperties getProperties, int PAGE_NUMBER,int PAGE_SIZE)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _guest.GetPropertiesFullDetails(getProperties, PAGE_NUMBER, PAGE_SIZE);

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
        public IActionResult GetPropertiesByUser([FromQuery] GetProperties getProperties)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _guest.GetPropertiesByUser(getProperties);

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
        public IActionResult GetPlacesByPostCode([Required] string FULLPOSTCODE)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");
                var result = _guest.GetPlacesByPostCode(FULLPOSTCODE);

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
