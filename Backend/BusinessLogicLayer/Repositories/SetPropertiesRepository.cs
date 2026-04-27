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
using System.Text.Json;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class setPropertiesRepository : ISetPropertiesRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public setPropertiesRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetProperty(SetProperties setProperties)
        {
            try
            {
                string sp_name = Procedures.SP_SET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("SITE_STATUS_ID", DbType.Int32, ParameterDirection.Input, setProperties.SITE_STATUS_ID);
                dyParam.AddDynamicParams("LISTING_STATUS_ID", DbType.Int32, ParameterDirection.Input, setProperties.LISTING_STATUS_ID);
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, setProperties.FULLPOSTCODE);
                dyParam.AddDynamicParams("PROPERTY_NUM_NAME", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_NUM_NAME);
                dyParam.AddDynamicParams("STREET_NAME", DbType.String, ParameterDirection.Input, setProperties.STREET_NAME);
                dyParam.AddDynamicParams("AREA_TOWN_CITY", DbType.String, ParameterDirection.Input, setProperties.AREA_TOWN_CITY);
                dyParam.AddDynamicParams("OWN_REF", DbType.String, ParameterDirection.Input, setProperties.OWN_REF);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, setProperties.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, setProperties.LONGITUDE);
                dyParam.AddDynamicParams("PLACE", DbType.String, ParameterDirection.Input, setProperties.PLACE);
                dyParam.AddDynamicParams("MAP_URL", DbType.String, ParameterDirection.Input, setProperties.MAP_URL);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, setProperties.NEW_BUILD);
                dyParam.AddDynamicParams("RETIREMENT_HOME", DbType.Boolean, ParameterDirection.Input, setProperties.RETIREMENT_HOME);
                dyParam.AddDynamicParams("SHARED_ACCOMMODATION", DbType.Boolean, ParameterDirection.Input, setProperties.SHARED_ACCOMMODATION);
                dyParam.AddDynamicParams("SHORT_LET", DbType.Boolean, ParameterDirection.Input, setProperties.SHORT_LET);
                dyParam.AddDynamicParams("STUDENT_ACCEPTED", DbType.Boolean, ParameterDirection.Input, setProperties.STUDENT_ACCEPTED);
                dyParam.AddDynamicParams("TENURE_ID", DbType.Int32, ParameterDirection.Input, setProperties.TENURE_ID);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, setProperties.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, setProperties.ISEXEMPT);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, setProperties.PRICE);
                dyParam.AddDynamicParams("PRICE_MODIFIER_ID", DbType.Int32, ParameterDirection.Input, setProperties.PRICE_MODIFIER_ID);
                dyParam.AddDynamicParams("LETTINGS_DEPOSIT_PAYABLE", DbType.Decimal, ParameterDirection.Input, setProperties.LETTINGS_DEPOSIT_PAYABLE);
                dyParam.AddDynamicParams("LETTING_ARRANGEMENTS", DbType.String, ParameterDirection.Input, setProperties.LETTING_ARRANGEMENTS);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, setProperties.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, setProperties.FURNISHED_ID);
                dyParam.AddDynamicParams("RENTAL_FREQUENCY_ID", DbType.Int32, ParameterDirection.Input, setProperties.RENTAL_FREQUENCY_ID);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, setProperties.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BEDROOMS_ID", DbType.Int32, ParameterDirection.Input, setProperties.BEDROOMS_ID);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, setProperties.BATHROOMS_ID);
                dyParam.AddDynamicParams("RECEPTIONS_ID", DbType.Int32, ParameterDirection.Input, setProperties.RECEPTIONS_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, setProperties.FLOORS_ID);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, setProperties.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, setProperties.UNITS_ID);
                dyParam.AddDynamicParams("LISTING_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.LISTING_TYPE_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, setProperties.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, setProperties.FULLDESCRIPTION);
                dyParam.AddDynamicParams("PLANNING_CONSIDERATIONS", DbType.String, ParameterDirection.Input, setProperties.PLANNING_CONSIDERATIONS);
                dyParam.AddDynamicParams("CURRENT_ERR_RATING", DbType.Int32, ParameterDirection.Input, setProperties.CURRENT_ERR_RATING);
                dyParam.AddDynamicParams("POTENTIAL_ERR_RATING", DbType.Int32, ParameterDirection.Input, setProperties.POTENTIAL_ERR_RATING);
                dyParam.AddDynamicParams("CONTENT_FILE_LINK", DbType.String, ParameterDirection.Input, setProperties.CONTENT_FILE_LINK);
                dyParam.AddDynamicParams("CONTENT_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.CONTENT_TYPE_ID);
                dyParam.AddDynamicParams("PICTURE_LINKS", DbType.String, ParameterDirection.Input, setProperties.PICTURE_LINKS == null ? null: JsonSerializer.Serialize(setProperties.PICTURE_LINKS));
                dyParam.AddDynamicParams("CONTENT_TYPE_PICTURE_LINKS", DbType.String, ParameterDirection.Input, setProperties.CONTENT_TYPE_PICTURE_LINKS == null ? null: JsonSerializer.Serialize(setProperties.CONTENT_TYPE_PICTURE_LINKS));
                dyParam.AddDynamicParams("PROPERTY_FEATURES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_FEATURES == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_FEATURES));
                dyParam.AddDynamicParams("PROPERTY_UTILITIES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_UTILITIES == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_UTILITIES));
                dyParam.AddDynamicParams("PROPERTY_UAP", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_UAP == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_UAP));
                dyParam.AddDynamicParams("CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, setProperties.CUSTOM_FEATURES == null ? null: JsonSerializer.Serialize(setProperties.CUSTOM_FEATURES));
                dyParam.AddDynamicParams("PRICE_PER_UNIT", DbType.Decimal, ParameterDirection.Input, setProperties.PRICE_PER_UNIT);
                dyParam.AddDynamicParams("MINIMUM_SIZE", DbType.Int32, ParameterDirection.Input, setProperties.MINIMUM_SIZE);
                dyParam.AddDynamicParams("MAXIMUM_SIZE", DbType.Int32, ParameterDirection.Input, setProperties.MAXIMUM_SIZE);
                dyParam.AddDynamicParams("NON_QUOTING", DbType.Boolean, ParameterDirection.Input, setProperties.NON_QUOTING);
                dyParam.AddDynamicParams("BUSINESS_FOR_SALE", DbType.Int32, ParameterDirection.Input, setProperties.BUSINESS_FOR_SALE);
                dyParam.AddDynamicParams("PROPERTY_MAIN_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_MAIN_TYPE_ID);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, setProperties.AVAILABLE_FROM);

                dyParam.AddDynamicParams("STAR_RATING", DbType.Decimal, ParameterDirection.Input, setProperties.STAR_RATING);
                dyParam.AddDynamicParams("HOTEL_TYPE", DbType.Int32, ParameterDirection.Input, setProperties.HOTEL_TYPE);
                dyParam.AddDynamicParams("CHECK_IN_TIME", DbType.Int32, ParameterDirection.Input, setProperties.CHECK_IN_TIME);
                dyParam.AddDynamicParams("CHECK_OUT_TIME", DbType.Int32, ParameterDirection.Input, setProperties.CHECK_OUT_TIME);
                dyParam.AddDynamicParams("AGENT_NAME", DbType.String, ParameterDirection.Input, setProperties.AGENT_NAME);
                dyParam.AddDynamicParams("AGENT_BIO", DbType.String, ParameterDirection.Input, setProperties.AGENT_BIO);
                dyParam.AddDynamicParams("IMPORTANT_INFO", DbType.String, ParameterDirection.Input, setProperties.IMPORTANT_INFO);
                dyParam.AddDynamicParams("NEARBY_PLACES", DbType.String, ParameterDirection.Input, setProperties.NEARBY_PLACES == null ? null : JsonSerializer.Serialize(setProperties.NEARBY_PLACES));
                dyParam.AddDynamicParams("PROPERTY_RULES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_RULES == null ? null : JsonSerializer.Serialize(setProperties.PROPERTY_RULES));
                dyParam.AddDynamicParams("PROPERTY_FAQS", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_FAQS == null ? null : JsonSerializer.Serialize(setProperties.PROPERTY_FAQS));

                dyParam.AddDynamicParams("POPULAR_REGIONS", DbType.String, ParameterDirection.Input, setProperties.POPULAR_REGIONS == null ? null : string.Join(",", setProperties.POPULAR_REGIONS));
                dyParam.AddDynamicParams("POPULAR_COUNTRIES", DbType.String, ParameterDirection.Input, setProperties.POPULAR_COUNTRIES == null ? null : string.Join(",", setProperties.POPULAR_COUNTRIES));

                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, setProperties.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, setProperties.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object CreateProperty(SetProperties setProperties)
        {
            try
            {
                string sp_name = Procedures.SP_SET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("SITE_STATUS_ID", DbType.Int32, ParameterDirection.Input, setProperties.SITE_STATUS_ID);
                dyParam.AddDynamicParams("LISTING_STATUS_ID", DbType.Int32, ParameterDirection.Input, setProperties.LISTING_STATUS_ID);
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, setProperties.FULLPOSTCODE);
                dyParam.AddDynamicParams("PROPERTY_NUM_NAME", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_NUM_NAME);
                dyParam.AddDynamicParams("STREET_NAME", DbType.String, ParameterDirection.Input, setProperties.STREET_NAME);
                dyParam.AddDynamicParams("AREA_TOWN_CITY", DbType.String, ParameterDirection.Input, setProperties.AREA_TOWN_CITY);
                dyParam.AddDynamicParams("OWN_REF", DbType.String, ParameterDirection.Input, setProperties.OWN_REF);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, setProperties.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, setProperties.LONGITUDE);
                dyParam.AddDynamicParams("PLACE", DbType.String, ParameterDirection.Input, setProperties.PLACE);
                dyParam.AddDynamicParams("MAP_URL", DbType.String, ParameterDirection.Input, setProperties.MAP_URL);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, setProperties.NEW_BUILD);
                dyParam.AddDynamicParams("RETIREMENT_HOME", DbType.Boolean, ParameterDirection.Input, setProperties.RETIREMENT_HOME);
                dyParam.AddDynamicParams("SHARED_ACCOMMODATION", DbType.Boolean, ParameterDirection.Input, setProperties.SHARED_ACCOMMODATION);
                dyParam.AddDynamicParams("SHORT_LET", DbType.Boolean, ParameterDirection.Input, setProperties.SHORT_LET);
                dyParam.AddDynamicParams("STUDENT_ACCEPTED", DbType.Boolean, ParameterDirection.Input, setProperties.STUDENT_ACCEPTED);
                dyParam.AddDynamicParams("TENURE_ID", DbType.Int32, ParameterDirection.Input, setProperties.TENURE_ID);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, setProperties.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, setProperties.ISEXEMPT);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, setProperties.PRICE);
                dyParam.AddDynamicParams("PRICE_MODIFIER_ID", DbType.Int32, ParameterDirection.Input, setProperties.PRICE_MODIFIER_ID);
                dyParam.AddDynamicParams("LETTINGS_DEPOSIT_PAYABLE", DbType.Decimal, ParameterDirection.Input, setProperties.LETTINGS_DEPOSIT_PAYABLE);
                dyParam.AddDynamicParams("LETTING_ARRANGEMENTS", DbType.String, ParameterDirection.Input, setProperties.LETTING_ARRANGEMENTS);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, setProperties.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, setProperties.FURNISHED_ID);
                dyParam.AddDynamicParams("RENTAL_FREQUENCY_ID", DbType.Int32, ParameterDirection.Input, setProperties.RENTAL_FREQUENCY_ID);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, setProperties.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BEDROOMS_ID", DbType.Int32, ParameterDirection.Input, setProperties.BEDROOMS_ID);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, setProperties.BATHROOMS_ID);
                dyParam.AddDynamicParams("RECEPTIONS_ID", DbType.Int32, ParameterDirection.Input, setProperties.RECEPTIONS_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, setProperties.FLOORS_ID);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, setProperties.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, setProperties.UNITS_ID);
                dyParam.AddDynamicParams("LISTING_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.LISTING_TYPE_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, setProperties.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, setProperties.FULLDESCRIPTION);
                dyParam.AddDynamicParams("PLANNING_CONSIDERATIONS", DbType.String, ParameterDirection.Input, setProperties.PLANNING_CONSIDERATIONS);
                dyParam.AddDynamicParams("CURRENT_ERR_RATING", DbType.Int32, ParameterDirection.Input, setProperties.CURRENT_ERR_RATING);
                dyParam.AddDynamicParams("POTENTIAL_ERR_RATING", DbType.Int32, ParameterDirection.Input, setProperties.POTENTIAL_ERR_RATING);
                dyParam.AddDynamicParams("CONTENT_FILE_LINK", DbType.String, ParameterDirection.Input, setProperties.CONTENT_FILE_LINK);
                dyParam.AddDynamicParams("CONTENT_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.CONTENT_TYPE_ID);
                dyParam.AddDynamicParams("PICTURE_LINKS", DbType.String, ParameterDirection.Input, setProperties.PICTURE_LINKS == null ? null: JsonSerializer.Serialize(setProperties.PICTURE_LINKS));
                dyParam.AddDynamicParams("CONTENT_TYPE_PICTURE_LINKS", DbType.String, ParameterDirection.Input, setProperties.CONTENT_TYPE_PICTURE_LINKS == null ? null: JsonSerializer.Serialize(setProperties.CONTENT_TYPE_PICTURE_LINKS));
                dyParam.AddDynamicParams("PROPERTY_FEATURES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_FEATURES == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_FEATURES));
                dyParam.AddDynamicParams("PROPERTY_UTILITIES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_UTILITIES == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_UTILITIES));
                dyParam.AddDynamicParams("PROPERTY_UAP", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_UAP == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_UAP));
                dyParam.AddDynamicParams("CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, setProperties.CUSTOM_FEATURES == null ? null: JsonSerializer.Serialize(setProperties.CUSTOM_FEATURES));
                dyParam.AddDynamicParams("PRICE_PER_UNIT", DbType.Decimal, ParameterDirection.Input, setProperties.PRICE_PER_UNIT);
                dyParam.AddDynamicParams("MINIMUM_SIZE", DbType.Int32, ParameterDirection.Input, setProperties.MINIMUM_SIZE);
                dyParam.AddDynamicParams("MAXIMUM_SIZE", DbType.Int32, ParameterDirection.Input, setProperties.MAXIMUM_SIZE);
                dyParam.AddDynamicParams("NON_QUOTING", DbType.Boolean, ParameterDirection.Input, setProperties.NON_QUOTING);
                dyParam.AddDynamicParams("BUSINESS_FOR_SALE", DbType.Int32, ParameterDirection.Input, setProperties.BUSINESS_FOR_SALE);
                dyParam.AddDynamicParams("PROPERTY_MAIN_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_MAIN_TYPE_ID);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, setProperties.AVAILABLE_FROM);

                dyParam.AddDynamicParams("STAR_RATING", DbType.Decimal, ParameterDirection.Input, setProperties.STAR_RATING);
                dyParam.AddDynamicParams("HOTEL_TYPE", DbType.Int32, ParameterDirection.Input, setProperties.HOTEL_TYPE);
                dyParam.AddDynamicParams("CHECK_IN_TIME", DbType.Int32, ParameterDirection.Input, setProperties.CHECK_IN_TIME);
                dyParam.AddDynamicParams("CHECK_OUT_TIME", DbType.Int32, ParameterDirection.Input, setProperties.CHECK_OUT_TIME);
                dyParam.AddDynamicParams("AGENT_NAME", DbType.String, ParameterDirection.Input, setProperties.AGENT_NAME);
                dyParam.AddDynamicParams("AGENT_BIO", DbType.String, ParameterDirection.Input, setProperties.AGENT_BIO);
                dyParam.AddDynamicParams("IMPORTANT_INFO", DbType.String, ParameterDirection.Input, setProperties.IMPORTANT_INFO);
                dyParam.AddDynamicParams("NEARBY_PLACES", DbType.String, ParameterDirection.Input, setProperties.NEARBY_PLACES == null ? null : JsonSerializer.Serialize(setProperties.NEARBY_PLACES));
                dyParam.AddDynamicParams("PROPERTY_RULES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_RULES == null ? null : JsonSerializer.Serialize(setProperties.PROPERTY_RULES));
                dyParam.AddDynamicParams("PROPERTY_FAQS", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_FAQS == null ? null : JsonSerializer.Serialize(setProperties.PROPERTY_FAQS));

                dyParam.AddDynamicParams("POPULAR_REGIONS", DbType.String, ParameterDirection.Input, setProperties.POPULAR_REGIONS == null ? null : string.Join(",", setProperties.POPULAR_REGIONS));
                dyParam.AddDynamicParams("POPULAR_COUNTRIES", DbType.String, ParameterDirection.Input, setProperties.POPULAR_COUNTRIES == null ? null : string.Join(",", setProperties.POPULAR_COUNTRIES));

                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, setProperties.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, setProperties.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.INSERT.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object UpdateProperty(SetProperties setProperties)
        {
            try
            {
                string sp_name = Procedures.SP_SET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("SITE_STATUS_ID", DbType.Int32, ParameterDirection.Input, setProperties.SITE_STATUS_ID);
                dyParam.AddDynamicParams("LISTING_STATUS_ID", DbType.Int32, ParameterDirection.Input, setProperties.LISTING_STATUS_ID);
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, setProperties.FULLPOSTCODE);
                dyParam.AddDynamicParams("PROPERTY_NUM_NAME", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_NUM_NAME);
                dyParam.AddDynamicParams("STREET_NAME", DbType.String, ParameterDirection.Input, setProperties.STREET_NAME);
                dyParam.AddDynamicParams("AREA_TOWN_CITY", DbType.String, ParameterDirection.Input, setProperties.AREA_TOWN_CITY);
                dyParam.AddDynamicParams("OWN_REF", DbType.String, ParameterDirection.Input, setProperties.OWN_REF);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, setProperties.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, setProperties.LONGITUDE);
                dyParam.AddDynamicParams("PLACE", DbType.String, ParameterDirection.Input, setProperties.PLACE);
                dyParam.AddDynamicParams("MAP_URL", DbType.String, ParameterDirection.Input, setProperties.MAP_URL);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, setProperties.NEW_BUILD);
                dyParam.AddDynamicParams("RETIREMENT_HOME", DbType.Boolean, ParameterDirection.Input, setProperties.RETIREMENT_HOME);
                dyParam.AddDynamicParams("SHARED_ACCOMMODATION", DbType.Boolean, ParameterDirection.Input, setProperties.SHARED_ACCOMMODATION);
                dyParam.AddDynamicParams("SHORT_LET", DbType.Boolean, ParameterDirection.Input, setProperties.SHORT_LET);
                dyParam.AddDynamicParams("STUDENT_ACCEPTED", DbType.Boolean, ParameterDirection.Input, setProperties.STUDENT_ACCEPTED);
                dyParam.AddDynamicParams("TENURE_ID", DbType.Int32, ParameterDirection.Input, setProperties.TENURE_ID);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, setProperties.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, setProperties.ISEXEMPT);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, setProperties.PRICE);
                dyParam.AddDynamicParams("PRICE_MODIFIER_ID", DbType.Int32, ParameterDirection.Input, setProperties.PRICE_MODIFIER_ID);
                dyParam.AddDynamicParams("LETTINGS_DEPOSIT_PAYABLE", DbType.Decimal, ParameterDirection.Input, setProperties.LETTINGS_DEPOSIT_PAYABLE);
                dyParam.AddDynamicParams("LETTING_ARRANGEMENTS", DbType.String, ParameterDirection.Input, setProperties.LETTING_ARRANGEMENTS);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, setProperties.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, setProperties.FURNISHED_ID);
                dyParam.AddDynamicParams("RENTAL_FREQUENCY_ID", DbType.Int32, ParameterDirection.Input, setProperties.RENTAL_FREQUENCY_ID);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, setProperties.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BEDROOMS_ID", DbType.Int32, ParameterDirection.Input, setProperties.BEDROOMS_ID);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, setProperties.BATHROOMS_ID);
                dyParam.AddDynamicParams("RECEPTIONS_ID", DbType.Int32, ParameterDirection.Input, setProperties.RECEPTIONS_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, setProperties.FLOORS_ID);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, setProperties.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, setProperties.UNITS_ID);
                dyParam.AddDynamicParams("LISTING_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.LISTING_TYPE_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, setProperties.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, setProperties.FULLDESCRIPTION);
                dyParam.AddDynamicParams("PLANNING_CONSIDERATIONS", DbType.String, ParameterDirection.Input, setProperties.PLANNING_CONSIDERATIONS);
                dyParam.AddDynamicParams("CURRENT_ERR_RATING", DbType.Int32, ParameterDirection.Input, setProperties.CURRENT_ERR_RATING);
                dyParam.AddDynamicParams("POTENTIAL_ERR_RATING", DbType.Int32, ParameterDirection.Input, setProperties.POTENTIAL_ERR_RATING);
                dyParam.AddDynamicParams("CONTENT_FILE_LINK", DbType.String, ParameterDirection.Input, setProperties.CONTENT_FILE_LINK);
                dyParam.AddDynamicParams("CONTENT_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.CONTENT_TYPE_ID);
                dyParam.AddDynamicParams("PICTURE_LINKS", DbType.String, ParameterDirection.Input, setProperties.PICTURE_LINKS == null ? null: JsonSerializer.Serialize(setProperties.PICTURE_LINKS));
                dyParam.AddDynamicParams("CONTENT_TYPE_PICTURE_LINKS", DbType.String, ParameterDirection.Input, setProperties.CONTENT_TYPE_PICTURE_LINKS == null ? null: JsonSerializer.Serialize(setProperties.CONTENT_TYPE_PICTURE_LINKS));
                dyParam.AddDynamicParams("PROPERTY_FEATURES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_FEATURES == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_FEATURES));
                dyParam.AddDynamicParams("PROPERTY_UTILITIES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_UTILITIES == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_UTILITIES));
                dyParam.AddDynamicParams("PROPERTY_UAP", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_UAP == null ? null: JsonSerializer.Serialize(setProperties.PROPERTY_UAP));
                dyParam.AddDynamicParams("CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, setProperties.CUSTOM_FEATURES == null ? null: JsonSerializer.Serialize(setProperties.CUSTOM_FEATURES));
                dyParam.AddDynamicParams("PRICE_PER_UNIT", DbType.Decimal, ParameterDirection.Input, setProperties.PRICE_PER_UNIT);
                dyParam.AddDynamicParams("MINIMUM_SIZE", DbType.Int32, ParameterDirection.Input, setProperties.MINIMUM_SIZE);
                dyParam.AddDynamicParams("MAXIMUM_SIZE", DbType.Int32, ParameterDirection.Input, setProperties.MAXIMUM_SIZE);
                dyParam.AddDynamicParams("NON_QUOTING", DbType.Boolean, ParameterDirection.Input, setProperties.NON_QUOTING);
                dyParam.AddDynamicParams("BUSINESS_FOR_SALE", DbType.Int32, ParameterDirection.Input, setProperties.BUSINESS_FOR_SALE);
                dyParam.AddDynamicParams("PROPERTY_MAIN_TYPE_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_MAIN_TYPE_ID);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, setProperties.AVAILABLE_FROM);

                dyParam.AddDynamicParams("STAR_RATING", DbType.Decimal, ParameterDirection.Input, setProperties.STAR_RATING);
                dyParam.AddDynamicParams("HOTEL_TYPE", DbType.Int32, ParameterDirection.Input, setProperties.HOTEL_TYPE);
                dyParam.AddDynamicParams("CHECK_IN_TIME", DbType.Int32, ParameterDirection.Input, setProperties.CHECK_IN_TIME);
                dyParam.AddDynamicParams("CHECK_OUT_TIME", DbType.Int32, ParameterDirection.Input, setProperties.CHECK_OUT_TIME);
                dyParam.AddDynamicParams("AGENT_NAME", DbType.String, ParameterDirection.Input, setProperties.AGENT_NAME);
                dyParam.AddDynamicParams("AGENT_BIO", DbType.String, ParameterDirection.Input, setProperties.AGENT_BIO);
                dyParam.AddDynamicParams("IMPORTANT_INFO", DbType.String, ParameterDirection.Input, setProperties.IMPORTANT_INFO);
                dyParam.AddDynamicParams("NEARBY_PLACES", DbType.String, ParameterDirection.Input, setProperties.NEARBY_PLACES == null ? null : JsonSerializer.Serialize(setProperties.NEARBY_PLACES));
                dyParam.AddDynamicParams("PROPERTY_RULES", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_RULES == null ? null : JsonSerializer.Serialize(setProperties.PROPERTY_RULES));
                dyParam.AddDynamicParams("PROPERTY_FAQS", DbType.String, ParameterDirection.Input, setProperties.PROPERTY_FAQS == null ? null : JsonSerializer.Serialize(setProperties.PROPERTY_FAQS));

                dyParam.AddDynamicParams("POPULAR_REGIONS", DbType.String, ParameterDirection.Input, setProperties.POPULAR_REGIONS == null ? null : string.Join(",", setProperties.POPULAR_REGIONS));
                dyParam.AddDynamicParams("POPULAR_COUNTRIES", DbType.String, ParameterDirection.Input, setProperties.POPULAR_COUNTRIES == null ? null : string.Join(",", setProperties.POPULAR_COUNTRIES));

                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, setProperties.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, setProperties.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.UPDATE.ToString());

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public object DeleteProperty(SetProperties setProperties)
        {
            try
            {
                string sp_name = Procedures.SP_SET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, setProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, setProperties.USER);
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
