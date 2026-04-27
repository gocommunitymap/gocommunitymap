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
    public class RoomsController : ControllerBase
    {
        private readonly ISetRoomsRepository _rooms;
        public RoomsController(ISetRoomsRepository rooms)
        {
            _rooms = rooms;
        }
        [HttpGet]
        public IActionResult GetRooms([FromQuery] SetRooms setProperties)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _rooms.GetRooms(setProperties);

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
        public IActionResult CreateRoom(SetRooms setProperties)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _rooms.CreateRoom(setProperties);
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
        public IActionResult UpdateRoom(SetRooms setProperties)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _rooms.UpdateRoom(setProperties);
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
        public IActionResult DeleteRoom([Required] int ROOM_ID, [Required] int USER)
        {
            SetRooms setProperties = new SetRooms();
            setProperties.ROOM_ID = ROOM_ID;
            setProperties.USER = USER;
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _rooms.DeleteRoom(setProperties);

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
