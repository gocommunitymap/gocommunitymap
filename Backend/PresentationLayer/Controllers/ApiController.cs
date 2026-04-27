using BusinessLogicLayer.Repositories;
using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Text.Json;
using System.Xml.Linq;
using System.Xml;

namespace PresentationLayer.Controllers
{
    [ApiController]
        [Authorize]

    public class ApiController : ControllerBase
    {
        private readonly IGenericRepository _genericRepo;
        public ApiController(IGenericRepository genericRepo)
        {
            _genericRepo = genericRepo;
        }

        [HttpPost]
        [Route("api/{procedure_name}")]
        public IActionResult Index1(string procedure_name, [FromBody] JsonElement json)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _genericRepo.ExecuteProc(procedure_name, json.ToString());
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
        [Route("api/xml/{procedure_name}")]
        [Authorize]
        public IActionResult Xml(string procedure_name, [FromBody] JsonElement json)
        {
            var xml = XDocument.Load(JsonReaderWriterFactory.CreateJsonReader(Encoding.ASCII.GetBytes(json.GetRawText()), new XmlDictionaryReaderQuotas()));

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _genericRepo.ExecuteProc(procedure_name, xml.ToString());
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
