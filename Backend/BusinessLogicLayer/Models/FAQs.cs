using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class FAQs
    {
        public int? FAQ_ID { get; set; }
        public string? QUESTION { get; set; }
        public string? ANSWER { get; set; }
        public int? PROPERTY_ID { get; set; }
    }
}
