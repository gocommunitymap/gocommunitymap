using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace DataAccessLayer.Interface
{
    public interface IParameters
    {
        public string? SelectedDB { get; set; }

        public void AddDynamicParams(string name, DbType dbType, ParameterDirection direction, object value = null);
        public void AddRefCursor(string name);
        public void Add(string name, OracleDbType oracleDbType, ParameterDirection direction, object value = null, int? size = null);
        public void Add(string name, OracleDbType oracleDbType, ParameterDirection direction);
        public void Add(string name, object value);
    }
}
