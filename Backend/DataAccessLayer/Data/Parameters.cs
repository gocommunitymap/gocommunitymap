using Dapper;
using DataAccessLayer.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
using System.Configuration;
using System.Data;
using System.Diagnostics;

namespace DataAccessLayer.Data
{
    public class Parameters : IParameters, SqlMapper.IDynamicParameters
    {
        private readonly DynamicParameters dynamicParameters = new DynamicParameters();
        private readonly List<OracleParameter> oracleParameters = new List<OracleParameter>();
        private readonly List<SqlParameter> sqlParameters = new List<SqlParameter>();
        

        private static OracleDbType GetOracleDbType(object o)
        {

            if (o.ToString() == "String") return OracleDbType.Varchar2;
            if (o.ToString() == "DateTime") return OracleDbType.Date;
            if (o.ToString() == "Date") return OracleDbType.Date;
            if (o.ToString() == "Int64") return OracleDbType.Int64;
            if (o.ToString() == "Int32") return OracleDbType.Int32;
            if (o.ToString() == "Int16") return OracleDbType.Int16;
            if (o.ToString() == "SByte") return OracleDbType.Byte;
            if (o.ToString() == "byte") return OracleDbType.Int16;
            if (o.ToString() == "Decimal") return OracleDbType.Decimal;
            if (o.ToString() == "Float") return OracleDbType.Single;
            if (o.ToString() == "Double") return OracleDbType.Double;
            if (o.ToString() == "Byte") return OracleDbType.Clob;

            return OracleDbType.Varchar2;
        }
        public string? SelectedDB { get; set; }

        public void AddDynamicParams(string name, DbType dbType, ParameterDirection direction, object value = null)
        {
            if (SelectedDB == "ORACLE")
            {
                Add(name, GetOracleDbType(dbType), direction, value);
            }
            else
            {
                //name = "@" + name;
                Add(name, value == null ? DBNull.Value : value);
            }
        }
        public void AddRefCursor(string name)
        {
            if (SelectedDB == "ORACLE")
            {
                Add(name, OracleDbType.RefCursor, ParameterDirection.Output);
            }
        }
        public void Add(string name, OracleDbType oracleDbType, ParameterDirection direction, object value = null, int? size = null)
        {
            OracleParameter oracleParameter;
            if (size.HasValue)
            {
                oracleParameter = new OracleParameter(name, oracleDbType, size.Value, value, direction);
            }
            else
            {
                oracleParameter = new OracleParameter(name, oracleDbType, value, direction);
            }

            oracleParameters.Add(oracleParameter);
        }
        public void Add(string name, OracleDbType oracleDbType, ParameterDirection direction)
        {
            var oracleParameter = new OracleParameter(name, oracleDbType, direction);
            oracleParameters.Add(oracleParameter);
        }
        public void Add(string name, object value)
        {
            var sqlParameter = new SqlParameter(name, value);
            sqlParameters.Add(sqlParameter);
        }

        public void AddParameters(IDbCommand command, SqlMapper.Identity identity)
        {
            ((SqlMapper.IDynamicParameters)dynamicParameters).AddParameters(command, identity);
            if (SelectedDB == "ORACLE")
            {
                var CMD = command as OracleCommand;
                if (CMD != null)
                {
                    CMD.Parameters.AddRange(oracleParameters.ToArray());
                }
            }
            else
            {
                var CMD = command as SqlCommand;
                if (CMD != null)
                {
                    CMD.Parameters.AddRange(sqlParameters.ToArray());
                }
            }
        }
    }
}
