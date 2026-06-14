using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class GetProperties
    {
        public int? PROPERTY_ID { get; set; }
        public int? SITE_STATUS_ID { get; set; }
        public int? LISTING_STATUS_ID { get; set; }
        public string? FULLPOSTCODE { get; set; }
        public string? PROPERTY_NUM_NAME { get; set; }
        public string? STREET_NAME { get; set; }
        public string? AREA_TOWN_CITY { get; set; }
        public string? OWN_REF { get; set; }
        public string? LATITUDE { get; set; }
        public string? LONGITUDE { get; set; }
        public int? PROPERTY_TYPE_ID { get; set; }
        public bool? NEW_BUILD { get; set; }
        public bool? RETIREMENT_HOME { get; set; }
        public bool? SHARED_ACCOMMODATION { get; set; }
        public bool? SHORT_LET { get; set; }
        public bool? STUDENT_ACCEPTED { get; set; }
        public int? TENURE_ID { get; set; }
        public int? COUNCIL_TAX_BAND_ID { get; set; }
        public bool? ISEXEMPT { get; set; }
        public decimal? PRICE { get; set; }
        public decimal? MAX_GUESTS { get; set; }
        public int? PRICE_MODIFIER_ID { get; set; }
        public int? LETTINGS_DEPOSIT_PAYABLE { get; set; }
        public int? LETTING_ARRANGEMENTS { get; set; }
        public int? FEE_APPLY_ID { get; set; }
        public int? FURNISHED_ID { get; set; }
        public int? RENTAL_FREQUENCY_ID { get; set; }
        public string? VIDEO_VIRTUALS_LINK { get; set; }
        public int? BEDROOMS_ID { get; set; }
        public int? BATHROOMS_ID { get; set; }
        public int? RECEPTIONS_ID { get; set; }
        public int? FLOORS_ID { get; set; }
        public string? SIZE { get; set; }
        public int? UNITS_ID { get; set; }
        public int? LISTING_TYPE_ID {get; set;}
        public string? SUMMARY { get; set; }
        public string? FULLDESCRIPTION { get; set; }
        public string? PLANNING_CONSIDERATIONS { get; set; }
        public int? CURRENT_ERR_RATING { get; set; }
        public int? POTENTIAL_ERR_RATING { get; set; }
        public string? CONTENT_FILE_LINK { get; set; }
        public int? CONTENT_TYPE_ID { get; set; }
        public decimal? PRICE_PER_UNIT {  get; set; }
        public int? MINIMUM_SIZE { get; set; }
        public int? MAXIMUM_SIZE { get; set; }
        public bool? NON_QUOTING { get; set; }
        public int? BUSINESS_FOR_SALE {  get; set; }
        public int? PROPERTY_MAIN_TYPE_ID { get; set; }
        public DateTime? AVAILABLE_FROM { get; set; }
        public int? PROPERTY_QUANTITY { get; set; }
        public List<SetPictureLinks>? PICTURE_LINKS { get; set; }
        public List<SetPictureLinks>? CONTENT_TYPE_PICTURE_LINKS { get; set; }
        public List<SetPropertyFeatures>? PROPERTY_FEATURES { get; set; }
        public List<SetPropertyUtilities>? PROPERTY_UTILITIES { get; set; }
        public List<SetPropertyUsingPlanning>? PROPERTY_UAP { get; set; }
        public List<SetCustomFeatures>? CUSTOM_FEATURES { get; set; }
        public bool? ACTIVE { get; set; }
        public string? FETCH2_TYPE { get; set; }
        public int? USER { get; set; }

    }

    public class GetPropertiesFilters
    {
        public int? PROPERTY_ID { get; set; }
        public int? SITE_STATUS_ID { get; set; }
        public int? LISTING_STATUS_ID { get; set; }
        public string? FULLPOSTCODE { get; set; }
        public string? PROPERTY_NUM_NAME { get; set; }
        public string? STREET_NAME { get; set; }
        public string? AREA_TOWN_CITY { get; set; }
        public string? OWN_REF { get; set; }
        public string? LATITUDE { get; set; }
        public string? LONGITUDE { get; set; }
        public int? PROPERTY_TYPE_ID { get; set; }
        public bool? NEW_BUILD { get; set; }
        public bool? RETIREMENT_HOME { get; set; }
        public bool? SHARED_ACCOMMODATION { get; set; }
        public bool? SHORT_LET { get; set; }
        public bool? STUDENT_ACCEPTED { get; set; }
        public int? TENURE_ID { get; set; }
        public int? COUNCIL_TAX_BAND_ID { get; set; }
        public bool? ISEXEMPT { get; set; }
        public decimal? PRICE { get; set; }
        public decimal? MAX_GUESTS { get; set; }
        public int? PRICE_MODIFIER_ID { get; set; }
        public int? LETTINGS_DEPOSIT_PAYABLE { get; set; }
        public int? LETTING_ARRANGEMENTS { get; set; }
        public int? FEE_APPLY_ID { get; set; }
        public int? FURNISHED_ID { get; set; }
        public int? RENTAL_FREQUENCY_ID { get; set; }
        public string? VIDEO_VIRTUALS_LINK { get; set; }
        public int? BEDROOMS_ID { get; set; }
        public int? BATHROOMS_ID { get; set; }
        public int? RECEPTIONS_ID { get; set; }
        public int? FLOORS_ID { get; set; }
        public string? SIZE { get; set; }
        public int? UNITS_ID { get; set; }
        public int? LISTING_TYPE_ID { get; set; }
        public string? SUMMARY { get; set; }
        public string? FULLDESCRIPTION { get; set; }
        public string? PLANNING_CONSIDERATIONS { get; set; }
        public int? CURRENT_ERR_RATING { get; set; }
        public int? POTENTIAL_ERR_RATING { get; set; }
        public string? CONTENT_FILE_LINK { get; set; }
        public int? CONTENT_TYPE_ID { get; set; }
        public decimal? PRICE_PER_UNIT { get; set; }
        public int? MINIMUM_SIZE { get; set; }
        public int? MAXIMUM_SIZE { get; set; }
        public bool? NON_QUOTING { get; set; }
        public int? BUSINESS_FOR_SALE { get; set; }
        public int? PROPERTY_MAIN_TYPE_ID { get; set; }
        public DateTime? AVAILABLE_FROM { get; set; }
        public DateTime? CHECK_IN { get; set; }
        public DateTime? CHECK_OUT { get; set; }
        public string? FROM_COUNTRY { get; set; }
        public string? COUNTRY { get; set; }
        public string? CITY { get; set; }
        public int? GUESTS { get; set; }
        public int? ROOMS { get; set; }
        public bool? PETS_ALLOWED { get; set; }
        public String? FILTERS { get; set; }
        public int? PROPERTY_QUANTITY { get; set; }
        public List<SetPictureLinks>? PICTURE_LINKS { get; set; }
        public List<SetPictureLinks>? CONTENT_TYPE_PICTURE_LINKS { get; set; }
        public List<SetPropertyFeatures>? PROPERTY_FEATURES { get; set; }
        public List<SetPropertyUtilities>? PROPERTY_UTILITIES { get; set; }
        public List<SetPropertyUsingPlanning>? PROPERTY_UAP { get; set; }
        public List<SetCustomFeatures>? CUSTOM_FEATURES { get; set; }
        public bool? ACTIVE { get; set; }
        public string? FETCH2_TYPE { get; set; }
        public int? USER { get; set; }

    }
    public class GetPropertiesFiltersForMap
    {
        public int? PROPERTY_ID { get; set; }
        public int? LISTING_TYPE_ID { get; set; }
        public DateTime? CHECK_IN { get; set; }
        public DateTime? CHECK_OUT { get; set; }
        public String? FILTERS { get; set; }
        public bool? ACTIVE { get; set; }
        public int? USER { get; set; }

    }

}
