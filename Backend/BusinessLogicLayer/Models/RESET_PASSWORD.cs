using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class RESET_PASSWORD
    {
        public int? ID { get; set; }
        public string? EMAIL{ get; set; }
        public string? IP_ADDRESS { get; set; }
        public string? HOST_NAME { get; set; }
        public DateTime? REQUEST_EXPIRY { get; set; }
        public DateTime? REQUEST_DATE { get; set; }
        public bool? ACTIVE { get; set; }
        public int? USER_CODE { get; set; }
        public string? USER_NAME { get; set; }
    }
}
