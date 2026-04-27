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
    public class UtilitiesRepository:IUtilitiesRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public UtilitiesRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetUtilities(Utilities utilities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_UTILITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UTILITY_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_ID);
                dyParam.AddDynamicParams("UTILITIES", DbType.String, ParameterDirection.Input, utilities.UTILITIES);
                dyParam.AddDynamicParams("UTILITY_TYPE_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_TYPE_ID);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, utilities.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, utilities.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object CreateUtilities(Utilities utilities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_UTILITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UTILITY_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_ID);
                dyParam.AddDynamicParams("UTILITIES", DbType.String, ParameterDirection.Input, utilities.UTILITIES);
                dyParam.AddDynamicParams("UTILITY_TYPE_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_TYPE_ID);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, utilities.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, utilities.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object UpdateUtilities(Utilities utilities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_UTILITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UTILITY_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_ID);
                dyParam.AddDynamicParams("UTILITIES", DbType.Int32, ParameterDirection.Input, utilities.UTILITIES);
                dyParam.AddDynamicParams("UTILITY_TYPE_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_TYPE_ID);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, utilities.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, utilities.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public object DeleteUtilities(Utilities utilities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_UTILITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("UTILITY_ID", DbType.Int32, ParameterDirection.Input, utilities.UTILITY_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, utilities.USER);
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
