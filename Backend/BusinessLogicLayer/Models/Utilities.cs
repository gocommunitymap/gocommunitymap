using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Utilities : MandatoryParams
    {
        public int? UTILITY_ID { get; set; }
        public string? UTILITIES { get; set; }
        public int? UTILITY_TYPE_ID { get; set; }
        public bool? ACTIVE { get; set; }
    }
}
