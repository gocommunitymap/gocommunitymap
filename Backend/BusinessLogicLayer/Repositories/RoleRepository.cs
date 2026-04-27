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
using System.Text.Json;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public RoleRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetRole(RoleMaster role)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROLE.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROLE_CODE", DbType.Int32, ParameterDirection.Input, role.ROLE_CODE);
                dyParam.AddDynamicParams("ROLE_NAME", DbType.String, ParameterDirection.Input, role.ROLE_NAME);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, role.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, role.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object GetRoleMaster(RoleMaster role)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROLE.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROLE_CODE", DbType.Int32, ParameterDirection.Input, role.ROLE_CODE);
                dyParam.AddDynamicParams("ROLE_NAME", DbType.String, ParameterDirection.Input, role.ROLE_NAME);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, role.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, role.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH_M.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public object CreateRole(Role role)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROLE.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROLE_CODE", DbType.Int32, ParameterDirection.Input, role.ROLE_CODE);
                dyParam.AddDynamicParams("ROLE_NAME", DbType.String, ParameterDirection.Input, role.ROLE_NAME);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, role.ACTIVE);
                dyParam.AddDynamicParams("DETAIL", DbType.Int32, ParameterDirection.Input, JsonSerializer.Serialize(role.ROLE_DETAIL));
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, role.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public object UpdateRole(Role role)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROLE.ToString();
                Parameters dyParam = new Parameters();
                dyParam.AddDynamicParams("ROLE_CODE", DbType.Int32, ParameterDirection.Input, role.ROLE_CODE);
                dyParam.AddDynamicParams("ROLE_NAME", DbType.String, ParameterDirection.Input, role.ROLE_NAME);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, role.ACTIVE);
                dyParam.AddDynamicParams("DETAIL", DbType.Int32, ParameterDirection.Input, JsonSerializer.Serialize(role.ROLE_DETAIL));
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, role.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public object DeleteRole(RoleMaster role)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROLE.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROLE_CODE", DbType.Int32, ParameterDirection.Input, role.ROLE_CODE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, role.USER);
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
