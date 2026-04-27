using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class AuthToken
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
    }
    public class Refresh_Token
    {
        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage = "invalid Email Address")]

        public string? Email { get; set; }
        [Required]
        public string? Token { get; set; }
        [Required]
        public string? RefreshToken { get; set; }

    }
}
