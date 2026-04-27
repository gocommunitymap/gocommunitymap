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
    public class NewsRepository : INewsRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public NewsRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetNews(News NewsData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NEWS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NEWS_ID", DbType.Int32, ParameterDirection.Input, NewsData.NEWS_ID);
                dyParam.AddDynamicParams("NEWS_TITLE", DbType.String, ParameterDirection.Input, NewsData.NEWS_TITLE);
                dyParam.AddDynamicParams("NEWS_DATE", DbType.DateTime, ParameterDirection.Input, NewsData.NEWS_DATE);
                dyParam.AddDynamicParams("SHORT_DESCRIPTION", DbType.String, ParameterDirection.Input, NewsData.SHORT_DESCRIPTION);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, NewsData.PICTURE_LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, NewsData.SORT_ORDER);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, NewsData.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, NewsData.ACTIVE);
                dyParam.AddDynamicParams("ACTIVE_FROM", DbType.DateTime, ParameterDirection.Input, NewsData.ACTIVE_FROM);
                dyParam.AddDynamicParams("ACTIVE_TO", DbType.DateTime, ParameterDirection.Input, NewsData.ACTIVE_TO);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, NewsData.DISPLAY_TYPE);
                dyParam.AddDynamicParams("KEY_TAKEAWAYS", DbType.String, ParameterDirection.Input, NewsData.KEY_TAKEAWAYS);
                dyParam.AddDynamicParams("LONG_DESCRIPTION", DbType.String, ParameterDirection.Input, NewsData.LONG_DESCRIPTION);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, NewsData.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());
                
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object GetNewsWithDetail(News NewsData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NEWS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NEWS_ID", DbType.Int32, ParameterDirection.Input, NewsData.NEWS_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, NewsData.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH2.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public object CreateNews(News NewsData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NEWS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NEWS_ID", DbType.Int32, ParameterDirection.Input, NewsData.NEWS_ID);
                dyParam.AddDynamicParams("NEWS_TITLE", DbType.String, ParameterDirection.Input, NewsData.NEWS_TITLE);
                dyParam.AddDynamicParams("NEWS_DATE", DbType.DateTime, ParameterDirection.Input, NewsData.NEWS_DATE);
                dyParam.AddDynamicParams("SHORT_DESCRIPTION", DbType.String, ParameterDirection.Input, NewsData.SHORT_DESCRIPTION);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, NewsData.PICTURE_LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, NewsData.SORT_ORDER);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, NewsData.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, NewsData.ACTIVE);
                dyParam.AddDynamicParams("ACTIVE_FROM", DbType.DateTime, ParameterDirection.Input, NewsData.ACTIVE_FROM);
                dyParam.AddDynamicParams("ACTIVE_TO", DbType.DateTime, ParameterDirection.Input, NewsData.ACTIVE_TO);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, NewsData.DISPLAY_TYPE);
                dyParam.AddDynamicParams("KEY_TAKEAWAYS", DbType.String, ParameterDirection.Input, NewsData.KEY_TAKEAWAYS);
                dyParam.AddDynamicParams("LONG_DESCRIPTION", DbType.String, ParameterDirection.Input, NewsData.LONG_DESCRIPTION);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, NewsData.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public object UpdateNews(News NewsData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NEWS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NEWS_ID", DbType.Int32, ParameterDirection.Input, NewsData.NEWS_ID);
                dyParam.AddDynamicParams("NEWS_TITLE", DbType.String, ParameterDirection.Input, NewsData.NEWS_TITLE);
                dyParam.AddDynamicParams("NEWS_DATE", DbType.DateTime, ParameterDirection.Input, NewsData.NEWS_DATE);
                dyParam.AddDynamicParams("SHORT_DESCRIPTION", DbType.String, ParameterDirection.Input, NewsData.SHORT_DESCRIPTION);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, NewsData.PICTURE_LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, NewsData.SORT_ORDER);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, NewsData.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, NewsData.ACTIVE);
                dyParam.AddDynamicParams("ACTIVE_FROM", DbType.DateTime, ParameterDirection.Input, NewsData.ACTIVE_FROM);
                dyParam.AddDynamicParams("ACTIVE_TO", DbType.DateTime, ParameterDirection.Input, NewsData.ACTIVE_TO);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, NewsData.DISPLAY_TYPE);
                dyParam.AddDynamicParams("KEY_TAKEAWAYS", DbType.String, ParameterDirection.Input, NewsData.KEY_TAKEAWAYS);
                dyParam.AddDynamicParams("LONG_DESCRIPTION", DbType.String, ParameterDirection.Input, NewsData.LONG_DESCRIPTION);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, NewsData.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public object DeleteNews(News NewsData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NEWS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("NEWS_ID", DbType.Int32, ParameterDirection.Input, NewsData.NEWS_ID);

                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, NewsData.USER);
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
