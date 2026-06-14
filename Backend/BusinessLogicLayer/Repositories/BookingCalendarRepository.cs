using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class BookingCalendarRepository : IBookingCalendarRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";

        public BookingCalendarRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }

        public object GetHotelBookingCalendar(BookingCalendar bookingCalendar)
        {
            try
            {
                string sp_name = Procedures.SP_BOOKING_CALENDAR.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("CHECK_IN", DbType.Date, ParameterDirection.Input, bookingCalendar.CHECK_IN);
                dyParam.AddDynamicParams("CHECK_OUT", DbType.Date, ParameterDirection.Input, bookingCalendar.CHECK_OUT);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, bookingCalendar.PROPERTY_ID);
                dyParam.AddDynamicParams("ROOM_ID", DbType.Int32, ParameterDirection.Input, bookingCalendar.ROOM_ID);

                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public object GetRentalBookingCalendar(BookingCalendar bookingCalendar)
        {
            try
            {
                string sp_name = Procedures.SP_BOOKING_CALENDAR.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("CHECK_IN", DbType.Date, ParameterDirection.Input, bookingCalendar.CHECK_IN);
                dyParam.AddDynamicParams("CHECK_OUT", DbType.Date, ParameterDirection.Input, bookingCalendar.CHECK_OUT);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, bookingCalendar.PROPERTY_ID);
                dyParam.AddDynamicParams("ROOM_ID", DbType.Int32, ParameterDirection.Input, null);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH2.ToString());

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
