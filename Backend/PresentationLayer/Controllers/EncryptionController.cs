using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;


namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class EncryptionController : ControllerBase
    {
        private readonly IEncryptionRepository _encryption;
        public EncryptionController(IEncryptionRepository encryption)
        {
            _encryption = encryption;
        }

        [HttpPost]
        //[Authorize]
        public IActionResult Encryption(string Text, string Key)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _encryption.Encrypt(Text, Key);
                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public IActionResult Decryption(string Text, string Key)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _encryption.Decrypt(Text, Key);
                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
