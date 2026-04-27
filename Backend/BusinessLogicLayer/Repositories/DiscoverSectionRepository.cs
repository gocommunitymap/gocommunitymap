using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class DiscoverSectionRepository : IDiscoverSectionRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public DiscoverSectionRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetDiscoverSection(DiscoverSectionMaster discoverSection)
        {
            try
            {
                string sp_name = Procedures.SP_SET_DISCOVER_SECTION.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("DISCOVER_SECTION_ID", DbType.Int32, ParameterDirection.Input, discoverSection.DISCOVER_SECTION_ID);
                dyParam.AddDynamicParams("SECTION_TYPE", DbType.Int32, ParameterDirection.Input, discoverSection.SECTION_TYPE);
                dyParam.AddDynamicParams("SECTION_SUB_TYPE", DbType.Int32, ParameterDirection.Input, discoverSection.SECTION_SUB_TYPE);
                dyParam.AddDynamicParams("SECTION_TITLE", DbType.String, ParameterDirection.Input, discoverSection.SECTION_TITLE);
                dyParam.AddDynamicParams("SECTION_SUBTITLE", DbType.String, ParameterDirection.Input, discoverSection.SECTION_SUBTITLE);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, discoverSection.PICTURE_LINK);
                dyParam.AddDynamicParams("SORT_ORDER_M", DbType.Int32, ParameterDirection.Input, discoverSection.SORT_ORDER_M);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, discoverSection.DISPLAY_TYPE);
                dyParam.AddDynamicParams("ACTIVE_M", DbType.Boolean, ParameterDirection.Input, discoverSection.ACTIVE_M);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, discoverSection.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object CreateDiscoverSection(DiscoverSection discoverSection)
        {
            try
            {
                string sp_name = Procedures.SP_SET_DISCOVER_SECTION.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("DISCOVER_SECTION_ID", DbType.Int32, ParameterDirection.Input, discoverSection.DISCOVER_SECTION_ID);
                dyParam.AddDynamicParams("SECTION_TYPE", DbType.Int32, ParameterDirection.Input, discoverSection.SECTION_TYPE);
                dyParam.AddDynamicParams("SECTION_SUB_TYPE", DbType.Int32, ParameterDirection.Input, discoverSection.SECTION_SUB_TYPE);
                dyParam.AddDynamicParams("SECTION_TITLE", DbType.String, ParameterDirection.Input, discoverSection.SECTION_TITLE);
                dyParam.AddDynamicParams("SECTION_SUBTITLE", DbType.String, ParameterDirection.Input, discoverSection.SECTION_SUBTITLE);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, discoverSection.PICTURE_LINK);
                dyParam.AddDynamicParams("SORT_ORDER_M", DbType.Int32, ParameterDirection.Input, discoverSection.SORT_ORDER_M);
                dyParam.AddDynamicParams("ACTIVE_M", DbType.Boolean, ParameterDirection.Input, discoverSection.ACTIVE_M);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, discoverSection.DISPLAY_TYPE);
                dyParam.AddDynamicParams("DETAIL", DbType.Int32, ParameterDirection.Input, JsonSerializer.Serialize(discoverSection.DISCOVER_SECTION_DETAIL));
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, discoverSection.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public object UpdateDiscoverSection(DiscoverSection discoverSection)
        {
            try
            {
                string sp_name = Procedures.SP_SET_DISCOVER_SECTION.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("DISCOVER_SECTION_ID", DbType.Int32, ParameterDirection.Input, discoverSection.DISCOVER_SECTION_ID);
                dyParam.AddDynamicParams("SECTION_TYPE", DbType.Int32, ParameterDirection.Input, discoverSection.SECTION_TYPE);
                dyParam.AddDynamicParams("SECTION_SUB_TYPE", DbType.Int32, ParameterDirection.Input, discoverSection.SECTION_SUB_TYPE);
                dyParam.AddDynamicParams("SECTION_TITLE", DbType.String, ParameterDirection.Input, discoverSection.SECTION_TITLE);
                dyParam.AddDynamicParams("SECTION_SUBTITLE", DbType.String, ParameterDirection.Input, discoverSection.SECTION_SUBTITLE);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, discoverSection.PICTURE_LINK);
                dyParam.AddDynamicParams("SORT_ORDER_M", DbType.Int32, ParameterDirection.Input, discoverSection.SORT_ORDER_M);
                dyParam.AddDynamicParams("ACTIVE_M", DbType.Boolean, ParameterDirection.Input, discoverSection.ACTIVE_M);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, discoverSection.DISPLAY_TYPE);
                dyParam.AddDynamicParams("DETAIL", DbType.Int32, ParameterDirection.Input, JsonSerializer.Serialize(discoverSection.DISCOVER_SECTION_DETAIL));
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, discoverSection.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public object DeleteDiscoverSection(DiscoverSectionMaster discoverSection)
        {
            try
            {
                string sp_name = Procedures.SP_SET_DISCOVER_SECTION.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("DISCOVER_SECTION_ID", DbType.Int32, ParameterDirection.Input, discoverSection.DISCOVER_SECTION_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, discoverSection.USER);
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
