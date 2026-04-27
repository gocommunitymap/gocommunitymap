using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IPasswordManagementRepository
    {
        public object ForgotPassword(string email);
        public object GetResetRequest(string key);
        public object ResetPassword(string key, string password);
    }
}
