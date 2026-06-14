using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ILogService
    {
        public void Add(string user, string source, string entry);
        public void AddServiceLog(string user, string heading, string source, string ServiceName);
    }
}
