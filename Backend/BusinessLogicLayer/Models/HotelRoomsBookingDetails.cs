using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class HotelRoomsBookingDetails
    {
        public long ID { get; set; }
        public int BOOKING_ID { get; set; }
        public int ROOM_ID { get; set; }
        public int PROPERTY_ID { get; set; }
        public int? PROPERTY_TYPE_ID { get; set; }
        public int? BED_TYPE { get; set; }
        public int? MAX_GUESTS { get; set; }
        public decimal? PRICE { get; set; }
        public string? VIDEO_VIRTUALS_LINK { get; set; }
        public int? BATHROOMS_ID { get; set; }
        public int? ROOMS_QUANTITY { get; set; }
        public string? SIZE { get; set; }
        public int? UNITS_ID { get; set; }
        public string? SUMMARY { get; set; }
        public string? FULLDESCRIPTION { get; set; }
        public int? MEAL_PLAN { get; set; }
        public int? CANCELLATION_POLICY { get; set; }
        public bool? PETS_ALLOWED { get; set; }
        public string? LATITUDE { get; set; }
        public string? LONGITUDE { get; set; }
        public string? PLACE { get; set; }
        public string? MAP_URL { get; set; }
        public bool? NEW_BUILD { get; set; }
        public int? COUNCIL_TAX_BAND_ID { get; set; }
        public bool? ISEXEMPT { get; set; }
        public int? FEE_APPLY_ID { get; set; }
        public int? FURNISHED_ID { get; set; }
        public int? FLOORS_ID { get; set; }
        public DateTime? AVAILABLE_FROM { get; set; }
        public decimal? STAR_RATING { get; set; }
        public int? CHECK_IN_TIME { get; set; }
        public int? CHECK_OUT_TIME { get; set; }
        public string? IMPORTANT_INFO { get; set; }
    }
    public class RoomDetailItem
    {
        public int ROOM_ID { get; set; }
        public string ROOM_TYPE { get; set; }
        public string SUMMARY { get; set; }
        public decimal PRICE { get; set; }
        public int QUANTITY { get; set; }
        public int MAX_GUESTS { get; set; }
        public int MEAL_PLAN { get; set; }
        public int CANCELLATION_POLICY { get; set; }
    }
}
