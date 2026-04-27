using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class SetRoomCustomFeatures
    {
        public int? CUSTOM_FEATURES_ID { get; set; }
        public string? DESCRIPTION { get; set; }
        public int? PROPERTY_ID { get; set; }
        public int? ROOM_ID { get; set; }

    }
}
