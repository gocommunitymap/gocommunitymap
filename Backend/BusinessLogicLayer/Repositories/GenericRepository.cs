using BusinessLogicLayer.Interfaces;
using Dapper;
using DataAccessLayer.Data;
using DataAccessLayer.DBObjects;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Repositories
{
    public class GenericRepository : IGenericRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public GenericRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];

        }
        public object ExecuteProc(string sp_name, String json)
        {
            try
            {
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("data", DbType.Byte, ParameterDirection.Input, json);
                if (selectedDatabase == "ORACLE")
                {
                    dyParam.AddRefCursor("string_out");

                }

                var result = _db.ExecuteProc(sp_name, dyParam);

                return result;
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
