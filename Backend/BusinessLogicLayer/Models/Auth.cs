using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Auth
    {
        public int? usercode { get; set; }
        public string? user_name { get; set; }
        public string? email { get; set; }
        public string? contact_no { get; set; }
        public int? user_type { get; set; }
        public string? role_name { get; set; }
        public string? refresh_token { get; set; }
        public string? token { get; set; }
    }
    public class Login
    {
        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage = "invalid Email Address")]

        public string? email { get; set; }
        [Required]
        public string? password { get; set; }
    }
}
