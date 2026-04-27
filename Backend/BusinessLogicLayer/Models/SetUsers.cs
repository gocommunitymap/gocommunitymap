using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class SetUsers: MandatoryParams
    {
        public int? USER_CODE { get; set; }
        public string? USER_NAME { get; set; }
        public string? LOGIN_ID { get; set; }
        public string? CONTACT_NO { get; set; }
        public string? EMAIL { get; set; }
        public string? PASSWORD { get; set; }
        public int? ROLE_CODE { get; set; }
        public int? EMPLOYEE_ID { get; set; }
        public int? INVALID_ATTEMPT { get; set; }
        public int? INVALID_ATTEMPT_COUNT { get; set; }
        public DateTime? USER_EXPIRY { get; set; }
        public int? STATUS { get; set; }
        public int? USER_TYPE { get; set; }
        public bool? ACTIVE { get; set; }
    }
}
