using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
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
    public class SectionRepository: ISectionRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";

        public SectionRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }
        public object GetSections(Sections SectionData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_SECTIONS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("SECTION_ID", DbType.Int32, ParameterDirection.Input, SectionData.SECTION_ID);
                dyParam.AddDynamicParams("SECTION_TITLE", DbType.String, ParameterDirection.Input, SectionData.SECTION_TITLE);
                dyParam.AddDynamicParams("HEADING", DbType.String, ParameterDirection.Input, SectionData.HEADING);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, SectionData.DESCRIPTION);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, SectionData.PICTURE_LINK);
                dyParam.AddDynamicParams("MORE_BUTTON_TEXT", DbType.String, ParameterDirection.Input, SectionData.MORE_BUTTON_TEXT);
                dyParam.AddDynamicParams("MORE_BUTTON_LINK", DbType.String, ParameterDirection.Input, SectionData.MORE_BUTTON_LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, SectionData.SORT_ORDER);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, SectionData.ICON);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, SectionData.DISPLAY_TYPE);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, SectionData.ACTIVE);
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
        public object CreateSection(Sections SectionData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_SECTIONS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("SECTION_ID", DbType.Int32, ParameterDirection.Input, SectionData.SECTION_ID);
                dyParam.AddDynamicParams("SECTION_TITLE", DbType.String, ParameterDirection.Input, SectionData.SECTION_TITLE);
                dyParam.AddDynamicParams("HEADING", DbType.String, ParameterDirection.Input, SectionData.HEADING);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, SectionData.DESCRIPTION);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, SectionData.PICTURE_LINK);
                dyParam.AddDynamicParams("MORE_BUTTON_TEXT", DbType.String, ParameterDirection.Input, SectionData.MORE_BUTTON_TEXT);
                dyParam.AddDynamicParams("MORE_BUTTON_LINK", DbType.String, ParameterDirection.Input, SectionData.MORE_BUTTON_LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, SectionData.SORT_ORDER);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, SectionData.ICON);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, SectionData.DISPLAY_TYPE);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, SectionData.ACTIVE);
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
        public object UpdateSection(Sections SectionData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_SECTIONS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("SECTION_ID", DbType.Int32, ParameterDirection.Input, SectionData.SECTION_ID);
                dyParam.AddDynamicParams("SECTION_TITLE", DbType.String, ParameterDirection.Input, SectionData.SECTION_TITLE);
                dyParam.AddDynamicParams("HEADING", DbType.String, ParameterDirection.Input, SectionData.HEADING);
                dyParam.AddDynamicParams("DESCRIPTION", DbType.String, ParameterDirection.Input, SectionData.DESCRIPTION);
                dyParam.AddDynamicParams("PICTURE_LINK", DbType.String, ParameterDirection.Input, SectionData.PICTURE_LINK);
                dyParam.AddDynamicParams("MORE_BUTTON_TEXT", DbType.String, ParameterDirection.Input, SectionData.MORE_BUTTON_TEXT);
                dyParam.AddDynamicParams("MORE_BUTTON_LINK", DbType.String, ParameterDirection.Input, SectionData.MORE_BUTTON_LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, SectionData.SORT_ORDER);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, SectionData.ICON);
                dyParam.AddDynamicParams("DISPLAY_TYPE", DbType.String, ParameterDirection.Input, SectionData.DISPLAY_TYPE);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, SectionData.ACTIVE);
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
        public object DeleteSection(Sections SectionData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_SECTIONS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;

                dyParam.AddDynamicParams("SECTION_ID", DbType.Int32, ParameterDirection.Input, SectionData.SECTION_ID);
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
    }
}
