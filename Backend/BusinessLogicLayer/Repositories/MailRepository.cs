using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using MailKit.Security;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Data;
using static BusinessLogicLayer.Config.DatabaseObjects;
using System.Data;
using DataAccessLayer.Interface;
using DataAccessLayer.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BusinessLogicLayer.Repositories
{
    public class MailRepository : IMailRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IDataAccess _db;
        private readonly IEncryptionRepository _iEncryptionRepository;
        public static string? selectedDatabase = "";
        public readonly IIPAddressRepository _iIPAddressRepository;
        public MailRepository(IConfiguration configuration, IDataAccess db, IIPAddressRepository iIPAddressRepository, IEncryptionRepository iEncryptionRepository)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
            _iIPAddressRepository = iIPAddressRepository;
            _iEncryptionRepository = iEncryptionRepository;
        }
       
        public bool SendMail(MailData mailData)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailSettings objMailSettings = new MailSettings();
                    objMailSettings.Server = _configuration["MailSettings:Server"];
                    objMailSettings.Port = int.Parse(_configuration["MailSettings:Port"]);
                    objMailSettings.SenderName = _configuration["MailSettings:SenderName"];
                    objMailSettings.SenderEmail = _configuration["MailSettings:SenderEmail"];
                    objMailSettings.UserName = _configuration["MailSettings:UserName"];
                    objMailSettings.Password = _configuration["MailSettings:Password"];

                    MailboxAddress emailFrom = new MailboxAddress(objMailSettings.SenderName, objMailSettings.SenderEmail);
                    emailMessage.From.Add(emailFrom);
                    MailboxAddress emailTo = new MailboxAddress(mailData.EmailToName, mailData.EmailToId);
                    emailMessage.To.Add(emailTo);

                    //emailMessage.Cc.Add(new MailboxAddress("Cc Receiver", "cc@example.com"));
                    //emailMessage.Bcc.Add(new MailboxAddress("Bcc Receiver", "bcc@example.com"));

                    emailMessage.Subject = mailData.EmailSubject;

                    BodyBuilder emailBodyBuilder = new BodyBuilder();
                    //emailBodyBuilder.HtmlBody = mailData.EmailBody;

                    //emailMessage.Body = emailBodyBuilder.ToMessageBody();

                    using (StreamReader SourceReader = System.IO.File.OpenText("D:\\Projects\\MyProjects\\jawwad\\PMS\\APPLICATION\\starter-kit\\mail-template\\base.html"))
                    {
                        emailBodyBuilder.HtmlBody = SourceReader.ReadToEnd().Replace("[name]", mailData.EmailToName).Replace("[email]", mailData.EmailToId).Replace("[reset-link]", "http://localhost:3000/reset-password?prid=11001").Replace("[sender-name]", objMailSettings.SenderName);
                    }

                    emailMessage.Body = emailBodyBuilder.ToMessageBody();


                    //this is the SmtpClient from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
                    using (SmtpClient mailClient = new SmtpClient())
                    {
                        mailClient.Connect(objMailSettings.Server, objMailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                        mailClient.Authenticate(objMailSettings.UserName, objMailSettings.Password);
                        mailClient.Send(emailMessage);
                        mailClient.Disconnect(true);
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                // Exception Details
                return false;
            }
        }
        public async Task SendEmail2(MailRequest mailRequest)
        {
            try
            {


                MailSettings objMailSettings = new MailSettings();


                objMailSettings.Server = _configuration["MailSettings:Server"];
                objMailSettings.Port = int.Parse(_configuration["MailSettings:Port"]);
                objMailSettings.SenderName = _configuration["MailSettings:SenderName"];
                objMailSettings.SenderEmail = _configuration["MailSettings:SenderEmail"];
                objMailSettings.UserName = _configuration["MailSettings:UserName"];
                objMailSettings.Password = _configuration["MailSettings:Password"];

                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(objMailSettings.SenderEmail);
                email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
                email.Subject = mailRequest.Subject;
                var builder = new BodyBuilder();
                if (mailRequest.Attachments != null)
                {
                    byte[] fileBytes;
                    foreach (var file in mailRequest.Attachments)
                    {
                        if (file.Length > 0)
                        {
                            using (var ms = new MemoryStream())
                            {
                                file.CopyTo(ms);
                                fileBytes = ms.ToArray();
                            }
                            builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                        }
                    }
                }
                builder.HtmlBody = mailRequest.Body;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(objMailSettings.Server, objMailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(objMailSettings.SenderEmail, objMailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
