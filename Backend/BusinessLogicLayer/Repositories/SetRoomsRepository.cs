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
using System.Text.Json;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class SetRoomsRepository : ISetRoomsRepository
    {
        private readonly IDataAccess _db;
        private readonly IAppSettingsService _appSettingsService;
        private int? UserCode { get; set; }
        public static string? selectedDatabase = "";

        public SetRoomsRepository(IDataAccess db, IAppSettingsService appSettingsService, IJwtExtractService jwtExtractService)
        {
            _db = db;
            _appSettingsService = appSettingsService;
            UserCode = jwtExtractService.GetUserIdFromToken();
            selectedDatabase = appSettingsService.GetDatabase();
        }

        public object GetRooms(SetRooms setRooms)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROOMS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROOM_ID", DbType.Int32, ParameterDirection.Input, setRooms.ROOM_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setRooms.PROPERTY_ID);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, setRooms.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("BED_TYPE", DbType.Int32, ParameterDirection.Input, setRooms.BED_TYPE);
                dyParam.AddDynamicParams("MAX_GUESTS", DbType.Int32, ParameterDirection.Input, setRooms.MAX_GUESTS);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, setRooms.PRICE);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, setRooms.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, setRooms.BATHROOMS_ID);
                dyParam.AddDynamicParams("ROOMS_QUANTITY", DbType.Int32, ParameterDirection.Input, setRooms.ROOMS_QUANTITY);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, setRooms.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, setRooms.UNITS_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, setRooms.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, setRooms.FULLDESCRIPTION);
                dyParam.AddDynamicParams("MEAL_PLAN", DbType.Int32, ParameterDirection.Input, setRooms.MEAL_PLAN);
                dyParam.AddDynamicParams("CANCELLATION_POLICY", DbType.Int32, ParameterDirection.Input, setRooms.CANCELLATION_POLICY);
                dyParam.AddDynamicParams("PETS_ALLOWED", DbType.Boolean, ParameterDirection.Input, setRooms.PETS_ALLOWED);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, setRooms.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, setRooms.LONGITUDE);
                dyParam.AddDynamicParams("PLACE", DbType.String, ParameterDirection.Input, setRooms.PLACE);
                dyParam.AddDynamicParams("MAP_URL", DbType.String, ParameterDirection.Input, setRooms.MAP_URL);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, setRooms.NEW_BUILD);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, setRooms.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, setRooms.ISEXEMPT);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, setRooms.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, setRooms.FURNISHED_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, setRooms.FLOORS_ID);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, setRooms.AVAILABLE_FROM);
                dyParam.AddDynamicParams("STAR_RATING", DbType.Decimal, ParameterDirection.Input, setRooms.STAR_RATING);
                dyParam.AddDynamicParams("CHECK_IN_TIME", DbType.Int32, ParameterDirection.Input, setRooms.CHECK_IN_TIME);
                dyParam.AddDynamicParams("CHECK_OUT_TIME", DbType.Int32, ParameterDirection.Input, setRooms.CHECK_OUT_TIME);
                dyParam.AddDynamicParams("IMPORTANT_INFO", DbType.String, ParameterDirection.Input, setRooms.IMPORTANT_INFO);
                dyParam.AddDynamicParams("ROOM_PICTURE_LINKS", DbType.String, ParameterDirection.Input, setRooms.ROOM_PICTURE_LINKS == null ? null : JsonSerializer.Serialize(setRooms.ROOM_PICTURE_LINKS));
                dyParam.AddDynamicParams("ROOM_FEATURES", DbType.String, ParameterDirection.Input, setRooms.ROOM_FEATURES == null ? null : JsonSerializer.Serialize(setRooms.ROOM_FEATURES));
                dyParam.AddDynamicParams("ROOM_CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, setRooms.ROOM_CUSTOM_FEATURES == null ? null : JsonSerializer.Serialize(setRooms.ROOM_CUSTOM_FEATURES));
                dyParam.AddDynamicParams("ROOM_FAQS", DbType.String, ParameterDirection.Input, setRooms.ROOM_FAQS == null ? null : JsonSerializer.Serialize(setRooms.ROOM_FAQS));
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, setRooms.ACTIVE);
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

        public object CreateRoom(SetRooms setRooms)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROOMS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROOM_ID", DbType.Int32, ParameterDirection.Input, setRooms.ROOM_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setRooms.PROPERTY_ID);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, setRooms.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("BED_TYPE", DbType.Int32, ParameterDirection.Input, setRooms.BED_TYPE);
                dyParam.AddDynamicParams("MAX_GUESTS", DbType.Int32, ParameterDirection.Input, setRooms.MAX_GUESTS);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, setRooms.PRICE);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, setRooms.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, setRooms.BATHROOMS_ID);
                dyParam.AddDynamicParams("ROOMS_QUANTITY", DbType.Int32, ParameterDirection.Input, setRooms.ROOMS_QUANTITY);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, setRooms.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, setRooms.UNITS_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, setRooms.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, setRooms.FULLDESCRIPTION);
                dyParam.AddDynamicParams("MEAL_PLAN", DbType.Int32, ParameterDirection.Input, setRooms.MEAL_PLAN);
                dyParam.AddDynamicParams("CANCELLATION_POLICY", DbType.Int32, ParameterDirection.Input, setRooms.CANCELLATION_POLICY);
                dyParam.AddDynamicParams("PETS_ALLOWED", DbType.Boolean, ParameterDirection.Input, setRooms.PETS_ALLOWED);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, setRooms.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, setRooms.LONGITUDE);
                dyParam.AddDynamicParams("PLACE", DbType.String, ParameterDirection.Input, setRooms.PLACE);
                dyParam.AddDynamicParams("MAP_URL", DbType.String, ParameterDirection.Input, setRooms.MAP_URL);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, setRooms.NEW_BUILD);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, setRooms.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, setRooms.ISEXEMPT);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, setRooms.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, setRooms.FURNISHED_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, setRooms.FLOORS_ID);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, setRooms.AVAILABLE_FROM);
                dyParam.AddDynamicParams("STAR_RATING", DbType.Decimal, ParameterDirection.Input, setRooms.STAR_RATING);
                dyParam.AddDynamicParams("CHECK_IN_TIME", DbType.Int32, ParameterDirection.Input, setRooms.CHECK_IN_TIME);
                dyParam.AddDynamicParams("CHECK_OUT_TIME", DbType.Int32, ParameterDirection.Input, setRooms.CHECK_OUT_TIME);
                dyParam.AddDynamicParams("IMPORTANT_INFO", DbType.String, ParameterDirection.Input, setRooms.IMPORTANT_INFO);
                dyParam.AddDynamicParams("ROOM_PICTURE_LINKS", DbType.String, ParameterDirection.Input, setRooms.ROOM_PICTURE_LINKS == null ? null : JsonSerializer.Serialize(setRooms.ROOM_PICTURE_LINKS));
                dyParam.AddDynamicParams("ROOM_FEATURES", DbType.String, ParameterDirection.Input, setRooms.ROOM_FEATURES == null ? null : JsonSerializer.Serialize(setRooms.ROOM_FEATURES));
                dyParam.AddDynamicParams("ROOM_CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, setRooms.ROOM_CUSTOM_FEATURES == null ? null : JsonSerializer.Serialize(setRooms.ROOM_CUSTOM_FEATURES));
                dyParam.AddDynamicParams("ROOM_FAQS", DbType.String, ParameterDirection.Input, setRooms.ROOM_FAQS == null ? null : JsonSerializer.Serialize(setRooms.ROOM_FAQS));
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, setRooms.ACTIVE);
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

        public object UpdateRoom(SetRooms setRooms)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROOMS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROOM_ID", DbType.Int32, ParameterDirection.Input, setRooms.ROOM_ID);
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setRooms.PROPERTY_ID);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, setRooms.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("BED_TYPE", DbType.Int32, ParameterDirection.Input, setRooms.BED_TYPE);
                dyParam.AddDynamicParams("MAX_GUESTS", DbType.Int32, ParameterDirection.Input, setRooms.MAX_GUESTS);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, setRooms.PRICE);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, setRooms.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, setRooms.BATHROOMS_ID);
                dyParam.AddDynamicParams("ROOMS_QUANTITY", DbType.Int32, ParameterDirection.Input, setRooms.ROOMS_QUANTITY);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, setRooms.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, setRooms.UNITS_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, setRooms.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, setRooms.FULLDESCRIPTION);
                dyParam.AddDynamicParams("MEAL_PLAN", DbType.Int32, ParameterDirection.Input, setRooms.MEAL_PLAN);
                dyParam.AddDynamicParams("CANCELLATION_POLICY", DbType.Int32, ParameterDirection.Input, setRooms.CANCELLATION_POLICY);
                dyParam.AddDynamicParams("PETS_ALLOWED", DbType.Boolean, ParameterDirection.Input, setRooms.PETS_ALLOWED);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, setRooms.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, setRooms.LONGITUDE);
                dyParam.AddDynamicParams("PLACE", DbType.String, ParameterDirection.Input, setRooms.PLACE);
                dyParam.AddDynamicParams("MAP_URL", DbType.String, ParameterDirection.Input, setRooms.MAP_URL);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, setRooms.NEW_BUILD);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, setRooms.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, setRooms.ISEXEMPT);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, setRooms.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, setRooms.FURNISHED_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, setRooms.FLOORS_ID);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, setRooms.AVAILABLE_FROM);
                dyParam.AddDynamicParams("STAR_RATING", DbType.Decimal, ParameterDirection.Input, setRooms.STAR_RATING);
                dyParam.AddDynamicParams("CHECK_IN_TIME", DbType.Int32, ParameterDirection.Input, setRooms.CHECK_IN_TIME);
                dyParam.AddDynamicParams("CHECK_OUT_TIME", DbType.Int32, ParameterDirection.Input, setRooms.CHECK_OUT_TIME);
                dyParam.AddDynamicParams("IMPORTANT_INFO", DbType.String, ParameterDirection.Input, setRooms.IMPORTANT_INFO);
                dyParam.AddDynamicParams("ROOM_PICTURE_LINKS", DbType.String, ParameterDirection.Input, setRooms.ROOM_PICTURE_LINKS == null ? null : JsonSerializer.Serialize(setRooms.ROOM_PICTURE_LINKS));
                dyParam.AddDynamicParams("ROOM_FEATURES", DbType.String, ParameterDirection.Input, setRooms.ROOM_FEATURES == null ? null : JsonSerializer.Serialize(setRooms.ROOM_FEATURES));
                dyParam.AddDynamicParams("ROOM_CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, setRooms.ROOM_CUSTOM_FEATURES == null ? null : JsonSerializer.Serialize(setRooms.ROOM_CUSTOM_FEATURES));
                dyParam.AddDynamicParams("ROOM_FAQS", DbType.String, ParameterDirection.Input, setRooms.ROOM_FAQS == null ? null : JsonSerializer.Serialize(setRooms.ROOM_FAQS));
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, setRooms.ACTIVE);
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

        public object DeleteRoom(SetRooms setRooms)
        {
            try
            {
                string sp_name = Procedures.SP_SET_ROOMS.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("ROOM_ID", DbType.Int32, ParameterDirection.Input, setRooms.ROOM_ID);
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
