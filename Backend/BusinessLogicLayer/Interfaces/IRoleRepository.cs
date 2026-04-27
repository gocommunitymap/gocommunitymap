using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IRoleRepository
    {
        public object GetRole(RoleMaster role);
        public object GetRoleMaster(RoleMaster role);
        
        public object CreateRole(Role role);
        public object UpdateRole(Role role);
        public object DeleteRole(RoleMaster role);
    }
}
