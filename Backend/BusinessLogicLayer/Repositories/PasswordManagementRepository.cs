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
using System.Resources;


namespace BusinessLogicLayer.Repositories
{
    public class PasswordManagementRepository : IPasswordManagementRepository
    {

        private readonly IMailRepository _mailRepository;
        private readonly ILogService _logService;
        private readonly IDataAccess _db;
        private readonly IEncryptionRepository _iEncryptionRepository;
        private readonly IIPAddressRepository _iIPAddressRepository;
        private readonly IEmailTemplateSettingsRepository _emailTemplateSettings;
        public static string? selectedDatabase = "";
        public readonly MailSettings mailSettings;
        public PasswordManagementRepository(IDataAccess db, IIPAddressRepository iIPAddressRepository, IEncryptionRepository iEncryptionRepository, IAppSettingsService appSettingsService, IMailRepository mailRepository, ILogService logService, IEmailTemplateSettingsRepository emailTemplateSettings)
        {
            _db = db;
            _iIPAddressRepository = iIPAddressRepository;
            _iEncryptionRepository = iEncryptionRepository;
            _mailRepository = mailRepository;
            _logService = logService;
            _emailTemplateSettings = emailTemplateSettings;
            selectedDatabase = appSettingsService.GetDatabase();
            mailSettings = appSettingsService.GetMailSettings();
        }

        public object ForgotPassword(string email)
        {
            try
            {
                _logService.Add("ForgotPassword", "Start", "1");
                var hostDetail = (_iIPAddressRepository.GetLocalIPAddress() as string[]);
                //var hostDetail = new string[] { "NA", "NA", "NA" };
                _logService.Add("hostDetail", hostDetail.Length.ToString(), "2");
                string sp_name = Procedures.SP_MANAGE_PASSWORD.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, email);
                dyParam.AddDynamicParams("IP_ADDRESS", DbType.String, ParameterDirection.Input, hostDetail[0]);
                dyParam.AddDynamicParams("HOST_NAME", DbType.String, ParameterDirection.Input, hostDetail[2]);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.ACTION1.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");
                _logService.Add("Update", "Params", "3");
                var response = _db.ExecuteProcDT(sp_name, dyParam);
                _logService.Add("Response", "Received", "4");
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
                    if (mailSettings.Disabled == "N")
                    {
                        try
                        {
                            String emailBody = "";
                            EmailTemplateSettings _emailTemplate = _emailTemplateSettings.GetEmailTemplateSettings("reset-password");
                            using (StreamReader SourceReader = System.IO.File.OpenText(_emailTemplate.TEMPLATE_PATH))
                            {
                                string resetLink = _emailTemplate.ADDITIONAL_VALUE_1 + "a=" + _iEncryptionRepository.Encrypt(_RESET_PASSWORD.ID.ToString());

                                emailBody = SourceReader.ReadToEnd().Replace("[name]", _RESET_PASSWORD.USER_NAME).Replace("[email]", email).Replace("[reset-link]", resetLink).Replace("[sender-name]", mailSettings.SenderName);
                            }
                            MailRequest mailRequest = new MailRequest()
                            {
                                ToEmail = email,
                                ToName = _RESET_PASSWORD.USER_NAME,
                                Body = emailBody,
                                Subject = _emailTemplate.EMAIL_SUBJECT
                            };

                            _mailRepository.SendEmail(mailRequest);
                            return true;
                        }
                        catch (Exception ex)
                        {
                            _logService.Add("Password Reset", "Send Email", ex.Message);
                            return false;
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
                object returnObj = new object();
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
                    if (mailSettings.Disabled == "N")
                    {
                        try
                        {
                            String emailBody = "";
                            EmailTemplateSettings _emailTemplate = _emailTemplateSettings.GetEmailTemplateSettings("reset-password-success");

                            using (StreamReader SourceReader = System.IO.File.OpenText(_emailTemplate.TEMPLATE_PATH))
                            {
                                emailBody = SourceReader.ReadToEnd().Replace("[name]", _RESET_PASSWORD.USER_NAME).Replace("[sender-name]", mailSettings.SenderName);
                            }

                            MailRequest mailRequest = new MailRequest()
                            {
                                ToEmail = _RESET_PASSWORD.EMAIL,
                                ToName = _RESET_PASSWORD.USER_NAME,
                                Body = emailBody,
                                Subject = _emailTemplate.EMAIL_SUBJECT
                            };

                            _mailRepository.SendEmail(mailRequest);
                            returnObj = new { message = "Email Send Successfully!" };
                        }
                        catch (Exception ex)
                        {
                            _logService.Add("Password Reset", "Send Email", ex.Message);
                            returnObj = new { error = "Email Sending failed!" };
                        }
                    }
                }
                return returnObj;
            }

            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
