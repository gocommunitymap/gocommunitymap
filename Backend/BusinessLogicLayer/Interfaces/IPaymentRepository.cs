using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IPaymentRepository
    {
        object InsertPayment(Payment payment);
        object UpdatePaymentStatus(string paymentIntentId, string status);
        Payment GetPaymentByIntentId(string paymentIntentId);
    }
}
