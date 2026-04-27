using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class DiscoverSectionMaster : MandatoryParams
    {
        public int? DISCOVER_SECTION_ID { get; set; }
        public int? SECTION_TYPE { get; set; }
        public int? SECTION_SUB_TYPE { get; set; }
        public string? SECTION_TYPE_TITLE { get; set; }
        public string? SECTION_TITLE { get; set; }
        public string? SECTION_SUBTITLE { get; set; }
        public string? PICTURE_LINK { get; set; }
        public int? SORT_ORDER_M { get; set; }
        public bool? ACTIVE_M { get; set; }
        public string? DISPLAY_TYPE { get; set; }
    }
}
