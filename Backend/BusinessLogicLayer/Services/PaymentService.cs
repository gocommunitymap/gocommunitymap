using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repo;
        private readonly IConfiguration _config;

        public PaymentService(IPaymentRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;

            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];
        }

        public async Task<PaymentResponseDto> CreatePaymentIntentAsync(PaymentRequestDto request)
        {

            // 🔷 Step 1: Create Stripe PaymentIntent
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(request.Amount * 100),
                Currency = request.Currency,
                ReceiptEmail = request.Email,
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true
                },

                Metadata = new Dictionary<string, string> { { "email", request.Email } }
            };

            var service = new PaymentIntentService();

            var intent = await service.CreateAsync(options, new RequestOptions
            {
                IdempotencyKey = Guid.NewGuid().ToString()
            });

            // 🔷 Step 2: Save via Repository (ExecuteProc inside)
            _repo.InsertPayment(new Payment
            {
                PaymentIntentId = intent.Id,
                Amount = request.Amount,
                Currency = request.Currency,
                Status = intent.Status,
                CustomerEmail = request.Email,
                CreatedAt = DateTime.UtcNow
            });

            return new PaymentResponseDto
            {
                ClientSecret = intent.ClientSecret,
                PaymentIntentId = intent.Id,
                Status = intent.Status
            };
        }

        public async Task HandleSuccessfulPaymentAsync(string paymentIntentId)
        {
            var payment = _repo.GetPaymentByIntentId(paymentIntentId);

            if (payment == null || payment.Status == "succeeded")
                return;

            // 🔷 Update DB via Repository
            _repo.UpdatePaymentStatus(paymentIntentId, "succeeded");

            // 🔔 Business Logic
            // - Confirm order
            // - Update inventory
            // - Generate invoice
        }
    }
}
