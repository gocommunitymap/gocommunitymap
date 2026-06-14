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
    public class CustomFeaturesRepository : ICustomFeaturesRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        public static string? selectedDatabase = "";
        private int? UserCode { get; set; }
        public CustomFeaturesRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }
        public object getCustomFeatures(CustomFeatures customFeatures)
        {
            try
            {
                string sp_name = Procedures.SP_SET_CUSTOM_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("CUSTOM_FEATURES_ID", DbType.Int32, ParameterDirection.Input, customFeatures.CUSTOM_FEATURES_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, customFeatures.PROPERTY_ID);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, customFeatures.DESCRIPTION);
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
        public object createCustomFeatures(CustomFeatures customFeatures)
        {
            try
            {
                string sp_name = Procedures.SP_SET_CUSTOM_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("CUSTOM_FEATURES_ID", DbType.Int32, ParameterDirection.Input, customFeatures.CUSTOM_FEATURES_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, customFeatures.PROPERTY_ID);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, customFeatures.DESCRIPTION);
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
        public object updateCustomFeatures(CustomFeatures customFeatures)
        {
            try
            {
                string sp_name = Procedures.SP_SET_CUSTOM_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("CUSTOM_FEATURES_ID", DbType.Int32, ParameterDirection.Input, customFeatures.CUSTOM_FEATURES_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, customFeatures.PROPERTY_ID);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, customFeatures.DESCRIPTION);
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
        public object deleteCustomFeatures(CustomFeatures customFeatures)
        {
            try
            {
                string sp_name = Procedures.SP_SET_CUSTOM_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("CUSTOM_FEATURES_ID", DbType.Int32, ParameterDirection.Input, customFeatures.CUSTOM_FEATURES_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, customFeatures.PROPERTY_ID);
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
