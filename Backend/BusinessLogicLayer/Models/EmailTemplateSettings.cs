using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class EmailTemplateSettings
    {
        public int? ID { get; set; }
        public string? CODE {get; set;}
        public string? EMAIL_SUBJECT {get; set;}
        public string? TEMPLATE_PATH {get; set;}
        public string? ADDITIONAL_VALUE_1 {get; set;}
        public string? ADDITIONAL_VALUE_2 {get; set;}
        public string? ADDITIONAL_VALUE_3 {get; set;}
        public string? ADDITIONAL_VALUE_4 {get; set;}
        public string? ADDITIONAL_VALUE_5 {get; set;}
    }
}
