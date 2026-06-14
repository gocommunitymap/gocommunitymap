using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace BusinessLogicLayer.Repositories
{
    public class SetUsersRepository : ISetUsersRepository
    {
        private readonly IDataAccess _db;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";
        public readonly ILogService _logService;
        public readonly IMailRepository _mailRepository;
        public readonly IEncryptionRepository _encryptionRepository;
        public readonly IEmailTemplateSettingsRepository _emailTemplateSettings;
        public readonly MailSettings mailSettings;
        public readonly EmailTemplate emailTemplate;
        public SetUsersRepository(IDataAccess db, IJwtExtractService jwtExtractService, ILogService logService, IAppSettingsService appSettingsService, IMailRepository mailRepository, IEncryptionRepository encryptionRepository, IEmailTemplateSettingsRepository emailTemplateSettings)
        {
            _db = db;
            UserCode = jwtExtractService.GetUserIdFromToken();
            _logService = logService;
            _mailRepository = mailRepository;
            _encryptionRepository = encryptionRepository;
            selectedDatabase = appSettingsService.GetDatabase();
            mailSettings = appSettingsService.GetMailSettings();
            emailTemplate = appSettingsService.GetEmailTemplate();
            _emailTemplateSettings = emailTemplateSettings;
        }
        public object GetUsers(SetUsers users)
        {
            try
            {
                string sp_name = Procedures.SP_SET_USER.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER_CODE", DbType.Int32, ParameterDirection.Input, users.USER_CODE);
                dyParam.AddDynamicParams("USER_NAME", DbType.String, ParameterDirection.Input, users.USER_NAME);
                dyParam.AddDynamicParams("LOGIN_ID", DbType.String, ParameterDirection.Input, users.LOGIN_ID);
                dyParam.AddDynamicParams("CONTACT_NO", DbType.String, ParameterDirection.Input, users.CONTACT_NO);
                dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, users.EMAIL);
                dyParam.AddDynamicParams("ROLE_CODE", DbType.String, ParameterDirection.Input, users.ROLE_CODE);
                dyParam.AddDynamicParams("INVALID_ATTEMPT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT);
                dyParam.AddDynamicParams("INVALID_ATTEMPT_COUNT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT_COUNT);
                dyParam.AddDynamicParams("USER_TYPE", DbType.Int16, ParameterDirection.Input, users.USER_TYPE);
                dyParam.AddDynamicParams("USER_EXPIRY", DbType.DateTime, ParameterDirection.Input, users.USER_EXPIRY);
                dyParam.AddDynamicParams("STATUS", DbType.Boolean, ParameterDirection.Input, users.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object GetAgentUsers(SetUsers users)
        {
            try
            {
                string sp_name = Procedures.SP_SET_USER.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER_CODE", DbType.Int32, ParameterDirection.Input, users.USER_CODE);
                dyParam.AddDynamicParams("USER_NAME", DbType.String, ParameterDirection.Input, users.USER_NAME);
                dyParam.AddDynamicParams("LOGIN_ID", DbType.String, ParameterDirection.Input, users.LOGIN_ID);
                dyParam.AddDynamicParams("CONTACT_NO", DbType.String, ParameterDirection.Input, users.CONTACT_NO);
                dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, users.EMAIL);
                dyParam.AddDynamicParams("ROLE_CODE", DbType.String, ParameterDirection.Input, users.ROLE_CODE);
                dyParam.AddDynamicParams("INVALID_ATTEMPT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT);
                dyParam.AddDynamicParams("INVALID_ATTEMPT_COUNT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT_COUNT);
                dyParam.AddDynamicParams("USER_TYPE", DbType.Int16, ParameterDirection.Input, users.USER_TYPE);
                dyParam.AddDynamicParams("USER_EXPIRY", DbType.DateTime, ParameterDirection.Input, users.USER_EXPIRY);
                dyParam.AddDynamicParams("STATUS", DbType.Boolean, ParameterDirection.Input, users.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH2.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object CreateUsers(SetUsers users)
        {
            try
            {
                string sp_name = Procedures.SP_SET_USER.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER_CODE", DbType.Int32, ParameterDirection.Input, users.USER_CODE);
                dyParam.AddDynamicParams("USER_NAME", DbType.String, ParameterDirection.Input, users.USER_NAME);
                dyParam.AddDynamicParams("LOGIN_ID", DbType.String, ParameterDirection.Input, users.LOGIN_ID);
                dyParam.AddDynamicParams("CONTACT_NO", DbType.String, ParameterDirection.Input, users.CONTACT_NO);
                dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, users.EMAIL);
                dyParam.AddDynamicParams("PASSWORD", DbType.String, ParameterDirection.Input, users.PASSWORD);
                dyParam.AddDynamicParams("ROLE_CODE", DbType.String, ParameterDirection.Input, users.ROLE_CODE);
                dyParam.AddDynamicParams("INVALID_ATTEMPT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT);
                dyParam.AddDynamicParams("INVALID_ATTEMPT_COUNT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT_COUNT);
                dyParam.AddDynamicParams("USER_EXPIRY", DbType.DateTime, ParameterDirection.Input, users.USER_EXPIRY);
                dyParam.AddDynamicParams("STATUS", DbType.Boolean, ParameterDirection.Input, users.STATUS);
                dyParam.AddDynamicParams("USER_TYPE", DbType.Int32, ParameterDirection.Input, users.USER_TYPE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                var response = _db.ExecuteProcDT(sp_name, dyParam);
                if (mailSettings.Disabled == "N" && response != null && response.Count > 0)
                {
                    _logService.Add("Email Check", "response 1: ", response.Count().ToString());
                    try
                    {
                        String emailBody = "";
                        EmailTemplateSettings _emailTemplate = _emailTemplateSettings.GetEmailTemplateSettings("user-registration");
                        using (StreamReader SourceReader = System.IO.File.OpenText(_emailTemplate.TEMPLATE_PATH))
                        {
                            emailBody = SourceReader.ReadToEnd().Replace("[name]", users.USER_NAME).Replace("[app-name]", mailSettings.AppName).Replace("[sender-name]", mailSettings.SenderName);
                        }
                        MailRequest mailRequest = new MailRequest()
                        {
                            ToEmail = users.EMAIL,
                            ToName = users.USER_NAME,
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
                return response;
            }
            catch (Exception ex)
            {
                _logService.Add("Email Check", "EmailTemplate 13: Exception", ex.Message);
                throw;
            }
        }
        public object UpdateUsers(SetUsers users)
        {
            try
            {
                string sp_name = Procedures.SP_SET_USER.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER_CODE", DbType.Int32, ParameterDirection.Input, users.USER_CODE);
                dyParam.AddDynamicParams("USER_NAME", DbType.String, ParameterDirection.Input, users.USER_NAME);
                dyParam.AddDynamicParams("LOGIN_ID", DbType.String, ParameterDirection.Input, users.LOGIN_ID);
                dyParam.AddDynamicParams("CONTACT_NO", DbType.String, ParameterDirection.Input, users.CONTACT_NO);
                dyParam.AddDynamicParams("EMAIL", DbType.String, ParameterDirection.Input, users.EMAIL);
                dyParam.AddDynamicParams("ROLE_CODE", DbType.String, ParameterDirection.Input, users.ROLE_CODE);
                dyParam.AddDynamicParams("INVALID_ATTEMPT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT);
                dyParam.AddDynamicParams("INVALID_ATTEMPT_COUNT", DbType.Int32, ParameterDirection.Input, users.INVALID_ATTEMPT_COUNT);
                dyParam.AddDynamicParams("USER_EXPIRY", DbType.DateTime, ParameterDirection.Input, users.USER_EXPIRY);
                dyParam.AddDynamicParams("STATUS", DbType.Boolean, ParameterDirection.Input, users.STATUS);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object DeleteUsers(SetUsers users)
        {
            try
            {
                string sp_name = Procedures.SP_SET_USER.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER_CODE", DbType.Int32, ParameterDirection.Input, users.USER_CODE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object ChangePassword(ChangePassword changePassword)
        {
            try
            {
                string sp_name = Procedures.SP_SET_USER.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER_CODE", DbType.Int32, ParameterDirection.Input, changePassword.USER);
                dyParam.AddDynamicParams("PASSWORD", DbType.String, ParameterDirection.Input, changePassword.PASSWORD);
                dyParam.AddDynamicParams("NEW_PASSWORD", DbType.String, ParameterDirection.Input, changePassword.NEW_PASSWORD);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.CHANGEPWD.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
