using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class RoleMaster:MandatoryParams
    {
        public int? ROLE_CODE { get; set; }
        public string? ROLE_NAME { get; set; }
        public bool? ACTIVE { get; set; }
    }
}
