using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Stripe;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    [EnableRateLimiting("external")]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IPaymentService _service;

        public PaymentController(IConfiguration config, IPaymentService service)
        {
            _service = service;
            _config = config;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePayment(PaymentRequestDto request)
        {
            var result = await _service.CreatePaymentIntentAsync(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> GetPaymentDetails()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _config["Stripe:WebhookSecret"]
            );

            if (stripeEvent.Type == "payment_intent.succeeded")
            {
                var intent = stripeEvent.Data.Object as PaymentIntent;
                await _service.HandleSuccessfulPaymentAsync(intent.Id);
            }

            return Ok();
        }
    }
}
