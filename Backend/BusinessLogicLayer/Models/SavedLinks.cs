using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class SavedLinks: MandatoryParams
    {
        public int? LINK_ID { get; set; }
        public int? PROPERTY_ID { get; set; }
        public string? LINK { get; set; }
        public string? TYPE { get; set; }
        public int? ALERT_TYPE { get; set; }
        public string? DESCRIPTION { get; set; }
        public bool? ACTIVE { get; set; }
    }
}
