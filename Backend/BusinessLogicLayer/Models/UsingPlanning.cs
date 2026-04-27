using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class UsingPlanning:MandatoryParams
    {
        public int? UAP_ID { get; set; }
        public string? DESCRIPTION { get; set; }
        public int? UAP_TYPE_ID { get; set; }
        public int? FIELD_TYPE { get; set; }
        public string? TOOLTIP_TEXT { get; set; }

        public bool? ACTIVE { get; set; }
    }
}
