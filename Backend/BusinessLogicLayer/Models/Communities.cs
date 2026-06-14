using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Communities
    {
        public int? COMMUNITY_ID { get; set; }
        public string? COMMUNITY_NAME { get; set; }
        public string? LOCATION { get; set; }
        public string? MEMBERS { get; set; }
        public string? REGION { get; set; }
        public string? COUNTRY_CODE { get; set; }
        public string? PICTURE_LINK { get; set; }
        public bool? ACTIVE { get; set; }
    }
}
