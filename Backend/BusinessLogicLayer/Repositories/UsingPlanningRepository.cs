using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class UsingPlanningRepository : IUsingPlanningRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";

        public UsingPlanningRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }
        public object GetUsingPlanning(UsingPlanning usingPlanning)
        {
            try
            {
                string sp_name = Procedures.SP_USING_AND_PLANNING.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UAP_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_ID);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, usingPlanning.DESCRIPTION);
                dyParam.AddDynamicParams("UAP_TYPE_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_TYPE_ID);
                dyParam.AddDynamicParams("FIELD_TYPE", DbType.Int32, ParameterDirection.Input, usingPlanning.FIELD_TYPE);
                dyParam.AddDynamicParams("TOOLTIP_TEXT", DbType.String, ParameterDirection.Input, usingPlanning.TOOLTIP_TEXT);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, usingPlanning.ACTIVE);
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
        public object CreateUsingPlanning(UsingPlanning usingPlanning)
        {
            try
            {
                string sp_name = Procedures.SP_USING_AND_PLANNING.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UAP_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_ID);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, usingPlanning.DESCRIPTION);
                dyParam.AddDynamicParams("UAP_TYPE_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_TYPE_ID);
                dyParam.AddDynamicParams("FIELD_TYPE", DbType.Int32, ParameterDirection.Input, usingPlanning.FIELD_TYPE);
                dyParam.AddDynamicParams("TOOLTIP_TEXT", DbType.String, ParameterDirection.Input, usingPlanning.TOOLTIP_TEXT);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, usingPlanning.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object UpdateUsingPlanning(UsingPlanning usingPlanning)
        {
            try
            {
                string sp_name = Procedures.SP_USING_AND_PLANNING.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UAP_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_ID);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.Int32, ParameterDirection.Input, usingPlanning.DESCRIPTION);
                dyParam.AddDynamicParams("UAP_TYPE_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_TYPE_ID);
                dyParam.AddDynamicParams("FIELD_TYPE", DbType.Int32, ParameterDirection.Input, usingPlanning.FIELD_TYPE);
                dyParam.AddDynamicParams("TOOLTIP_TEXT", DbType.String, ParameterDirection.Input, usingPlanning.TOOLTIP_TEXT);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, usingPlanning.ACTIVE);
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
        public object DeleteUsingPlanning(UsingPlanning usingPlanning)
        {
            try
            {
                string sp_name = Procedures.SP_USING_AND_PLANNING.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UAP_ID", DbType.Int32, ParameterDirection.Input, usingPlanning.UAP_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.DELETE.ToString());
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
