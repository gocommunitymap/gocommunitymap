using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class HotelBooking: MandatoryParams
    {
        public int? BOOKING_ID { get; set; }
        public string? BOOKING_NO { get; set; }
        public int? PROPERTY_ID { get; set; }
        public string? PROPERTY_NAME { get; set; }
        public DateTime? CHECK_IN { get; set; }
        public DateTime? CHECK_OUT { get; set; }
        public string? CHECK_IN_TIMESLOT_DESC { get; set; }
        public string? CHECK_OUT_TIMESLOT_DESC { get; set; }
        public int? NIGHTS { get; set; }
        public int? ADULTS { get; set; }
        public int? CHILDREN { get; set; }
        public string? ROOM_IDS { get; set; }
        public string? ROOM_DETAILS { get; set; }
        public int? ROOMS { get; set; }
        public decimal? SUBTOTAL { get; set; }
        public decimal? PRICE { get; set; }
        public decimal? SERVICE_FEE { get; set; }
        public decimal? TOTAL { get; set; }
        public string? GUEST_FIRST_NAME { get; set; }
        public string? GUEST_LAST_NAME { get; set; }
        public string? GUEST_EMAIL { get; set; }
        public string? GUEST_COUNTRY { get; set; }
        public string? GUEST_PHONE { get; set; }
        public string? ARRIVAL_TIME { get; set; }
        public string? BOOKING_FOR { get; set; }
        public string? TRAVEL_FOR_WORK { get; set; }
        public string? SPECIAL_REQUESTS { get; set; }
        public bool? AGREE_TERMS { get; set; }
        public bool? MARKETING_CONSENT { get; set; }

        public string? PAYMENT_METHOD { get; set; }
        public string? PAYMENT_INTENT_ID { get; set; }
        public string? STATUS { get; set; }
        public bool? ACTIVE { get; set; }
        public string? PLACE { get; set; }
        public int? LISTING_TYPE_ID { get; set; }
    }
}
