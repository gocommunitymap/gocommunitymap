using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class News : MandatoryParams
    {
        public int? NEWS_ID { get; set; }
        public string? NEWS_TITLE { get; set; }
        public DateTime? NEWS_DATE { get; set; }
        public string? SHORT_DESCRIPTION { get; set; }
        public string? PICTURE_LINK { get; set; }
        public int? SORT_ORDER { get; set; }
        public string? ICON { get; set; }
        public bool? ACTIVE { get; set; }
        public DateTime? ACTIVE_FROM { get; set; }
        public DateTime? ACTIVE_TO { get; set; }
        public string? DISPLAY_TYPE { get; set; }
        public string? KEY_TAKEAWAYS { get; set; }
        public string? LONG_DESCRIPTION { get; set; }

    }
}
