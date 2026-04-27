using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DiscoverSectionController : ControllerBase
    {
        private readonly IDiscoverSectionRepository _discoverSectionRepository;
        public DiscoverSectionController(IDiscoverSectionRepository discoverSectionRepository)
        {
            _discoverSectionRepository = discoverSectionRepository;
        }
        [HttpGet]
        //[Authorize]
        public IActionResult GetDiscoverSection([FromQuery] DiscoverSectionMaster discoverSection)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _discoverSectionRepository.GetDiscoverSection(discoverSection);

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
        public IActionResult CreateDiscoverSection(DiscoverSection discoverSection)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _discoverSectionRepository.CreateDiscoverSection(discoverSection);
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
        public IActionResult UpdateDiscoverSection(DiscoverSection discoverSection)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _discoverSectionRepository.UpdateDiscoverSection(discoverSection);
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
        public IActionResult DeleteDiscoverSection([Required] int DISCOVER_SECTION_ID, [Required] int USER)
        {
            DiscoverSection discoverSection = new DiscoverSection();
            discoverSection.DISCOVER_SECTION_ID = DISCOVER_SECTION_ID;
            discoverSection.USER = USER;
            
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _discoverSectionRepository.DeleteDiscoverSection(discoverSection);

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
