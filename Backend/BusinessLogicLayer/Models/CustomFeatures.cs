using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class CustomFeatures : MandatoryParams
    {
        public int? CUSTOM_FEATURES_ID { get; set; }
        
        [Required]
        public int? PROPERTY_ID { get; set; }
        public string? DESCRIPTION { get; set; }
    }
}
