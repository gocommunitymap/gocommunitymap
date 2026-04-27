using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Features: MandatoryParams
    {
        public int? FEATURES_ID { get; set; }
        public string? FEATURES { get; set; }
        public int? FEATURES_TYPE_ID { get; set; }
        public int? TYPE { get; set; }
        public bool? IS_HIGHLIGHTED { get; set; }
        public string? ICON { get; set; }
        public bool? ACTIVE { get; set; }


    }
}
