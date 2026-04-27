using BusinessLogicLayer.Models;
using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("fileprocess/[action]")]
    [ApiController]
    [Authorize]
    public class FileProcessController : ControllerBase
    {
        private readonly IFileServiceRepository _uploadService;

        public FileProcessController(IFileServiceRepository uploadService)
        {
            _uploadService = uploadService;
        }
        [HttpPost]
        public async Task<ActionResult> UploadFile([Required] string dir, [Required] string fileName, [Required] IFormFile fileDetails)
        {
            if (fileDetails == null)
            {
                return BadRequest();
            }

            try
            {
                await _uploadService.PostFile(dir, fileName, fileDetails);
                List<dynamic> lst = new List<dynamic>();
                lst.Add(new { code = 1, message = "File Uploaded!" });
                return Ok(lst);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        public ActionResult DeleteFile([Required] string dir, [Required] string fileName)
        {
            try
            {
                _uploadService.DeleteFile(dir, fileName);
                List<dynamic> lst = new List<dynamic>();
                lst.Add(new { code = 1, message = "File Deleted!" });
                return Ok(lst);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        [HttpGet]
        public ActionResult GetFile([Required] string dir, [Required] string fileName)
        {
            try
            {
                byte[] file = _uploadService.GetFile(dir, fileName);
                return Ok(file);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
