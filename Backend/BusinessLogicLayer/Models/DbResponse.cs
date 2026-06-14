using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class DbResponse
    {
        public string MESSAGE { get; set; } = "";
        public int CODE { get; set; } = 0;
        public int STATUS { get; set; } = 0;
        public string DETAIL { get; set; } = "";
        public String ADDITIONAL_DETAILS { get; set; } = "";
    }
}
