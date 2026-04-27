using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class PaymentResponseDto
    {
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
        public string Status { get; set; }

    }
}
