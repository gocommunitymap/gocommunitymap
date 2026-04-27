using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static BusinessLogicLayer.Config.DatabaseObjects;

namespace BusinessLogicLayer.Repositories
{
    public class GuestRepository:IGuestRepository
    {
        private readonly IDataAccess _db;
        private readonly IConfiguration _configuration;
        public static string? selectedDatabase = "";

        public GuestRepository(IDataAccess db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            selectedDatabase = _configuration["database"];
        }
        public object GetPropertiesFullDetails(GetProperties getProperties, int PAGE_NUMBER, int PAGE_SIZE)
        {
            try
            {
                string sp_name = Procedures.SP_GET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, getProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("SITE_STATUS_ID", DbType.Int32, ParameterDirection.Input, getProperties.SITE_STATUS_ID);
                dyParam.AddDynamicParams("LISTING_STATUS_ID", DbType.Int32, ParameterDirection.Input, getProperties.LISTING_STATUS_ID);
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, getProperties.FULLPOSTCODE);
                dyParam.AddDynamicParams("PROPERTY_NUM_NAME", DbType.String, ParameterDirection.Input, getProperties.PROPERTY_NUM_NAME);
                dyParam.AddDynamicParams("STREET_NAME", DbType.String, ParameterDirection.Input, getProperties.STREET_NAME);
                dyParam.AddDynamicParams("AREA_TOWN_CITY", DbType.String, ParameterDirection.Input, getProperties.AREA_TOWN_CITY);
                dyParam.AddDynamicParams("OWN_REF", DbType.String, ParameterDirection.Input, getProperties.OWN_REF);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, getProperties.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, getProperties.LONGITUDE);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, getProperties.NEW_BUILD);
                dyParam.AddDynamicParams("RETIREMENT_HOME", DbType.Boolean, ParameterDirection.Input, getProperties.RETIREMENT_HOME);
                dyParam.AddDynamicParams("SHARED_ACCOMMODATION", DbType.Boolean, ParameterDirection.Input, getProperties.SHARED_ACCOMMODATION);
                dyParam.AddDynamicParams("SHORT_LET", DbType.Boolean, ParameterDirection.Input, getProperties.SHORT_LET);
                dyParam.AddDynamicParams("STUDENT_ACCEPTED", DbType.Boolean, ParameterDirection.Input, getProperties.STUDENT_ACCEPTED);
                dyParam.AddDynamicParams("TENURE_ID", DbType.Int32, ParameterDirection.Input, getProperties.TENURE_ID);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, getProperties.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, getProperties.ISEXEMPT);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, getProperties.PRICE);
                dyParam.AddDynamicParams("PRICE_MODIFIER_ID", DbType.Int32, ParameterDirection.Input, getProperties.PRICE_MODIFIER_ID);
                dyParam.AddDynamicParams("LETTINGS_DEPOSIT_PAYABLE", DbType.Decimal, ParameterDirection.Input, getProperties.LETTINGS_DEPOSIT_PAYABLE);
                dyParam.AddDynamicParams("LETTING_ARRANGEMENTS", DbType.String, ParameterDirection.Input, getProperties.LETTING_ARRANGEMENTS);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, getProperties.FEE_APPLY_ID);
                dyParam.AddDynamicParams("RENTAL_FREQUENCY_ID", DbType.Int32, ParameterDirection.Input, getProperties.RENTAL_FREQUENCY_ID);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, getProperties.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BEDROOMS_ID", DbType.Int32, ParameterDirection.Input, getProperties.BEDROOMS_ID);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, getProperties.BATHROOMS_ID);
                dyParam.AddDynamicParams("RECEPTIONS_ID", DbType.Int32, ParameterDirection.Input, getProperties.RECEPTIONS_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, getProperties.FLOORS_ID);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, getProperties.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, getProperties.UNITS_ID);
                dyParam.AddDynamicParams("LISTING_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.LISTING_TYPE_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, getProperties.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, getProperties.FULLDESCRIPTION);
                dyParam.AddDynamicParams("PLANNING_CONSIDERATIONS", DbType.String, ParameterDirection.Input, getProperties.PLANNING_CONSIDERATIONS);
                dyParam.AddDynamicParams("CURRENT_ERR_RATING", DbType.Int32, ParameterDirection.Input, getProperties.CURRENT_ERR_RATING);
                dyParam.AddDynamicParams("POTENTIAL_ERR_RATING", DbType.Int32, ParameterDirection.Input, getProperties.POTENTIAL_ERR_RATING);
                dyParam.AddDynamicParams("CONTENT_FILE_LINK", DbType.String, ParameterDirection.Input, getProperties.CONTENT_FILE_LINK);
                dyParam.AddDynamicParams("CONTENT_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.CONTENT_TYPE_ID);
                dyParam.AddDynamicParams("PICTURE_LINKS", DbType.String, ParameterDirection.Input, getProperties.PICTURE_LINKS);
                dyParam.AddDynamicParams("CONTENT_TYPE_PICTURE_LINKS", DbType.String, ParameterDirection.Input, getProperties.CONTENT_TYPE_PICTURE_LINKS);
                dyParam.AddDynamicParams("PROPERTY_FEATURES", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_FEATURES));
                dyParam.AddDynamicParams("PROPERTY_UTILITIES", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_UTILITIES));
                dyParam.AddDynamicParams("PROPERTY_UAP", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_UAP));
                dyParam.AddDynamicParams("CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, getProperties.CUSTOM_FEATURES);
                dyParam.AddDynamicParams("PRICE_PER_UNIT", DbType.Decimal, ParameterDirection.Input, getProperties.PRICE_PER_UNIT);
                dyParam.AddDynamicParams("MINIMUM_SIZE", DbType.Int32, ParameterDirection.Input, getProperties.MINIMUM_SIZE);
                dyParam.AddDynamicParams("MAXIMUM_SIZE", DbType.Int32, ParameterDirection.Input, getProperties.MAXIMUM_SIZE);
                dyParam.AddDynamicParams("NON_QUOTING", DbType.Boolean, ParameterDirection.Input, getProperties.NON_QUOTING);
                dyParam.AddDynamicParams("BUSINESS_FOR_SALE", DbType.Int32, ParameterDirection.Input, getProperties.BUSINESS_FOR_SALE);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, getProperties.AVAILABLE_FROM);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, getProperties.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, getProperties.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH.ToString());
                dyParam.AddDynamicParams("PAGE_NUMBER", DbType.Int32, ParameterDirection.Input, PAGE_NUMBER);
                dyParam.AddDynamicParams("PAGE_SIZE", DbType.Int32, ParameterDirection.Input, PAGE_SIZE);

                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object GetProperties(GetProperties getProperties, int PAGE_NUMBER, int PAGE_SIZE)
        {
            try
            {
                string sp_name = Procedures.SP_GET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, getProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("SITE_STATUS_ID", DbType.Int32, ParameterDirection.Input, getProperties.SITE_STATUS_ID);
                dyParam.AddDynamicParams("LISTING_STATUS_ID", DbType.Int32, ParameterDirection.Input, getProperties.LISTING_STATUS_ID);
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, getProperties.FULLPOSTCODE);
                dyParam.AddDynamicParams("PROPERTY_NUM_NAME", DbType.String, ParameterDirection.Input, getProperties.PROPERTY_NUM_NAME);
                dyParam.AddDynamicParams("STREET_NAME", DbType.String, ParameterDirection.Input, getProperties.STREET_NAME);
                dyParam.AddDynamicParams("AREA_TOWN_CITY", DbType.String, ParameterDirection.Input, getProperties.AREA_TOWN_CITY);
                dyParam.AddDynamicParams("OWN_REF", DbType.String, ParameterDirection.Input, getProperties.OWN_REF);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, getProperties.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, getProperties.LONGITUDE);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, getProperties.NEW_BUILD);
                dyParam.AddDynamicParams("RETIREMENT_HOME", DbType.Boolean, ParameterDirection.Input, getProperties.RETIREMENT_HOME);
                dyParam.AddDynamicParams("SHARED_ACCOMMODATION", DbType.Boolean, ParameterDirection.Input, getProperties.SHARED_ACCOMMODATION);
                dyParam.AddDynamicParams("SHORT_LET", DbType.Boolean, ParameterDirection.Input, getProperties.SHORT_LET);
                dyParam.AddDynamicParams("STUDENT_ACCEPTED", DbType.Boolean, ParameterDirection.Input, getProperties.STUDENT_ACCEPTED);
                dyParam.AddDynamicParams("TENURE_ID", DbType.Int32, ParameterDirection.Input, getProperties.TENURE_ID);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, getProperties.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, getProperties.ISEXEMPT);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, getProperties.PRICE);
                dyParam.AddDynamicParams("PRICE_MODIFIER_ID", DbType.Int32, ParameterDirection.Input, getProperties.PRICE_MODIFIER_ID);
                dyParam.AddDynamicParams("LETTINGS_DEPOSIT_PAYABLE", DbType.Decimal, ParameterDirection.Input, getProperties.LETTINGS_DEPOSIT_PAYABLE);
                dyParam.AddDynamicParams("LETTING_ARRANGEMENTS", DbType.String, ParameterDirection.Input, getProperties.LETTING_ARRANGEMENTS);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, getProperties.FEE_APPLY_ID);                
                dyParam.AddDynamicParams("RENTAL_FREQUENCY_ID", DbType.Int32, ParameterDirection.Input, getProperties.RENTAL_FREQUENCY_ID);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, getProperties.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BEDROOMS_ID", DbType.Int32, ParameterDirection.Input, getProperties.BEDROOMS_ID);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, getProperties.BATHROOMS_ID);
                dyParam.AddDynamicParams("RECEPTIONS_ID", DbType.Int32, ParameterDirection.Input, getProperties.RECEPTIONS_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, getProperties.FLOORS_ID);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, getProperties.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, getProperties.UNITS_ID);
                dyParam.AddDynamicParams("LISTING_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.LISTING_TYPE_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, getProperties.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, getProperties.FULLDESCRIPTION);
                dyParam.AddDynamicParams("PLANNING_CONSIDERATIONS", DbType.String, ParameterDirection.Input, getProperties.PLANNING_CONSIDERATIONS);
                dyParam.AddDynamicParams("CURRENT_ERR_RATING", DbType.Int32, ParameterDirection.Input, getProperties.CURRENT_ERR_RATING);
                dyParam.AddDynamicParams("POTENTIAL_ERR_RATING", DbType.Int32, ParameterDirection.Input, getProperties.POTENTIAL_ERR_RATING);
                dyParam.AddDynamicParams("CONTENT_FILE_LINK", DbType.String, ParameterDirection.Input, getProperties.CONTENT_FILE_LINK);
                dyParam.AddDynamicParams("CONTENT_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.CONTENT_TYPE_ID);
                dyParam.AddDynamicParams("PICTURE_LINKS", DbType.String, ParameterDirection.Input, getProperties.PICTURE_LINKS);
                dyParam.AddDynamicParams("CONTENT_TYPE_PICTURE_LINKS", DbType.String, ParameterDirection.Input, getProperties.CONTENT_TYPE_PICTURE_LINKS);
                dyParam.AddDynamicParams("PROPERTY_FEATURES", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_FEATURES));
                dyParam.AddDynamicParams("PROPERTY_UTILITIES", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_UTILITIES));
                dyParam.AddDynamicParams("PROPERTY_UAP", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_UAP));
                dyParam.AddDynamicParams("CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, getProperties.CUSTOM_FEATURES);
                dyParam.AddDynamicParams("PRICE_PER_UNIT", DbType.Decimal, ParameterDirection.Input, getProperties.PRICE_PER_UNIT);
                dyParam.AddDynamicParams("MINIMUM_SIZE", DbType.Int32, ParameterDirection.Input, getProperties.MINIMUM_SIZE);
                dyParam.AddDynamicParams("MAXIMUM_SIZE", DbType.Int32, ParameterDirection.Input, getProperties.MAXIMUM_SIZE);
                dyParam.AddDynamicParams("NON_QUOTING", DbType.Boolean, ParameterDirection.Input, getProperties.NON_QUOTING);
                dyParam.AddDynamicParams("BUSINESS_FOR_SALE", DbType.Int32, ParameterDirection.Input, getProperties.BUSINESS_FOR_SALE);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, getProperties.AVAILABLE_FROM);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, getProperties.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Int32, ParameterDirection.Input, getProperties.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH4.ToString());
                dyParam.AddDynamicParams("PAGE_NUMBER", DbType.Int32, ParameterDirection.Input, PAGE_NUMBER);
                dyParam.AddDynamicParams("PAGE_SIZE", DbType.Int32, ParameterDirection.Input, PAGE_SIZE);
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object GetPropertiesByUser(GetProperties getProperties)
        {
            try
            {
                string sp_name = Procedures.SP_GET_PROPERTIES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("PROPERTY_ID", DbType.Int32, ParameterDirection.Input, getProperties.PROPERTY_ID);
                dyParam.AddDynamicParams("SITE_STATUS_ID", DbType.Int32, ParameterDirection.Input, getProperties.SITE_STATUS_ID);
                dyParam.AddDynamicParams("LISTING_STATUS_ID", DbType.Int32, ParameterDirection.Input, getProperties.LISTING_STATUS_ID);
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, getProperties.FULLPOSTCODE);
                dyParam.AddDynamicParams("PROPERTY_NUM_NAME", DbType.String, ParameterDirection.Input, getProperties.PROPERTY_NUM_NAME);
                dyParam.AddDynamicParams("STREET_NAME", DbType.String, ParameterDirection.Input, getProperties.STREET_NAME);
                dyParam.AddDynamicParams("AREA_TOWN_CITY", DbType.String, ParameterDirection.Input, getProperties.AREA_TOWN_CITY);
                dyParam.AddDynamicParams("OWN_REF", DbType.String, ParameterDirection.Input, getProperties.OWN_REF);
                dyParam.AddDynamicParams("LATITUDE", DbType.String, ParameterDirection.Input, getProperties.LATITUDE);
                dyParam.AddDynamicParams("LONGITUDE", DbType.String, ParameterDirection.Input, getProperties.LONGITUDE);
                dyParam.AddDynamicParams("PROPERTY_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.PROPERTY_TYPE_ID);
                dyParam.AddDynamicParams("NEW_BUILD", DbType.Boolean, ParameterDirection.Input, getProperties.NEW_BUILD);
                dyParam.AddDynamicParams("RETIREMENT_HOME", DbType.Boolean, ParameterDirection.Input, getProperties.RETIREMENT_HOME);
                dyParam.AddDynamicParams("SHARED_ACCOMMODATION", DbType.Boolean, ParameterDirection.Input, getProperties.SHARED_ACCOMMODATION);
                dyParam.AddDynamicParams("SHORT_LET", DbType.Boolean, ParameterDirection.Input, getProperties.SHORT_LET);
                dyParam.AddDynamicParams("STUDENT_ACCEPTED", DbType.Boolean, ParameterDirection.Input, getProperties.STUDENT_ACCEPTED);
                dyParam.AddDynamicParams("TENURE_ID", DbType.Int32, ParameterDirection.Input, getProperties.TENURE_ID);
                dyParam.AddDynamicParams("COUNCIL_TAX_BAND_ID", DbType.Int32, ParameterDirection.Input, getProperties.COUNCIL_TAX_BAND_ID);
                dyParam.AddDynamicParams("ISEXEMPT", DbType.Boolean, ParameterDirection.Input, getProperties.ISEXEMPT);
                dyParam.AddDynamicParams("PRICE", DbType.Decimal, ParameterDirection.Input, getProperties.PRICE);
                dyParam.AddDynamicParams("PRICE_MODIFIER_ID", DbType.Int32, ParameterDirection.Input, getProperties.PRICE_MODIFIER_ID);
                dyParam.AddDynamicParams("LETTINGS_DEPOSIT_PAYABLE", DbType.Decimal, ParameterDirection.Input, getProperties.LETTINGS_DEPOSIT_PAYABLE);
                dyParam.AddDynamicParams("LETTING_ARRANGEMENTS", DbType.String, ParameterDirection.Input, getProperties.LETTING_ARRANGEMENTS);
                dyParam.AddDynamicParams("FEE_APPLY_ID", DbType.Int32, ParameterDirection.Input, getProperties.FEE_APPLY_ID);
                dyParam.AddDynamicParams("FURNISHED_ID", DbType.Int32, ParameterDirection.Input, getProperties.FURNISHED_ID);
                dyParam.AddDynamicParams("RENTAL_FREQUENCY_ID", DbType.Int32, ParameterDirection.Input, getProperties.RENTAL_FREQUENCY_ID);
                dyParam.AddDynamicParams("VIDEO_VIRTUALS_LINK", DbType.String, ParameterDirection.Input, getProperties.VIDEO_VIRTUALS_LINK);
                dyParam.AddDynamicParams("BEDROOMS_ID", DbType.Int32, ParameterDirection.Input, getProperties.BEDROOMS_ID);
                dyParam.AddDynamicParams("BATHROOMS_ID", DbType.Int32, ParameterDirection.Input, getProperties.BATHROOMS_ID);
                dyParam.AddDynamicParams("RECEPTIONS_ID", DbType.Int32, ParameterDirection.Input, getProperties.RECEPTIONS_ID);
                dyParam.AddDynamicParams("FLOORS_ID", DbType.Int32, ParameterDirection.Input, getProperties.FLOORS_ID);
                dyParam.AddDynamicParams("SIZE", DbType.String, ParameterDirection.Input, getProperties.SIZE);
                dyParam.AddDynamicParams("UNITS_ID", DbType.Int32, ParameterDirection.Input, getProperties.UNITS_ID);
                dyParam.AddDynamicParams("LISTING_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.LISTING_TYPE_ID);
                dyParam.AddDynamicParams("SUMMARY", DbType.String, ParameterDirection.Input, getProperties.SUMMARY);
                dyParam.AddDynamicParams("FULLDESCRIPTION", DbType.String, ParameterDirection.Input, getProperties.FULLDESCRIPTION);
                dyParam.AddDynamicParams("PLANNING_CONSIDERATIONS", DbType.String, ParameterDirection.Input, getProperties.PLANNING_CONSIDERATIONS);
                dyParam.AddDynamicParams("CURRENT_ERR_RATING", DbType.Int32, ParameterDirection.Input, getProperties.CURRENT_ERR_RATING);
                dyParam.AddDynamicParams("POTENTIAL_ERR_RATING", DbType.Int32, ParameterDirection.Input, getProperties.POTENTIAL_ERR_RATING);
                dyParam.AddDynamicParams("CONTENT_FILE_LINK", DbType.String, ParameterDirection.Input, getProperties.CONTENT_FILE_LINK);
                dyParam.AddDynamicParams("CONTENT_TYPE_ID", DbType.Int32, ParameterDirection.Input, getProperties.CONTENT_TYPE_ID);
                dyParam.AddDynamicParams("PICTURE_LINKS", DbType.String, ParameterDirection.Input, getProperties.PICTURE_LINKS);
                dyParam.AddDynamicParams("CONTENT_TYPE_PICTURE_LINKS", DbType.String, ParameterDirection.Input, getProperties.CONTENT_TYPE_PICTURE_LINKS);
                dyParam.AddDynamicParams("PROPERTY_FEATURES", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_FEATURES));
                dyParam.AddDynamicParams("PROPERTY_UTILITIES", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_UTILITIES));
                dyParam.AddDynamicParams("PROPERTY_UAP", DbType.String, ParameterDirection.Input, JsonSerializer.Serialize(getProperties.PROPERTY_UAP));
                dyParam.AddDynamicParams("CUSTOM_FEATURES", DbType.String, ParameterDirection.Input, getProperties.CUSTOM_FEATURES);
                dyParam.AddDynamicParams("PRICE_PER_UNIT", DbType.Decimal, ParameterDirection.Input, getProperties.PRICE_PER_UNIT);
                dyParam.AddDynamicParams("MINIMUM_SIZE", DbType.Int32, ParameterDirection.Input, getProperties.MINIMUM_SIZE);
                dyParam.AddDynamicParams("MAXIMUM_SIZE", DbType.Int32, ParameterDirection.Input, getProperties.MAXIMUM_SIZE);
                dyParam.AddDynamicParams("NON_QUOTING", DbType.Boolean, ParameterDirection.Input, getProperties.NON_QUOTING);
                dyParam.AddDynamicParams("BUSINESS_FOR_SALE", DbType.Int32, ParameterDirection.Input, getProperties.BUSINESS_FOR_SALE);
                dyParam.AddDynamicParams("AVAILABLE_FROM", DbType.Date, ParameterDirection.Input, getProperties.AVAILABLE_FROM);
                dyParam.AddDynamicParams("ACTIVE", DbType.Boolean, ParameterDirection.Input, getProperties.ACTIVE);
                dyParam.AddDynamicParams("USER", DbType.Boolean, ParameterDirection.Input, getProperties.USER);
                dyParam.AddDynamicParams("ACTION", DbType.String, ParameterDirection.Input, Actions.FETCH3.ToString());
                if (selectedDatabase == "ORACLE") dyParam.AddRefCursor("REFCURSOR");

                return _db.ExecuteProc(sp_name, dyParam);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public object GetPlacesByPostCode(string FULLPOSTCODE)
        {
            try
            {
                string sp_name = Procedures.SP_GET_PLACES.ToString();
                Parameters dyParam = new Parameters();
                dyParam.SelectedDB = _db.SelectedDatabase;
                dyParam.AddDynamicParams("FULLPOSTCODE", DbType.String, ParameterDirection.Input, FULLPOSTCODE);
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
