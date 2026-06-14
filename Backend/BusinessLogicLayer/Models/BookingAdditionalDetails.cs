using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class BookingAdditionalDetails
    {
        public DateTime? ISSUANCE_DATE { get; set; }
        public DateTime? BOOKING_DATE { get; set; }
        public int? LISTING_TYPE { get; set; }
        public String PLACE { get; set; } = "";
        public List<BookingRoomDetails> BookingRoomDetailsList { get; set; } = new List<BookingRoomDetails>();
    }
}
