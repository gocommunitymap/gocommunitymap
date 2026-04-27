using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class User
    {
        public int? COMPCODE { get; set; }
        public int? USER_ID { get; set; }
        public string? EMAIL_ID { get; set; }
        public string? USER_FULL_NAME { get; set; }
        public string? IMAGE_PATH { get; set; }
        public int? ROLE_CODE { get; set; }
        public string? IP_ADDRESS { get; set; }
        public string? HOST_NAME { get; set;}
        public DateTime? LOGIN_TIME { get; set; }
        public DateTime? LOGOUT_TIME { get; set; }
        public string? STATUS { get; set; }


    }
}
