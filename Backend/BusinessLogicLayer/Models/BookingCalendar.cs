using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class BookingCalendar
    {
        [Required]
        public DateTime? CHECK_IN { get; set; }
        [Required]
        public DateTime? CHECK_OUT { get; set; }
        public int? PROPERTY_ID { get; set; }
        public int? ROOM_ID { get; set; }
    }
}
