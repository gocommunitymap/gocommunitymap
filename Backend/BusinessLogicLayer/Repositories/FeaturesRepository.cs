using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class FeaturesRepository:IFeaturesRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public FeaturesRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetFeatures(Features features)
        {
            try
            {
                string sp_name = Procedures.SP_SET_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("FEATURES_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_ID);
                dyParam.AddDynamicParams("FEATURES", DbType.String, ParameterDirection.Input, features.FEATURES);
                dyParam.AddDynamicParams("FEATURES_TYPE_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_TYPE_ID);
                dyParam.AddDynamicParams("IS_HIGHLIGHTED", DbType.Boolean, ParameterDirection.Input, features.IS_HIGHLIGHTED);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, features.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, features.ACTIVE);
                dyParam.AddDynamicParams("TYPE", DbType.Int32, ParameterDirection.Input, features.TYPE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, features.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object CreateFeatures(Features features)
        {
            try
            {
                string sp_name = Procedures.SP_SET_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("FEATURES_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_ID);
                dyParam.AddDynamicParams("FEATURES", DbType.String, ParameterDirection.Input, features.FEATURES);
                dyParam.AddDynamicParams("FEATURES_TYPE_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_TYPE_ID);
                dyParam.AddDynamicParams("IS_HIGHLIGHTED", DbType.Boolean, ParameterDirection.Input, features.IS_HIGHLIGHTED);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, features.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, features.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, features.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object UpdateFeatures(Features features)
        {
            try
            {
                string sp_name = Procedures.SP_SET_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("FEATURES_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_ID);
                dyParam.AddDynamicParams("FEATURES", DbType.Int32, ParameterDirection.Input, features.FEATURES);
                dyParam.AddDynamicParams("FEATURES_TYPE_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_TYPE_ID);
                dyParam.AddDynamicParams("IS_HIGHLIGHTED", DbType.Boolean, ParameterDirection.Input, features.IS_HIGHLIGHTED);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, features.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, features.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, features.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object DeleteFeatures(Features features)
        {
            try
            {
                string sp_name = Procedures.SP_SET_FEATURES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("FEATURES_ID", DbType.Int32, ParameterDirection.Input, features.FEATURES_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, features.USER);
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
