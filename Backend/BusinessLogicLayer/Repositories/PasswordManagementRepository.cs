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


namespace BusinessLogicLayer.Repositories
{
    public class PasswordManagementRepository : IPasswordManagementRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IDataAccess _db;
        private readonly IEncryptionRepository _iEncryptionRepository;
        public static string? selectedDatabase = "";
        public readonly IIPAddressRepository _iIPAddressRepository;
        public PasswordManagementRepository(IConfiguration configuration, IDataAccess db, IIPAddressRepository iIPAddressRepository, IEncryptionRepository iEncryptionRepository)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
            _iIPAddressRepository = iIPAddressRepository;
            _iEncryptionRepository = iEncryptionRepository;
        }

        public object ForgotPassword(string email)
        {
            try
            {
                MailData mailData = new MailData();
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailSettings objMailSettings = new MailSettings();
                    objMailSettings.Server = _configuration["MailSettings:Server"];
                    objMailSettings.Port = int.Parse(_configuration["MailSettings:Port"]);
                    objMailSettings.SenderName = _configuration["MailSettings:SenderName"];
                    objMailSettings.SenderEmail = _configuration["MailSettings:SenderEmail"];
                    objMailSettings.UserName = _configuration["MailSettings:UserName"];
                    objMailSettings.Password = _configuration["MailSettings:Password"];

                    var hostDetail = (_iIPAddressRepository.GetLocalIPAddress() as string[]);


                    string sp_name = Procedures.SP_MANAGE_PASSWORD.ToString();
                    Parameters dyParam = new Parameters();
                    dyParam.SelectedDB = _db.SelectedDatabase;
                    dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, email);
                    dyParam.AddDynamicParams("IP_ADDRESS", DbType.String, ParameterDirection.Input, hostDetail[0]);
                    dyParam.AddDynamicParams("HOST_NAME", DbType.String, ParameterDirection.Input, hostDetail[2]);
                    dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.ACTION1.ToString());
                    if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                    var response = _db.ExecuteProcDT(sp_name, dyParam);

                    if (response != null && response.Count > 0)
                    {
                        RESET_PASSWORD _RESET_PASSWORD = new RESET_PASSWORD();
                        foreach (var row in response)
                        {
                            _RESET_PASSWORD.ID = row.ID;
                            _RESET_PASSWORD.IP_ADDRESS = row.IP_ADDRESS;
                            _RESET_PASSWORD.HOST_NAME = row.HOST_NAME;
                            _RESET_PASSWORD.REQUEST_EXPIRY = row.REQUEST_EXPIRY;
                            _RESET_PASSWORD.REQUEST_DATE = row.REQUEST_DATE;
                            _RESET_PASSWORD.ACTIVE = row.ACTIVE;
                            _RESET_PASSWORD.USER_CODE = row.USER_CODE;
                            _RESET_PASSWORD.USER_NAME = row.USER_NAME;

                        }

                        MailboxAddress emailFrom = new MailboxAddress(objMailSettings.SenderName, objMailSettings.SenderEmail);
                        emailMessage.From.Add(emailFrom);
                        MailboxAddress emailTo = new MailboxAddress(_RESET_PASSWORD.USER_NAME, email);
                        emailMessage.To.Add(emailTo);

                        //emailMessage.Cc.Add(new MailboxAddress("Cc Receiver", "cc@example.com"));
                        //emailMessage.Bcc.Add(new MailboxAddress("Bcc Receiver", "bcc@example.com"));

                        emailMessage.Subject = _configuration["EmailTemplete:ResetPassword_EmailSubject"];

                        BodyBuilder emailBodyBuilder = new BodyBuilder();
                        //emailBodyBuilder.HtmlBody = mailData.EmailBody;

                        //emailMessage.Body = emailBodyBuilder.ToMessageBody();

                        using (StreamReader SourceReader = System.IO.File.OpenText(_configuration["EmailTemplete:ResetPasswordPath"]))
                        {
                            string resetLink = _configuration["EmailTemplete:ResetLink"] + "a=" + _iEncryptionRepository.Encrypt(_RESET_PASSWORD.ID.ToString());
                            emailBodyBuilder.HtmlBody = SourceReader.ReadToEnd().Replace("[name]", _RESET_PASSWORD.USER_NAME).Replace("[email]", email).Replace("[reset-link]", resetLink).Replace("[sender-name]", objMailSettings.SenderName);
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
                }

                return new { message = "Email Send Successfully!" };
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public object GetResetRequest(string key)
        {
            try
            {
                var hostDetail = (_iIPAddressRepository.GetLocalIPAddress() as string[]);
                string ID = _iEncryptionRepository.Decrypt(key);
                if (ID.Length > 0)
                {

                    string sp_name = Procedures.SP_MANAGE_PASSWORD.ToString();
                    Parameters dyParam = new Parameters();
                    dyParam.SelectedDB = _db.SelectedDatabase;
                    dyParam.AddDynamicParams("ID", DbType.Int32, ParameterDirection.Input, int.Parse(ID));
                    dyParam.AddDynamicParams("IP_ADDRESS", DbType.String, ParameterDirection.Input, hostDetail[0]);
                    dyParam.AddDynamicParams("HOST_NAME", DbType.String, ParameterDirection.Input, hostDetail[2]);
                    dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.ACTION2.ToString());
                    if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                    var response = _db.ExecuteProcDT(sp_name, dyParam);
                    RESET_PASSWORD _RESET_PASSWORD = new RESET_PASSWORD();
                    if (response != null)
                    {
                        foreach (var row in response)
                        {
                            _RESET_PASSWORD.EMAIL = row.EMAIL;
                            _RESET_PASSWORD.USER_CODE = row.USER_CODE;
                        }
                        return _RESET_PASSWORD;
                    }
                }
                return null;

            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public object ResetPassword(string key, string password)
        {
            try
            {
                string ID = _iEncryptionRepository.Decrypt(key);
                var hostDetail = (_iIPAddressRepository.GetLocalIPAddress() as string[]);

                string sp_name = Procedures.SP_MANAGE_PASSWORD.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ID", DbType.Int32, ParameterDirection.Input, int.Parse(ID));
                dyParam.AddDynamicParams("PASSWORD", DbType.String, ParameterDirection.Input, password);
                dyParam.AddDynamicParams("IP_ADDRESS", DbType.String, ParameterDirection.Input, hostDetail[0]);
                dyParam.AddDynamicParams("HOST_NAME", DbType.String, ParameterDirection.Input, hostDetail[2]);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.ACTION3.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                var response = _db.ExecuteProcDT(sp_name, dyParam);

                RESET_PASSWORD _RESET_PASSWORD = new RESET_PASSWORD();
                if (response != null && response.Count > 0)
                {
                    foreach (var row in response)
                    {
                        _RESET_PASSWORD.ID = row.ID;
                        _RESET_PASSWORD.EMAIL = row.EMAIL;
                        _RESET_PASSWORD.IP_ADDRESS = row.IP_ADDRESS;
                        _RESET_PASSWORD.HOST_NAME = row.HOST_NAME;
                        _RESET_PASSWORD.REQUEST_EXPIRY = row.REQUEST_EXPIRY;
                        _RESET_PASSWORD.REQUEST_DATE = row.REQUEST_DATE;
                        _RESET_PASSWORD.ACTIVE = row.ACTIVE;
                        _RESET_PASSWORD.USER_CODE = row.USER_CODE;
                        _RESET_PASSWORD.USER_NAME = row.USER_NAME;

                    }

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
                        MailboxAddress emailTo = new MailboxAddress(_RESET_PASSWORD.USER_NAME, _RESET_PASSWORD.EMAIL);
                        emailMessage.To.Add(emailTo);

                        //emailMessage.Cc.Add(new MailboxAddress("Cc Receiver", "cc@example.com"));
                        //emailMessage.Bcc.Add(new MailboxAddress("Bcc Receiver", "bcc@example.com"));

                        emailMessage.Subject = _configuration["EmailTemplete:ResetPassword_EmailSubject"];

                        BodyBuilder emailBodyBuilder = new BodyBuilder();
                        //emailBodyBuilder.HtmlBody = mailData.EmailBody;

                        //emailMessage.Body = emailBodyBuilder.ToMessageBody();

                        using (StreamReader SourceReader = System.IO.File.OpenText(_configuration["EmailTemplete:ResetSuccessPath"]))
                        {
                            string resetLink = _configuration["EmailTemplete:ResetLink"] + "a=" + _iEncryptionRepository.Encrypt(_RESET_PASSWORD.ID.ToString());
                            emailBodyBuilder.HtmlBody = SourceReader.ReadToEnd().Replace("[name]", _RESET_PASSWORD.USER_NAME).Replace("[sender-name]", objMailSettings.SenderName);
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
                }
                return new { message = "Email Send Successfully!" };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
