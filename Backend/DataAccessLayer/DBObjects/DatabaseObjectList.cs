using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DBObjects
{
    public class DatabaseObjectList
    {
        public static string SP_Setup_Company = "Sp_Setup_Company";
        public enum Actions_Setup_Company { GET_ALL, GET_FILTERED, INSERT, UPDATE, DELETE, APPROVE, REJECT }
    }
}
