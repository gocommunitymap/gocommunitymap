using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
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
    public class CommunitiesRepository : ICommunitiesRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";

        public CommunitiesRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }
        public object GetCommunities(Communities communities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_COMMUNITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("COMMUNITY_ID", DbType.Int32, ParameterDirection.Input, communities.COMMUNITY_ID);
                dyParam.AddDynamicParams("COMMUNITY_NAME", DbType.String, ParameterDirection.Input, communities.COMMUNITY_NAME);
                dyParam.AddDynamicParams("LOCATION", DbType.String, ParameterDirection.Input, communities.LOCATION);
                dyParam.AddDynamicParams("MEMBERS", DbType.String, ParameterDirection.Input, communities.MEMBERS);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, communities.PICTURE_LINK);
                dyParam.AddDynamicParams("REGION", DbType.String, ParameterDirection.Input, communities.REGION);
                dyParam.AddDynamicParams("COUNTRY_CODE", DbType.String, ParameterDirection.Input, communities.COUNTRY_CODE);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, communities.ACTIVE);
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
        public object CreateCommunities(Communities communities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_COMMUNITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("COMMUNITY_ID", DbType.Int32, ParameterDirection.Input, communities.COMMUNITY_ID);
                dyParam.AddDynamicParams("COMMUNITY_NAME", DbType.String, ParameterDirection.Input, communities.COMMUNITY_NAME);
                dyParam.AddDynamicParams("LOCATION", DbType.String, ParameterDirection.Input, communities.LOCATION);
                dyParam.AddDynamicParams("MEMBERS", DbType.String, ParameterDirection.Input, communities.MEMBERS);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, communities.PICTURE_LINK);
                dyParam.AddDynamicParams("REGION", DbType.String, ParameterDirection.Input, communities.REGION);
                dyParam.AddDynamicParams("COUNTRY_CODE", DbType.String, ParameterDirection.Input, communities.COUNTRY_CODE);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, communities.ACTIVE);
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
        public object UpdateCommunities(Communities communities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_COMMUNITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("COMMUNITY_ID", DbType.Int32, ParameterDirection.Input, communities.COMMUNITY_ID);
                dyParam.AddDynamicParams("COMMUNITY_NAME", DbType.String, ParameterDirection.Input, communities.COMMUNITY_NAME);
                dyParam.AddDynamicParams("LOCATION", DbType.String, ParameterDirection.Input, communities.LOCATION);
                dyParam.AddDynamicParams("MEMBERS", DbType.String, ParameterDirection.Input, communities.MEMBERS);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, communities.PICTURE_LINK);
                dyParam.AddDynamicParams("REGION", DbType.String, ParameterDirection.Input, communities.REGION);
                dyParam.AddDynamicParams("COUNTRY_CODE", DbType.String, ParameterDirection.Input, communities.COUNTRY_CODE);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, communities.ACTIVE);
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
        public object DeleteCommunities(Communities communities)
        {
            try
            {
                string sp_name = Procedures.SP_SET_COMMUNITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("COMMUNITY_ID", DbType.Int32, ParameterDirection.Input, communities.COMMUNITY_ID);
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

        public object GetCommunitiesMemberList()
        {
            try
            {
                string sp_name = Procedures.SP_SET_COMMUNITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.ACTION1.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object UpdateCommunitiesMemberList(int? COMMUNITY_ID,bool? ACTIVE)
        {
            try
            {
                string sp_name = Procedures.SP_SET_COMMUNITIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("COMMUNITY_ID", DbType.Int32, ParameterDirection.Input, COMMUNITY_ID);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.ACTION2.ToString());

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
