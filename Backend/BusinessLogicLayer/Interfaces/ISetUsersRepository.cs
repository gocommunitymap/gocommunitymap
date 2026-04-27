using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ISetUsersRepository
    {
        public object GetUsers(SetUsers users);
        public object GetAgentUsers(SetUsers users);
        public object CreateUsers(SetUsers users);
        public object UpdateUsers(SetUsers users);
        public object DeleteUsers(SetUsers users);
        public object ChangePassword(ChangePassword changePassword);
    }
}
