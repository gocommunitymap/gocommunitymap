using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Org.BouncyCastle.Asn1.Crmf;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("external")]
    public class ChatGPTController : ControllerBase
    {
        private readonly IChatGPTRepository _chatGptService;

        public ChatGPTController(IChatGPTRepository chatGptService)
        {
            _chatGptService = chatGptService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message cannot be empty.");
            }

            try
            {
                var response = await _chatGptService.GetChatResponseAsync(request.Message);
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
    
}
