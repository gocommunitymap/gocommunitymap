using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class HotelBookingsRepository : IHotelBookingsRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public HotelBookingsRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }

        // NOTE: Add SP_HOTEL_BOOKINGS to the Procedures enum in DatabaseObjects.cs

        public object GetBookings(HotelBooking booking)
        {
            try
            {
                string sp_name = Procedures.SP_HOTEL_BOOKINGS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("BOOKING_ID", DbType.Int32, ParameterDirection.Input, booking.BOOKING_ID);
                dyParam.AddDynamicParams("BOOKING_NO", DbType.String, ParameterDirection.Input, booking.BOOKING_NO);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, booking.PROPERTY_ID);
                dyParam.AddDynamicParams("PROPERTY_NAME", DbType.String, ParameterDirection.Input, booking.PROPERTY_NAME);
                dyParam.AddDynamicParams("CHECK_IN", DbType.Date, ParameterDirection.Input, booking.CHECK_IN);
                dyParam.AddDynamicParams("CHECK_OUT", DbType.Date, ParameterDirection.Input, booking.CHECK_OUT);
                dyParam.AddDynamicParams("NIGHTS", DbType.Int32, ParameterDirection.Input, booking.NIGHTS);
                dyParam.AddDynamicParams("ADULTS", DbType.Int32, ParameterDirection.Input, booking.ADULTS);
                dyParam.AddDynamicParams("CHILDREN", DbType.Int32, ParameterDirection.Input, booking.CHILDREN);
                dyParam.AddDynamicParams("ROOMS", DbType.Int32, ParameterDirection.Input, booking.ROOMS);
                dyParam.AddDynamicParams("SUBTOTAL", DbType.Decimal, ParameterDirection.Input, booking.SUBTOTAL);
                dyParam.AddDynamicParams("SERVICE_FEE", DbType.Decimal, ParameterDirection.Input, booking.SERVICE_FEE);
                dyParam.AddDynamicParams("TOTAL", DbType.Decimal, ParameterDirection.Input, booking.TOTAL);
                dyParam.AddDynamicParams("GUEST_FIRST_NAME", DbType.String, ParameterDirection.Input, booking.GUEST_FIRST_NAME);
                dyParam.AddDynamicParams("GUEST_LAST_NAME", DbType.String, ParameterDirection.Input, booking.GUEST_LAST_NAME);
                dyParam.AddDynamicParams("GUEST_EMAIL", DbType.String, ParameterDirection.Input, booking.GUEST_EMAIL);
                dyParam.AddDynamicParams("GUEST_COUNTRY", DbType.String, ParameterDirection.Input, booking.GUEST_COUNTRY);
                dyParam.AddDynamicParams("GUEST_PHONE", DbType.String, ParameterDirection.Input, booking.GUEST_PHONE);
                dyParam.AddDynamicParams("ARRIVAL_TIME", DbType.String, ParameterDirection.Input, booking.ARRIVAL_TIME);
                dyParam.AddDynamicParams("PAYMENT_METHOD", DbType.String, ParameterDirection.Input, booking.PAYMENT_METHOD);
                dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, booking.PAYMENT_INTENT_ID);
                dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, booking.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, booking.USER);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, booking.ACTIVE);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object GetBookingStatus(string BOOKING_NO)
        {
            try
            {
                string sp_name = Procedures.SP_HOTEL_BOOKINGS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("BOOKING_NO", DbType.String, ParameterDirection.Input, BOOKING_NO);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH2.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public object CreateBooking(HotelBooking booking)
        {
            try
            {
                string sp_name = Procedures.SP_HOTEL_BOOKINGS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("BOOKING_ID", DbType.Int32, ParameterDirection.Input, booking.BOOKING_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, booking.PROPERTY_ID);
                dyParam.AddDynamicParams("PROPERTY_NAME", DbType.String, ParameterDirection.Input, booking.PROPERTY_NAME);
                dyParam.AddDynamicParams("CHECK_IN", DbType.Date, ParameterDirection.Input, booking.CHECK_IN);
                dyParam.AddDynamicParams("CHECK_OUT", DbType.Date, ParameterDirection.Input, booking.CHECK_OUT);
                dyParam.AddDynamicParams("NIGHTS", DbType.Int32, ParameterDirection.Input, booking.NIGHTS);
                dyParam.AddDynamicParams("ADULTS", DbType.Int32, ParameterDirection.Input, booking.ADULTS);
                dyParam.AddDynamicParams("CHILDREN", DbType.Int32, ParameterDirection.Input, booking.CHILDREN);
                dyParam.AddDynamicParams("ROOMS", DbType.Int32, ParameterDirection.Input, booking.ROOMS);
                dyParam.AddDynamicParams("SUBTOTAL", DbType.Decimal, ParameterDirection.Input, booking.SUBTOTAL);
                dyParam.AddDynamicParams("SERVICE_FEE", DbType.Decimal, ParameterDirection.Input, booking.SERVICE_FEE);
                dyParam.AddDynamicParams("TOTAL", DbType.Decimal, ParameterDirection.Input, booking.TOTAL);
                dyParam.AddDynamicParams("GUEST_FIRST_NAME", DbType.String, ParameterDirection.Input, booking.GUEST_FIRST_NAME);
                dyParam.AddDynamicParams("GUEST_LAST_NAME", DbType.String, ParameterDirection.Input, booking.GUEST_LAST_NAME);
                dyParam.AddDynamicParams("GUEST_EMAIL", DbType.String, ParameterDirection.Input, booking.GUEST_EMAIL);
                dyParam.AddDynamicParams("GUEST_COUNTRY", DbType.String, ParameterDirection.Input, booking.GUEST_COUNTRY);
                dyParam.AddDynamicParams("GUEST_PHONE", DbType.String, ParameterDirection.Input, booking.GUEST_PHONE);
                dyParam.AddDynamicParams("ARRIVAL_TIME", DbType.String, ParameterDirection.Input, booking.ARRIVAL_TIME);
                dyParam.AddDynamicParams("PAYMENT_METHOD", DbType.String, ParameterDirection.Input, booking.PAYMENT_METHOD);
                dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, booking.PAYMENT_INTENT_ID);
                dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, booking.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, booking.USER);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, booking.ACTIVE);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public object UpdateBooking(HotelBooking booking)
        {
            try
            {
                string sp_name = Procedures.SP_HOTEL_BOOKINGS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("BOOKING_ID", DbType.Int32, ParameterDirection.Input, booking.BOOKING_ID);
                dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, booking.STATUS);
                dyParam.AddDynamicParams("ARRIVAL_TIME", DbType.String, ParameterDirection.Input, booking.ARRIVAL_TIME);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, booking.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, booking.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public object DeleteBooking(HotelBooking booking)
        {
            try
            {
                string sp_name = Procedures.SP_HOTEL_BOOKINGS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("BOOKING_ID", DbType.Int32, ParameterDirection.Input, booking.BOOKING_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, booking.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.DELETE.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }

}
