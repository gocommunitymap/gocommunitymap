using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Role: RoleMaster
    {
        public List<RoleDetail>? ROLE_DETAIL { get; set; }

    }
}
