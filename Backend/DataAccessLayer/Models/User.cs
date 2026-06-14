using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class User
    {
        public int user_code { get; set; }
        public string? email { get; set; }
        public string? contact_no { get; set; }
        public string? user_name { get; set; }
        public int role_code { get; set; }
        public string? role_name { get; set; }
        public string? ip_address { get; set; }
        public string? host_name { get; set; }
        public DateTime? login_time { get; set; }
        public DateTime? logout_time { get; set; }
        public DateTime? token_expiry { get; set; }
        public string? status { get; set; }
        public int? user_type { get; set; }


    }
}
