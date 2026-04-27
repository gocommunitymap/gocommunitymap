using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class DiscoverSectionDetail
    {
        public int? DISCOVER_SECTION_DID { get; set; }
        public string? LINK_TITLE { get; set; }
        public string? LINK_URL { get; set; }
        public int? SORT_ORDER { get; set; }
        public bool? ACTIVE { get; set; }
        
    }
}
