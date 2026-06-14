using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class BookingCalendarController : ControllerBase
    {
        private readonly IBookingCalendarRepository _bookingCalendarRepository;
        public BookingCalendarController(IBookingCalendarRepository bookingCalendarRepository)
        {
            _bookingCalendarRepository = bookingCalendarRepository;
        }
        
        [HttpGet]
        public IActionResult GetHotelBookingCalendar([FromQuery] BookingCalendar bookingCalendar)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookingCalendarRepository.GetHotelBookingCalendar(bookingCalendar);

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
        public IActionResult GetRentalBookingCalendar([FromQuery] BookingCalendar bookingCalendar)
            {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _bookingCalendarRepository.GetRentalBookingCalendar(bookingCalendar);

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
