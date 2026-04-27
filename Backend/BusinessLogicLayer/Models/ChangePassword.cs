using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class ChangePassword: MandatoryParams
    {
        [Required]
        public string? PASSWORD { get; set; }
        [Required] 
        public string? NEW_PASSWORD { get; set; }
    }
}
