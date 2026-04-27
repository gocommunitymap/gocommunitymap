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
    public class SavedLinksController : ControllerBase
    {
        private readonly ISavedLinksRepository _savedLinks;
        public SavedLinksController(ISavedLinksRepository savedLinks)
        {
            _savedLinks = savedLinks;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetSavedLinks([FromQuery] SavedLinks savedLinks)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _savedLinks.GetSavedLinks(savedLinks);

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
        public IActionResult PostSavedLinks(SavedLinks savedLinks)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _savedLinks.PostSavedLinks(savedLinks);
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
        public IActionResult DeleteSavedLinks([Required] int LINK_ID, [Required] int USER)
        {
            SavedLinks savedLinks = new SavedLinks();
            savedLinks.LINK_ID = LINK_ID;
            savedLinks.USER = USER;

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _savedLinks.DeleteSavedLinks(savedLinks);

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
