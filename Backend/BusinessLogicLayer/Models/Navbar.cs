using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Navbar: MandatoryParams
    {
        public int? NAV_ID { get; set; }
        public string? NAV_DESCRIPTION { get; set; }
        public string? LINK { get; set; }
        public int? SORT_ORDER { get; set; }
        public int? TYPE { get; set; }
        public string? ICON { get; set; }
        public bool? ACTIVE { get; set; }
    }
}
