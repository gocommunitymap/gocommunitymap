using Dapper;
using DataAccessLayer.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Interface
{
    public interface IDataAccess
    {
        public string SelectedDatabase { get; }
        public Task<IEnumerable<T>> Query<T, P>(string query, P Paramerters);
        public Task<IEnumerable<T>> ExecuteProc<T, P>(string query, P Paramerters);
        public object ExecuteProcUser(string query, Parameters parameters);
        public object Query(string query);
        public object ExecuteProc(string query, Parameters parameters);
        public object ExecuteProc(string query);
        public List<dynamic> ExecuteProcDT(string query, Parameters parameters);

        public IDbConnection 
            GetConnection();

    }
}
