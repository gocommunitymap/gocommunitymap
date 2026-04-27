using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class FeaturesController : ControllerBase
    {
        private readonly IFeaturesRepository _setFeatures;
        public FeaturesController(IFeaturesRepository setFeatures)
        {
            _setFeatures = setFeatures;
        }
        [HttpGet]
        //[Authorize]
        public IActionResult GetFeatures([FromQuery] Features features)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setFeatures.GetFeatures(features);

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
        public IActionResult CreateFeatures(Features features)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setFeatures.CreateFeatures(features);
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
        public IActionResult UpdateFeatures(Features features)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setFeatures.UpdateFeatures(features);
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
        public IActionResult DeleteFeatures([Required]int FEATURES_ID,[Required] int USER)
        {
            BusinessLogicLayer.Models.Features features = new BusinessLogicLayer.Models.Features();
            features.FEATURES_ID = FEATURES_ID;
            features.USER = USER;
            

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setFeatures.DeleteFeatures(features);

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
