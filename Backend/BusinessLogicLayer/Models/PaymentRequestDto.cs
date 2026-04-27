using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public string Email { get; set; }
    }
}
