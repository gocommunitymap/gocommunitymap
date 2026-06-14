using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class EmailTemplateSettingsRepository : IEmailTemplateSettingsRepository
    {
        private readonly IDataAccess _db;
        public static string? selectedDatabase = "";
        public static string? BasePath = "";

        public EmailTemplateSettingsRepository(IDataAccess db, IAppSettingsService appSettingsService)
        {
            _db = db;
            selectedDatabase = appSettingsService.GetDatabase();
            BasePath = appSettingsService.GetEmailTemplate().BasePath;
        }

        public EmailTemplateSettings GetEmailTemplateSettings(string code)
        {
            EmailTemplateSettings emailTemplate = new EmailTemplateSettings();
            try
            {
                string sp_name = Procedures.SP_GET_EMAILCONFIG.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("CODE", DbType.String, ParameterDirection.Input, code);
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                var response = _db.ExecuteProc(sp_name, dyParam);
                var result = (IEnumerable<dynamic>)response;

                if (result != null)
                {
                    foreach (var item in result)
                    {
                        emailTemplate.EMAIL_SUBJECT = item.EMAIL_SUBJECT;
                        emailTemplate.TEMPLATE_PATH = BasePath + item.TEMPLATE_PATH;
                        emailTemplate.ADDITIONAL_VALUE_1 = item.ADDITIONAL_VALUE_1;
                        emailTemplate.ADDITIONAL_VALUE_2 = item.ADDITIONAL_VALUE_2;
                        emailTemplate.ADDITIONAL_VALUE_3 = item.ADDITIONAL_VALUE_3;
                        emailTemplate.ADDITIONAL_VALUE_4 = item.ADDITIONAL_VALUE_4;
                    }
                }
            }

            catch (Exception)
            {

                throw;
            }
            return emailTemplate;
        }
    }
}
