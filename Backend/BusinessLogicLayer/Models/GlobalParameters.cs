using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class GlobalParameters : MandatoryParams
    {
        public int? ID { get; set; }
        
        [Required]
        public string? TYPE_CODE { get; set; }
        public string? TYPE_DESCRIPTION { get; set; }
        public string? PARAMETER_CODE_1 { get; set; }
        public string? PARAMETER_DESCRIPTION_1 { get; set; }
        public string? PARAMETER_CODE_2 { get; set; }
        public string? PARAMETER_DESCRIPTION_2 { get; set; }
        public int? PARAMETER_CODE_3 { get; set; }
        public string? PARAMETER_DESCRIPTION_3 { get; set; }
        public int? PARAMETER_CODE_4 { get; set; }
        public string? PARAMETER_DESCRIPTION_4 { get; set; }
        public string? PARAMETER_CODE_5 { get; set; }
        public string? PARAMETER_DESCRIPTION_5 { get; set; }
        public bool? ACTIVE { get; set; }
        public bool? ALLOWED { get; set; }
    }
}
