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
    public class CustomFeaturesController : ControllerBase
    {
        private readonly ICustomFeaturesRepository _customFeatures;
        public CustomFeaturesController(ICustomFeaturesRepository customFeatures)
        {
            _customFeatures = customFeatures;
        }
        [HttpGet]
        [Authorize]
        public IActionResult GetCustomFeatures([FromQuery] CustomFeatures customFeatures)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _customFeatures.getCustomFeatures(customFeatures);

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
        public IActionResult CreateCustomFeatures(CustomFeatures customFeatures)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _customFeatures.createCustomFeatures(customFeatures);

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
        public IActionResult UpdateCustomFeatures(CustomFeatures customFeatures)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _customFeatures.updateCustomFeatures(customFeatures);

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
        [HttpDelete]
        [Authorize]
        public IActionResult DeleteCustomFeatures([Required] int CUSTOM_FEATURES_ID, [Required] int PROPERTY_ID,[Required] int USER)
        {
            CustomFeatures customFeatures = new CustomFeatures();

            customFeatures.CUSTOM_FEATURES_ID = CUSTOM_FEATURES_ID;
            customFeatures.PROPERTY_ID = PROPERTY_ID;
            customFeatures.USER = USER;
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _customFeatures.deleteCustomFeatures(customFeatures);

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
