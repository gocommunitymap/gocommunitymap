using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class HotelBookingsController : ControllerBase
    {
        private readonly IHotelBookingsRepository _bookings;

        public HotelBookingsController(IHotelBookingsRepository bookings)
        {
            _bookings = bookings;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetBookings([FromQuery] HotelBooking booking)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookings.GetBookings(booking);

                if (result == null)
                    return BadRequest("Request Failed!");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpGet]
        public IActionResult GetBookingStatus([Required] string BOOKING_NO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookings.GetBookingStatus(BOOKING_NO);

                if (result == null)
                    return BadRequest("Request Failed!");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public IActionResult CreateBooking([FromBody] HotelBooking booking)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookings.CreateBooking(booking);

                if (result == null)
                    return BadRequest("Request Failed!");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public IActionResult UpdateBooking([FromBody] HotelBooking booking)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookings.UpdateBooking(booking);

                if (result == null)
                    return BadRequest("Request Failed!");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        public IActionResult DeleteBooking([Required] int BOOKING_ID, [Required] int USER)
        {
            HotelBooking booking = new HotelBooking
            {
                BOOKING_ID = BOOKING_ID,
                USER = USER
            };

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookings.DeleteBooking(booking);

                if (result == null)
                    return BadRequest("Request Failed!");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
