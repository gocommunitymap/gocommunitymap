using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Sections : MandatoryParams
    {
        public int? SECTION_ID { get; set; }
        public string? SECTION_TITLE { get; set; }
        public string? HEADING { get; set; }
        public string? DESCRIPTION { get; set; }
        public string? PICTURE_LINK { get; set; }
        public string? MORE_BUTTON_TEXT { get; set; }
        public string? MORE_BUTTON_LINK { get; set; }
        public int? SORT_ORDER { get; set; }
        public string? ICON { get; set; }
        public bool? ACTIVE { get; set; }
        public string? DISPLAY_TYPE { get; set; }
    }
}
