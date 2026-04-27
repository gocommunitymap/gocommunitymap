using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Repositories;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Serialization.Json;
using System.Text.Json;
using System.Text;
using System.Xml.Linq;
using System.Xml;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class NavbarController : ControllerBase
    {
        private readonly INavbarRepository _navbarRepository;
        public NavbarController(INavbarRepository navbarRepository)
        {
            _navbarRepository = navbarRepository;
        }

        [HttpGet]
        //[Authorize]
        public IActionResult GetNavbar([FromQuery] Navbar navbar)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _navbarRepository.GetNavbar(navbar);

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
        public IActionResult CreateNavbar(Navbar navbar)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _navbarRepository.CreateNavbar(navbar);
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
        public IActionResult UpdateNavbar(Navbar navbar)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _navbarRepository.UpdateNavbar(navbar);
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
        //[Authorize]
        public IActionResult DeleteNavbar([Required] int NAV_ID, [Required] int USER)
        {
            Navbar navbar = new Navbar();
            navbar.NAV_ID = NAV_ID;
            navbar.USER = USER;

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _navbarRepository.DeleteNavbar(navbar);

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
