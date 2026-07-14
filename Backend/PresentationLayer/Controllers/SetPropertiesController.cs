using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class SetPropertiesController : ControllerBase
    {
        private readonly ISetPropertiesRepository _property;
        public SetPropertiesController(ISetPropertiesRepository property)
        {
            _property = property;
        }
        [HttpGet]
        public IActionResult GetProperty([FromQuery] SetProperties setProperties)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _property.GetProperty(setProperties);

                if (result == null)
                    return BadRequest("Request Faild!");

                if (setProperties.PROPERTY_ID.HasValue)
                {
                    var rows = ((IEnumerable<dynamic>)result).Cast<IDictionary<string, object>>().ToList();

                    if (rows.Count == 0)
                        return NotFound();

                    if (rows[0].TryGetValue("DELETED_ON", out var deletedOn) && deletedOn != null)
                        return StatusCode(410);
                }

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
        public IActionResult GetPropertySetupList(int LISTING_TYPE_ID, int PAGE_NUMBER, int PAGE_SIZE)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _property.GetPropertySetupList(LISTING_TYPE_ID, PAGE_NUMBER, PAGE_SIZE);

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
        public IActionResult CreateProperty(SetProperties setProperties)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _property.CreateProperty(setProperties);
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
        public IActionResult UpdateProperty(SetProperties setProperties)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _property.UpdateProperty(setProperties);
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
        public IActionResult DeleteProperty([Required] int PROPERTY_ID,[Required] int USER)
        {
            SetProperties setProperties = new SetProperties();
            setProperties.PROPERTY_ID = PROPERTY_ID;
            setProperties.USER = USER;
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _property.DeleteProperty(setProperties);

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
