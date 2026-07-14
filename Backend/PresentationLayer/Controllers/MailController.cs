using BusinessLogicLayer.Models;
using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Org.BouncyCastle.Asn1.Pkcs;
using System.ComponentModel.DataAnnotations;

namespace PresentationLayer.Controllers
{
    [ApiController]
    [EnableRateLimiting("external")]
    public class MailController : ControllerBase
    {
        private readonly IMailRepository _mailService;
        //injecting the IMailService into the constructor
        public MailController(IMailRepository _MailService)
        {
            _mailService = _MailService;
        }

        [HttpPost]
        [Route("SendMail2")]
        public async Task SendEmail2(MailRequest mailRequest)
        {
            //var files = Request.Form.Files;//.Any() ? Request.Form.Files : new FormFileCollection();

            //MailRequest _MailRequest = new MailRequest();
            //_MailRequest.Attachments = files.ToList();
            //_MailRequest.ToEmail = mailRequest.EmailToId;
            //_MailRequest.Subject = mailRequest.EmailSubject;
            //_MailRequest.Body = mailRequest.EmailBody;

            await _mailService.SendEmail2(mailRequest);
        }

    }
}
