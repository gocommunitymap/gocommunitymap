using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
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
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";
        public SetUsersRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, users.USER);
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, users.USER);
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, users.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                var response = _db.ExecuteProcDT(sp_name, dyParam);

                if (response != null && response.Count > 0)
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
                        MailboxAddress emailTo = new MailboxAddress(users.USER_NAME, users.EMAIL);
                        emailMessage.To.Add(emailTo);

                        //emailMessage.Cc.Add(new MailboxAddress("Cc Receiver", "cc@example.com"));
                        //emailMessage.Bcc.Add(new MailboxAddress("Bcc Receiver", "bcc@example.com"));

                        emailMessage.Subject = _configuration["EmailTemplete:Registration_EmailSubject"];

                        BodyBuilder emailBodyBuilder = new BodyBuilder();
                        
                        using (StreamReader SourceReader = System.IO.File.OpenText(_configuration["EmailTemplete:RegistrationSuccessPath"]))
                        {
                            emailBodyBuilder.HtmlBody = SourceReader.ReadToEnd().Replace("[name]", users.USER_NAME).Replace("[app-name]", _configuration["MailSettings:AppName"]);
                        }

                        emailMessage.Body = emailBodyBuilder.ToMessageBody();
                        
                        using (SmtpClient mailClient = new SmtpClient())
                        {
                            mailClient.Connect(objMailSettings.Server, objMailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                            mailClient.Authenticate(objMailSettings.UserName, objMailSettings.Password);
                            mailClient.Send(emailMessage);
                            mailClient.Disconnect(true);
                        }
                    }
                }
                return response;
            }
            catch (Exception ex)
            {
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, users.USER);
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, users.USER);
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
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, changePassword.USER);
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
