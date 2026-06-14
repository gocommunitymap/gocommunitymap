using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class SavedLinksRepository:ISavedLinksRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";
        public SavedLinksRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }
        public object GetSavedLinks(SavedLinks savedLinks)
        {
            try
            {
                string sp_name = Procedures.SP_SET_SAVED_LINKS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("LINK_ID", DbType.Int32, ParameterDirection.Input, savedLinks.LINK_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, savedLinks.PROPERTY_ID);
                dyParam.AddDynamicParams("LINK", DbType.String, ParameterDirection.Input, savedLinks.LINK);
                dyParam.AddDynamicParams("TYPE", DbType.String, ParameterDirection.Input, savedLinks.TYPE);
                dyParam.AddDynamicParams("ALERT_TYPE", DbType.Int32, ParameterDirection.Input, savedLinks.ALERT_TYPE);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, savedLinks.DESCRIPTION);
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
        public object PostSavedLinks(SavedLinks savedLinks)
        {
            try
            {

                string sp_name = Procedures.SP_SET_SAVED_LINKS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("LINK_ID", DbType.Int32, ParameterDirection.Input, savedLinks.LINK_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, savedLinks.PROPERTY_ID);
                dyParam.AddDynamicParams("LINK", DbType.String, ParameterDirection.Input, savedLinks.LINK);
                dyParam.AddDynamicParams("TYPE", DbType.String, ParameterDirection.Input, savedLinks.TYPE);
                dyParam.AddDynamicParams("ALERT_TYPE", DbType.Int32, ParameterDirection.Input, savedLinks.ALERT_TYPE);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, savedLinks.DESCRIPTION);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, savedLinks.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
                
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public object DeleteSavedLinks(SavedLinks savedLinks)
        {
            try
            {
                string sp_name = Procedures.SP_SET_SAVED_LINKS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("LINK_ID", DbType.Int32, ParameterDirection.Input, savedLinks.LINK_ID);
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
    }
}
