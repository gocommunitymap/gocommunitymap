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
    public class UsingPlanningController : ControllerBase
    {
        private readonly IUsingPlanningRepository _setUsingPlanning;
        public UsingPlanningController(IUsingPlanningRepository setUsingPlanning)
        {
            _setUsingPlanning = setUsingPlanning;
        }
        [HttpGet]
        //[Authorize]
        public IActionResult GetUsingPlanning([FromQuery] UsingPlanning usingPlanning)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUsingPlanning.GetUsingPlanning(usingPlanning);

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
        public IActionResult CreateUsingPlanning(UsingPlanning usingPlanning)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUsingPlanning.CreateUsingPlanning(usingPlanning);
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
        public IActionResult UpdateUsingPlanning(UsingPlanning usingPlanning)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUsingPlanning.UpdateUsingPlanning(usingPlanning);
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
        public IActionResult DeleteUsingPlanning([Required] int UAP_ID, [Required] int USER)
        {
            BusinessLogicLayer.Models.UsingPlanning usingPlanning = new BusinessLogicLayer.Models.UsingPlanning();
            usingPlanning.UAP_ID = UAP_ID;
            usingPlanning.USER = USER;


            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _setUsingPlanning.DeleteUsingPlanning(usingPlanning);

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
