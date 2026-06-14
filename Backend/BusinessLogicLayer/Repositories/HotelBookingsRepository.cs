using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using DataAccessLayer.Models;
using Newtonsoft.Json;
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
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        private readonly ILogService _logService;
        private readonly IMailRepository _mailRepository;
        private readonly MailSettings mailSettings;
        private readonly EmailTemplate emailTemplate;
        private readonly IEmailTemplateSettingsRepository _emailTemplateSettings;
        public static string? selectedDatabase = "";

        public HotelBookingsRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService, ILogService logService, IMailRepository mailRepository, IEmailTemplateSettingsRepository emailTemplateSettings)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            _mailRepository = mailRepository;
            _logService = logService;
            _emailTemplateSettings = emailTemplateSettings;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
            mailSettings = appSettingsService.GetMailSettings();
            emailTemplate = appSettingsService.GetEmailTemplate();
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
                dyParam.AddDynamicParams("ROOM_IDS", DbType.String, ParameterDirection.Input, booking.ROOM_IDS);
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
                dyParam.AddDynamicParams("BOOKING_FOR", DbType.String, ParameterDirection.Input, booking.BOOKING_FOR);
                dyParam.AddDynamicParams("TRAVEL_FOR_WORK", DbType.String, ParameterDirection.Input, booking.TRAVEL_FOR_WORK);
                dyParam.AddDynamicParams("SPECIAL_REQUESTS", DbType.String, ParameterDirection.Input, booking.SPECIAL_REQUESTS);
                dyParam.AddDynamicParams("AGREE_TERMS", DbType.String, ParameterDirection.Input, booking.AGREE_TERMS);
                dyParam.AddDynamicParams("MARKETING_CONSENT", DbType.String, ParameterDirection.Input, booking.MARKETING_CONSENT);
                dyParam.AddDynamicParams("PAYMENT_METHOD", DbType.String, ParameterDirection.Input, booking.PAYMENT_METHOD);
                dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, booking.PAYMENT_INTENT_ID);
                dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, booking.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
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
                dyParam.AddDynamicParams("ROOM_IDS", DbType.String, ParameterDirection.Input, booking.ROOM_IDS);
                dyParam.AddDynamicParams("ROOM_DETAILS", DbType.String, ParameterDirection.Input, booking.ROOM_DETAILS);
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
                dyParam.AddDynamicParams("BOOKING_FOR", DbType.String, ParameterDirection.Input, booking.BOOKING_FOR);
                dyParam.AddDynamicParams("TRAVEL_FOR_WORK", DbType.String, ParameterDirection.Input, booking.TRAVEL_FOR_WORK);
                dyParam.AddDynamicParams("SPECIAL_REQUESTS", DbType.String, ParameterDirection.Input, booking.SPECIAL_REQUESTS);
                dyParam.AddDynamicParams("AGREE_TERMS", DbType.String, ParameterDirection.Input, booking.AGREE_TERMS);
                dyParam.AddDynamicParams("MARKETING_CONSENT", DbType.String, ParameterDirection.Input, booking.MARKETING_CONSENT);
                dyParam.AddDynamicParams("PAYMENT_METHOD", DbType.String, ParameterDirection.Input, booking.PAYMENT_METHOD);
                dyParam.AddDynamicParams("PAYMENT_INTENT_ID", DbType.String, ParameterDirection.Input, booking.PAYMENT_INTENT_ID);
                dyParam.AddDynamicParams("STATUS", DbType.String, ParameterDirection.Input, booking.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, booking.ACTIVE);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                //var response = _db.ExecuteProc(sp_name, dyParam);
                //var result = JsonConvert.DeserializeObject<DbResponse>(response.ToString());

                var response = _db.ExecuteProc(sp_name, dyParam);
                var rows = response as IEnumerable<dynamic>;
                var row = rows?.FirstOrDefault();

                DbResponse result = new DbResponse();

                if (row != null && row.STATUS == 200)
                {
                    result.MESSAGE = row.MESSAGE;
                    result.CODE = Convert.ToInt32(row.CODE);
                    result.STATUS = Convert.ToInt32(row.STATUS);
                    result.DETAIL = row.DETAIL;
                    result.ADDITIONAL_DETAILS = row.ADDITIONAL_DETAILS;
                }
                else
                {
                    result.MESSAGE = row?.MESSAGE ?? "Invalid Request";
                    result.CODE = row?.CODE ?? -1;
                    result.STATUS = 400;
                    throw new Exception(JsonConvert.SerializeObject(result));
                }

                if (mailSettings.Disabled == "N" && result != null && result.STATUS == 200)
                {
                    try
                    {
                        String emailBody = "";
                        string templateName = booking.LISTING_TYPE_ID == 2 ? "rental-booking" : "hotel-booking";
                        EmailTemplateSettings _emailTemplate = _emailTemplateSettings.GetEmailTemplateSettings(templateName);

                        // Parse ADDITIONAL_DETAILS from result
                        var additionalDetailsList = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(result.ADDITIONAL_DETAILS);
                        var additionalDetails = additionalDetailsList != null && additionalDetailsList.Count > 0
                            ? additionalDetailsList[0]
                            : default;

                        string issuanceDate = additionalDetails.TryGetProperty("ISSUANCE_DATE", out var iDate) ? iDate.GetString() ?? "" : "";
                        string bookingDate = additionalDetails.TryGetProperty("BOOKING_DATE", out var bDate) ? bDate.GetString() ?? "" : "";
                        string place = additionalDetails.TryGetProperty("PLACE", out var pl) ? pl.GetString() ?? "" : "";

                        string scanUrl = _emailTemplate.ADDITIONAL_VALUE_1 + result.DETAIL;

                        using (StreamReader SourceReader = System.IO.File.OpenText(_emailTemplate.TEMPLATE_PATH))
                        {
                            emailBody = SourceReader.ReadToEnd()
                                .Replace("[booking_no]", result.DETAIL)
                                .Replace("[status]", booking.STATUS)
                                .Replace("[issue_date]", issuanceDate)
                                .Replace("[booking_date]", bookingDate)
                                .Replace("[payment_method]", booking.PAYMENT_METHOD)
                                .Replace("[guest_name]", booking.GUEST_FIRST_NAME + " " + booking.GUEST_LAST_NAME)
                                .Replace("[guest_email]", booking.GUEST_EMAIL)
                                .Replace("[guest_phone]", booking.GUEST_PHONE)
                                .Replace("[guest_country]", booking.GUEST_COUNTRY)
                                .Replace("[property_name]", booking.PROPERTY_NAME)
                                .Replace("[place]", place)
                                .Replace("[check_in]", booking.CHECK_IN?.ToString("dd-MMM-yyyy") ?? "")
                                .Replace("[check_out]", booking.CHECK_OUT?.ToString("dd-MMM-yyyy") ?? "")
                                .Replace("[check_in_time]", booking.CHECK_IN_TIMESLOT_DESC ?? "")
                                .Replace("[check_out_time]", booking.CHECK_OUT_TIMESLOT_DESC ?? "")
                                .Replace("[adults]", booking.ADULTS.ToString())
                                .Replace("[children]", booking.CHILDREN.ToString())
                                .Replace("[arrival_time]", booking.ARRIVAL_TIME)
                                .Replace("[room_subtotal]", booking.SUBTOTAL.ToString())
                                .Replace("[service_fee]", booking.SERVICE_FEE.ToString())
                                .Replace("[total]", booking.TOTAL.ToString())
                                .Replace("[scan_url]", scanUrl)
                                .Replace("[name]", booking.GUEST_FIRST_NAME + " " + booking.GUEST_LAST_NAME)
                                .Replace("[app-name]", mailSettings.AppName)
                                .Replace("[sender_name]", mailSettings.SenderName);
                        }

                        //-------------------------------------------//
                        if(booking.LISTING_TYPE_ID == 1) { 
                        var roomDetailItems = System.Text.Json.JsonSerializer.Deserialize<List<RoomDetailItem>>(booking.ROOM_DETAILS);
                        var trMatch = System.Text.RegularExpressions.Regex.Match(
                            emailBody,
                            @"<tr id=""?\[room_details_rows\]""?>(.*?)</tr>",
                            System.Text.RegularExpressions.RegexOptions.Singleline);

                        string rowTemplate = trMatch.Value;
                        var roomRowsHtml = new System.Text.StringBuilder();

                        for (int i = 0; i < roomDetailItems.Count; i++)
                        {
                            var room = roomDetailItems[i];
                            decimal subtotal = room.PRICE * room.QUANTITY;

                            string _row = rowTemplate
                                .Replace(@"id=""[room_details_rows]""", "")
                                .Replace("[room_index]", (i + 1).ToString())
                                .Replace("[room_name]", room.ROOM_TYPE)
                                .Replace("[rate_per_night]", room.PRICE.ToString("F2"))
                                .Replace("[rooms]", room.QUANTITY.ToString())
                                .Replace("[nights]", booking.NIGHTS.ToString())
                                .Replace("[subtotal]", subtotal.ToString("F2"))
                                .Replace("[check_in]", booking.CHECK_IN?.ToString("dd-MMM-yyyy") ?? "")
                                .Replace("[check_out]", booking.CHECK_OUT?.ToString("dd-MMM-yyyy") ?? "")
                                ;

                            roomRowsHtml.Append(_row);
                        }

                        emailBody = emailBody.Replace(rowTemplate, roomRowsHtml.ToString());
                        }
                        if (booking.LISTING_TYPE_ID == 2)
                        {
                            emailBody = emailBody
                                .Replace("[rate_per_night]", booking.PRICE?.ToString("F2") ?? "")
                                .Replace("[nights]", booking.NIGHTS.ToString())
                                .Replace("[subtotal]", booking.SUBTOTAL?.ToString("F2") ?? "");
                        }
                        //-------------------------------------------//

                        MailRequest mailRequest = new MailRequest()
                        {
                            ToEmail = booking.GUEST_EMAIL,
                            ToName = booking.GUEST_FIRST_NAME + " " + booking.GUEST_LAST_NAME,
                            Body = emailBody,
                            Subject = _emailTemplate.EMAIL_SUBJECT
                        };

                        _mailRepository.SendEmail(mailRequest);
                    }
                    catch (Exception ex)
                    {
                        _logService.Add("Password Reset", "Send Email", ex.Message);
                        return false;
                    }
                }
                return response;
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
                dyParam.AddDynamicParams("BOOKING_FOR", DbType.String, ParameterDirection.Input, booking.BOOKING_FOR);
                dyParam.AddDynamicParams("TRAVEL_FOR_WORK", DbType.String, ParameterDirection.Input, booking.TRAVEL_FOR_WORK);
                dyParam.AddDynamicParams("SPECIAL_REQUESTS", DbType.String, ParameterDirection.Input, booking.SPECIAL_REQUESTS);
                dyParam.AddDynamicParams("AGREE_TERMS", DbType.String, ParameterDirection.Input, booking.AGREE_TERMS);
                dyParam.AddDynamicParams("MARKETING_CONSENT", DbType.String, ParameterDirection.Input, booking.MARKETING_CONSENT);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, booking.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
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
