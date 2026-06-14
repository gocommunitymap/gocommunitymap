using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class NavbarRepository : INavbarRepository
    {

        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";

        public NavbarRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }

        public object GetNavbar(Navbar navbarData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NAVBAR.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NAV_ID", DbType.Int32, ParameterDirection.Input, navbarData.NAV_ID);
                dyParam.AddDynamicParams("NAV_DESCRIPTION", DbType.String, ParameterDirection.Input, navbarData.NAV_DESCRIPTION);
                dyParam.AddDynamicParams("LINK", DbType.String, ParameterDirection.Input, navbarData.LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, navbarData.SORT_ORDER);
                dyParam.AddDynamicParams("TYPE", DbType.Int32, ParameterDirection.Input, navbarData.TYPE);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, navbarData.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, navbarData.ACTIVE);

                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, UserCode);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return  _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public object CreateNavbar(Navbar navbarData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NAVBAR.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NAV_ID", DbType.Int32, ParameterDirection.Input, navbarData.NAV_ID);
                dyParam.AddDynamicParams("NAV_DESCRIPTION", DbType.String, ParameterDirection.Input, navbarData.NAV_DESCRIPTION);
                dyParam.AddDynamicParams("LINK", DbType.String, ParameterDirection.Input, navbarData.LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, navbarData.SORT_ORDER);
                dyParam.AddDynamicParams("TYPE", DbType.Int32, ParameterDirection.Input, navbarData.TYPE);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, navbarData.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, navbarData.ACTIVE);

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
        public object UpdateNavbar(Navbar navbarData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NAVBAR.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NAV_ID", DbType.Int32, ParameterDirection.Input, navbarData.NAV_ID);
                dyParam.AddDynamicParams("NAV_DESCRIPTION", DbType.String, ParameterDirection.Input, navbarData.NAV_DESCRIPTION);
                dyParam.AddDynamicParams("LINK", DbType.String, ParameterDirection.Input, navbarData.LINK);
                dyParam.AddDynamicParams("SORT_ORDER", DbType.Int32, ParameterDirection.Input, navbarData.SORT_ORDER);
                dyParam.AddDynamicParams("TYPE", DbType.Int32, ParameterDirection.Input, navbarData.TYPE);
                dyParam.AddDynamicParams("ICON", DbType.String, ParameterDirection.Input, navbarData.ICON);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, navbarData.ACTIVE);

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
        public object DeleteNavbar(Navbar navbarData)
        {
            try
            {
                string sp_name = Procedures.SP_SET_NAVBAR.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("NAV_ID", DbType.Int32, ParameterDirection.Input, navbarData.NAV_ID);

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
