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
    public class GlobalParametersController : ControllerBase
    {
        private readonly IGlobalParametersRepository _globalParameters;
        public GlobalParametersController(IGlobalParametersRepository globalParameters)
        {
            _globalParameters = globalParameters;
        }
        [HttpGet]
        //[Authorize]
        public IActionResult GetGlobalParameters([FromQuery] GlobalParameters globalParameters)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _globalParameters.getGlobalParameters(globalParameters);

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
        //[Authorize]
        public IActionResult GetGlobalParametersByTypeCodes([Required] String? TYPE_CODES)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _globalParameters.GetGlobalParametersByTypeCodes(TYPE_CODES);

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
        public IActionResult CreateGlobalParameters(GlobalParameters globalParameters)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _globalParameters.createGlobalParameters(globalParameters);

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
        public IActionResult UpdateGlobalParameters(GlobalParameters globalParameters)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _globalParameters.updateGlobalParameters(globalParameters);

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
        public IActionResult DeleteGlobalParameters([Required] int ID, [Required] string TYPE_CODE, [Required]int USER)
        {
            GlobalParameters globalParameters = new GlobalParameters();

            globalParameters.ID = ID;
            globalParameters.TYPE_CODE = TYPE_CODE;
            globalParameters.USER = USER;
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _globalParameters.deleteGlobalParameters(globalParameters);

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
