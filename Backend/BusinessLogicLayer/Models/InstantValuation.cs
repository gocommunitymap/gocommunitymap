using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class InstantValuation
    {
        public int? ID { get; set; }
        public string? POSTAL_CODE { get; set; }
        public bool? IS_HOMEOWNER { get; set; }
        public bool? IS_LET_OUT_PROPERTY { get; set; }
        public string? WHY_INTERESTED { get; set; }
        public bool? SELLING_NEXT_12_MONTHS { get; set; }
        public bool? FIRST_TIME_BUYER { get; set; }
        public bool? WANT_TO_BE_NOTIFY { get; set; }
        public string? EMAIL_ADDRESS { get; set; }
        public string? PLACE { get; set; }
        public string? ADDRESS { get; set; }
        public string? SUMMARY { get; set; }
    }
}
