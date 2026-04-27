using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IHotelBookingsRepository
    {
        public object GetBookings(HotelBooking booking);
        public object GetBookingStatus(string BOOKING_NO);
        public object CreateBooking(HotelBooking booking);
        public object UpdateBooking(HotelBooking booking);
        public object DeleteBooking(HotelBooking booking);
    }
}
