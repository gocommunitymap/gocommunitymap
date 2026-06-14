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
    public class GlobalParametersRepository : IGlobalParametersRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";
        public GlobalParametersRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }
        public object getGlobalParameters(GlobalParameters globalParameters)
        {
            try
            {
                string sp_name = Procedures.SP_SET_GLOBAL_PARAMETERS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ID", DbType.Int32, ParameterDirection.Input, globalParameters.ID);
                dyParam.AddDynamicParams("TYPE_CODE", DbType.String, ParameterDirection.Input, globalParameters.TYPE_CODE);
                dyParam.AddDynamicParams("TYPE_DESCRIPTION", DbType.String, ParameterDirection.Input, globalParameters.TYPE_DESCRIPTION);
                dyParam.AddDynamicParams("PARAMETER_CODE_1", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_1);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_1", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_1);
                dyParam.AddDynamicParams("PARAMETER_CODE_2", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_2);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_2", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_2);
                dyParam.AddDynamicParams("PARAMETER_CODE_3", DbType.Int32, ParameterDirection.Input, globalParameters.PARAMETER_CODE_3);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_3", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_3);
                dyParam.AddDynamicParams("PARAMETER_CODE_4", DbType.Int32, ParameterDirection.Input, globalParameters.PARAMETER_CODE_4);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_4", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_4);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, globalParameters.ACTIVE);
                dyParam.AddDynamicParams("ALLOWED", DbType.Boolean, ParameterDirection.Input, globalParameters.ALLOWED);
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
        public object GetGlobalParametersByTypeCodes(String? TYPE_CODES)
        {
            try
            {
                string sp_name = Procedures.SP_SET_GLOBAL_PARAMETERS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("TYPE_CODE", DbType.String, ParameterDirection.Input, TYPE_CODES);
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
        public object createGlobalParameters(GlobalParameters globalParameters)
        {
            try
            {
                string sp_name = Procedures.SP_SET_GLOBAL_PARAMETERS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ID", DbType.Int32, ParameterDirection.Input, globalParameters.ID);
                dyParam.AddDynamicParams("TYPE_CODE", DbType.String, ParameterDirection.Input, globalParameters.TYPE_CODE);
                dyParam.AddDynamicParams("TYPE_DESCRIPTION", DbType.String, ParameterDirection.Input, globalParameters.TYPE_DESCRIPTION);
                dyParam.AddDynamicParams("PARAMETER_CODE_1", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_1);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_1", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_1);
                dyParam.AddDynamicParams("PARAMETER_CODE_2", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_2);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_2", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_2);
                dyParam.AddDynamicParams("PARAMETER_CODE_3", DbType.Int32, ParameterDirection.Input, globalParameters.PARAMETER_CODE_3);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_3", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_3);
                dyParam.AddDynamicParams("PARAMETER_CODE_4", DbType.Int32, ParameterDirection.Input, globalParameters.PARAMETER_CODE_4);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_4", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_4);
                dyParam.AddDynamicParams("PARAMETER_CODE_5", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_5);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_5", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_5);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, globalParameters.ACTIVE);
                dyParam.AddDynamicParams("ALLOWED", DbType.Boolean, ParameterDirection.Input, globalParameters.ALLOWED);
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
        public object updateGlobalParameters(GlobalParameters globalParameters)
        {
            try
            {
                string sp_name = Procedures.SP_SET_GLOBAL_PARAMETERS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ID", DbType.Int32, ParameterDirection.Input, globalParameters.ID);
                dyParam.AddDynamicParams("TYPE_CODE", DbType.String, ParameterDirection.Input, globalParameters.TYPE_CODE);
                dyParam.AddDynamicParams("TYPE_DESCRIPTION", DbType.String, ParameterDirection.Input, globalParameters.TYPE_DESCRIPTION);
                dyParam.AddDynamicParams("PARAMETER_CODE_1", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_1);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_1", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_1);
                dyParam.AddDynamicParams("PARAMETER_CODE_2", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_2);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_2", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_2);
                dyParam.AddDynamicParams("PARAMETER_CODE_3", DbType.Int32, ParameterDirection.Input, globalParameters.PARAMETER_CODE_3);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_3", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_3);
                dyParam.AddDynamicParams("PARAMETER_CODE_4", DbType.Int32, ParameterDirection.Input, globalParameters.PARAMETER_CODE_4);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_4", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_4);
                dyParam.AddDynamicParams("PARAMETER_CODE_5", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_CODE_5);
                dyParam.AddDynamicParams("PARAMETER_DESCRIPTION_5", DbType.String, ParameterDirection.Input, globalParameters.PARAMETER_DESCRIPTION_5); dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, globalParameters.ACTIVE);
                dyParam.AddDynamicParams("ALLOWED", DbType.Boolean, ParameterDirection.Input, globalParameters.ALLOWED);
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
        public object deleteGlobalParameters(GlobalParameters globalParameters)
        {
            try
            {
                string sp_name = Procedures.SP_SET_GLOBAL_PARAMETERS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ID", DbType.Int32, ParameterDirection.Input, globalParameters.ID);
                dyParam.AddDynamicParams("TYPE_CODE", DbType.String, ParameterDirection.Input, globalParameters.TYPE_CODE);
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
