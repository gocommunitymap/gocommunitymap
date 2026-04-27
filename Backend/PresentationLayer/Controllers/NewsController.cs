using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]

    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _NewsRepository;
        public NewsController(INewsRepository NewsRepository)
        {
            _NewsRepository = NewsRepository;
        }
        [HttpGet]
        [EnableCors("cors_policy")]

        //[Authorize]
        public IActionResult GetNews([FromQuery] News news)
        {

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _NewsRepository.GetNews(news);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [EnableCors("cors_policy")]
        public object GetNewsWithDetail([Required] int NEWS_ID)
        {
            News news = new News();
            news.NEWS_ID = NEWS_ID;

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _NewsRepository.GetNewsWithDetail(news);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        [Authorize]
        public IActionResult CreateNews(News news)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _NewsRepository.CreateNews(news);
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
        [Authorize]
        public IActionResult UpdateNews(News news)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _NewsRepository.UpdateNews(news);
                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete]
        [Authorize]
        public IActionResult DeleteNews([Required] int NEWS_ID, [Required] int USER)
        {
            News news = new News();
            news.NEWS_ID = NEWS_ID;
            news.USER = USER;

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid Data!");

                var result = _NewsRepository.DeleteNews(news);

                if (result == null)
                    return BadRequest("Request Faild!");
                return Ok(result);
            }
            catch (Exception ex)
            {
                //log error
                return StatusCode(500, ex.Message);
            }
        }

    }
}
