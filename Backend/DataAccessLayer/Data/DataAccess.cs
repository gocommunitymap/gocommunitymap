using Dapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataAccessLayer.Data
{
    public class DataAccess : IDataAccess
    {

        private static object _lock = new object();
        private string _logPath = ".";
        private string _logFile = "logfile.log";
        private string fileName = "LOG_" + DateTime.Today.ToString("ddMMyyyy") + ".txt";
        private int _logLevel = 0;

        private readonly IConfiguration _configuration;
        public static string selectedDatabase = "";
        public static string connectionString = "";
        private static string Key = "";

        public void Add(string user, string source, string entry)
        {
            var isLog = _configuration["Logging:isLog"];
            if (isLog == "N")
            {
                return;
            }
            var filePath = _configuration["Logging:log_dir"];
            //_logPath = Path.Combine(Directory.GetCurrentDirectory(), "Logs", fileName); //filePath + @"\" + fileName;
            _logPath = Path.Combine(Directory.GetCurrentDirectory(), "Logs", fileName); //filePath + @"\" + fileName;

            //create log file in filePath if it doesnt exist
            if (!File.Exists(_logPath))
            {
                Directory.CreateDirectory(_logPath.Substring(0, _logPath.LastIndexOf(@"\")));
                var fs = File.Create(_logPath);
                fs.Close();
            }

            var dtNow = DateTime.Now.ToString("yyyyMMddHHmmss");
            string contents = dtNow + " " + user + " " + source + " " + entry;

            Debug.WriteLine(dtNow + " " + contents);

            lock (_lock)
            {
                File.AppendAllText(_logPath, contents + Environment.NewLine);
            }
        }
        public DataAccess(IConfiguration configuration)
        {
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
            Key = _configuration["Jwt:ENC3"];
        }
        public string Decrypt(string cipherText, string Key1)
        {
            int keyLength = _configuration["Jwt:ENC2"].ToString().Count();
            string newKey = _configuration["Jwt:ENC2"].ToString().Substring(0, keyLength - Key1.Count());
            string Key2 = newKey + Key1;

            byte[] initializationVector = Encoding.ASCII.GetBytes(Key1);
            byte[] buffer = Convert.FromBase64String(cipherText);
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(Key2);
                aes.IV = initializationVector;
                var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using (var memoryStream = new MemoryStream(buffer))
                {
                    using (var cryptoStream = new CryptoStream(memoryStream as Stream,
                        decryptor, CryptoStreamMode.Read))
                    {
                        using (var streamReader = new StreamReader(cryptoStream as Stream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

        public string SelectedDatabase { get { return selectedDatabase; } }

        public async Task<IEnumerable<T>> Query<T, P>(string query, P Paramerters)
        {
            using IDbConnection connection = GetConnection();

            var data = await connection.QueryAsync<T>(query, Paramerters);
            return data;
        }
        public async Task<IEnumerable<T>> ExecuteProc<T, P>(string query, P Paramerters)
        {
            using IDbConnection connection = GetConnection();

            var data = await connection.QueryAsync<T>(query, Paramerters);
            return data;
        }

        public object Query(string query)
        {
            using IDbConnection connection = GetConnection();

            object data = SqlMapper.Query(connection, query);
            return data;
        }
        public object ExecuteProc(string query, Parameters parameters)
        {
            object result = null;

            using IDbConnection connection = GetConnection();
            try
            {

                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }

                if (connection.State == ConnectionState.Open)
                {
                    result = SqlMapper.Query(connection, query, param: parameters, commandType: CommandType.StoredProcedure);

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }
            return result;
        }
        public List<dynamic> ExecuteProcDT(string query, Parameters parameters)
        {
            List<dynamic> result = new List<dynamic>();

            using IDbConnection connection = GetConnection();
            try
            {
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }

                if (connection.State == ConnectionState.Open)
                {
                    result = SqlMapper.Query(connection, query, param: parameters, commandType: CommandType.StoredProcedure).ToList();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }
            return result;
        }
        public bool isError(List<dynamic> data)
        {
            try
            {

                foreach (var row in data)
                {
                    if (row.ERROR != null && (row.ERROR as string).Length > 0)
                        return true;
                    break;

                }
                return false;
            }
            catch (Exception)
            {

                return false;
            }
        }
        public object ExecuteProcUser(string query, Parameters parameters)
        {
            using IDbConnection connection = GetConnection();
            Models.User item = new Models.User();
            try
            {
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }
                
                if (connection.State == ConnectionState.Open)
                {
                    List<Models.User> items = new List<Models.User>();
                    var data = SqlMapper.Query(connection, query, param: parameters, commandType: CommandType.StoredProcedure).ToList();
                    if (isError(data))
                    {
                        Models.Message msg = new Models.Message();

                        foreach (var row in data)
                        {
                            msg.CODE = row.CODE;
                            msg.ERROR = row.ERROR;
                        }
                        return msg;

                    }
                    else
                    {
                        foreach (var row in data)
                        {
                            item.user_code = row.USER_CODE;
                            item.email = row.EMAIL;
                            item.contact_no = row.CONTACT_NO;
                            item.user_name = row.USER_NAME;
                            item.role_code = row.ROLE_CODE;
                            item.role_name = row.ROLE_NAME;
                            item.user_type = row.USER_TYPE;
                            item.ip_address = row.IP_ADDRESS;
                            item.host_name = row.HOST_NAME;
                            item.login_time = row.LOGIN_TIME;
                            item.logout_time = row.LOGOUT_TIME;
                            item.token_expiry = row.TOKEN_EXPIRY;
                            item.status = row.STATUS;
                            items.Add(item);
                        }
                    }
                }
                return item;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }
        }
        public object ExecuteProc(string query)
        {
            object result = null;
            using IDbConnection connection = GetConnection();
            try
            {
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }

                if (connection.State == ConnectionState.Open)
                {
                    result = SqlMapper.Query(connection, query, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return result;
        }
        public IDbConnection GetConnection()
        {
            if (selectedDatabase == "ORACLE")
            {
                connectionString = Decrypt(_configuration.GetConnectionString("ORASQL_CONNECTION_STRINGS"), Key);
                var conn = new OracleConnection(connectionString);
                return conn;

            }
            else
            {
                connectionString = Decrypt(_configuration.GetConnectionString("MSSQL_CONNECTION_STRINGS"), Key);

                var conn = new SqlConnection(connectionString);
                return conn;
            }
        }
    }
}
