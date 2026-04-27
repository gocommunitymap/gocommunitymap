using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class DiscoverSection : DiscoverSectionMaster
    {
        public List<DiscoverSectionDetail>? DISCOVER_SECTION_DETAIL { get; set; }
    }
}
