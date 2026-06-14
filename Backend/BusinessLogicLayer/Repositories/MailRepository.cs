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
		private readonly IDataAccess _db;
        private readonly IEncryptionRepository _iEncryptionRepository;
        public static string? selectedDatabase = "";
        public readonly IIPAddressRepository _iIPAddressRepository;
        private readonly MailSettings mailSettings;
		public MailRepository(IDataAccess db, IIPAddressRepository iIPAddressRepository, IEncryptionRepository iEncryptionRepository, AppSettings appSettings)
        {
            _db = db;
            selectedDatabase = appSettings.Database;
            _iIPAddressRepository = iIPAddressRepository;
            _iEncryptionRepository = iEncryptionRepository;
            mailSettings= appSettings.MailSettings;

		}

        public async Task<dynamic> SendEmail2(MailRequest mailRequest)
        {
            try
            {

                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse( mailSettings.SenderEmail);
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
                smtp.Connect( mailSettings.Server,  mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate( mailSettings.SenderEmail,  mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }

		public async Task<dynamic> SendEmail(MailRequest mailRequest)
		{
			try
			{
				var email = new MimeMessage();
				email.Sender = MailboxAddress.Parse(mailSettings.SenderEmail);
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
				smtp.Connect(mailSettings.Server, mailSettings.Port, SecureSocketOptions.StartTls);
				smtp.Authenticate(mailSettings.SenderEmail, mailSettings.Password);
				await smtp.SendAsync(email);
				smtp.Disconnect(true);
                return true;
			}
			catch (Exception)
			{

				throw;
			}
		}

	}
}
