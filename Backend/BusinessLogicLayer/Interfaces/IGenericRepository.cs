using DataAccessLayer.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IGenericRepository
    {
        public object ExecuteProc(string sp_name,String json);
    }
}
