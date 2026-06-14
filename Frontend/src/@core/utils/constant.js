export const dirPrefix = '/uploads/images/'

import { Country } from 'country-state-city'

const setPrefix = value => `${dirPrefix}${value}`

export const FILE_DIRECTORIES = Object.freeze({
  PROPERTY: { WITH_PREFIX: setPrefix('properties/'), WITHOUT_PREFIX: 'properties/' },
  PRODUCT: { WITH_PREFIX: setPrefix('products/'), WITHOUT_PREFIX: 'products/' },
  CONTENT: { WITH_PREFIX: setPrefix('properties/content/'), WITHOUT_PREFIX: 'properties/content/' },
  NEWS: { WITH_PREFIX: setPrefix('news/'), WITHOUT_PREFIX: 'news/' },
  AGENT: { WITH_PREFIX: setPrefix('agent/'), WITHOUT_PREFIX: 'agent/' },
  COMMUNITIES: { WITH_PREFIX: setPrefix('communities/'), WITHOUT_PREFIX: 'communities/' },
  SECTIONS: { WITH_PREFIX: setPrefix('sections/'), WITHOUT_PREFIX: 'sections/' }
})

export const defaultPageFont = "'Inter', sans-serif"

export const defaultRowsPerPage = [5, 10, 25, 50]

export const POSTCODE_PATTERN =
  '([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})| |(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))s?[0-9][A-Za-z]{2})'

export const fieldTypeOptions = [
  { value: 1, label: 'Radio Check', icon: 'mdi:radiobox-marked' },
  { value: 2, label: 'Select Option', icon: 'tabler:select' }
]

export const agentRoleCode = process.env.NEXT_PUBLIC_AGENT_ROLE_CODE

export const countryISO = process.env.NEXT_PUBLIC_COUNTRY

export const GLOBAL_PARAMETER_TYPES = Object.freeze({
  BATHROOMS: 'BATHROOMS',
  BEDROOMS: 'BEDROOMS',
  CONTENT_TYPE: 'CONTTYPE',
  COUNCIL_TAX_BAND: 'CTB',
  DISPLAY_TYPE: 'DSPLYTYPE',
  FEATURE_TYPE: 'FTRTYPE',
  FEE_APPLY: 'FEEAPLY',
  FLOORS: 'FLOORS',
  FURNISHED: 'FURNISH',
  LISTING_STATUS: 'LSTSTS',
  LISTING_TYPE: 'LSTTYPE',
  PRICE_MODIFIER: 'PRICEMDFR',
  PROPERTY_TYPE: 'PROPTYPE',
  RECEPTIONS: 'RECEP',
  RENTAL_FREQUENCY: 'RENTFREQ',
  LETTING_ARRANGEMENTS: 'LETARNG',
  LETTINGS_DEPOSIT: 'LETDEP',
  SITE_STATUS: 'SITESTS',
  SERVICE_TYPE: 'SERDETYPE',
  SUBSCRIPTION_TYPE: 'SUBCTYP',
  TENURE: 'TENURE',
  TRADE_TYPE: 'TRDTYPE',
  UNITS: 'UNITS',
  USING_AND_PLANNING: 'UAPTYPE',
  UTILITIES_TYPE: 'UTLTYPE',

  ROOM_TYPE: 'ROOMTYPE',
  BED_TYPE: 'BEDTYPE',
  HOTEL_TYPE: 'HOTELTYPE',
  HOTEL_FAQ: 'HOTELFAQ',
  TIME_SLOT: 'TIMESLOT',
  MEAL_PLAN: 'MEELPLAN',
  CANCELLATION_POLICY: 'CNCLPOLICY',
  NEARBY_ICON: 'NEARBYICON',
  HOUSE_RULES: 'HOUSERULE',
  PROPERTY_FAQ: 'PRPTYFAQ',
  ROOM_FAQ: 'ROOMFAQ',

  // ── Home page filter config (TYPE_CODE prefix: FTR_, max 14 chars) ───────
  FILTER_BEDANDBATH: 'FTR_BEDANDBATH', // Hotel – Bedrooms & Bathrooms (counter)
  FILTER_BUDGET: 'FTR_BUDGET', // Hotel – Budget per night (radio)
  FILTER_REVSCR: 'FTR_REVSCR', // Hotel – Review score (radio)
  FILTER_RMFAC: 'FTR_RMFAC', // Hotel – Room facilities (checkbox)
  FILTER_FUNTHNG: 'FTR_FUNTHNG', // Hotel – Fun things to do (checkbox)
  FILTER_RNTDUR: 'FTR_RNTDUR', // Rental – Rental duration (checkbox)
  FILTER_PRCRNG: 'FTR_PRCRNG', // Rental – Price range (range — label only)
  FILTER_PRPTYPE: 'PROPTYPE', // Rental – Property type (checkbox)
  FILTER_BDRM: 'FTR_BDRM', // Rental – Bedrooms (checkbox)
  FILTER_PRPSIZE: 'FTR_PRPSIZE', // Rental – Property size (range — label only)
  FILTER_AMNT: 'FTR_AMNT', // Rental – Amenities (checkbox)
  FILTER_PETS: 'FTR_PETS', // Rental – Pets allowed (switch)
  APPLICATION_SETTING: 'APPSET',
  POPULAR_COUNTRY: 'COUNTRY',
  POPULAR_REGION: 'REGION',
  POST_STATUS: 'POSTSTS',
  PRODUCT_CATEGORY: 'PRDCAT',
  PRODUCT_SUBCATEGORY: 'PRDSUBCAT',
  SELLER_TYPE: 'SLRTYPE',
  PRODUCT_CONDITION: 'PRDCON',
  DELIVERY_OPTIONS: 'DLRYOPT'
})

// ─────────────────────────────────────────────────────────────────────────────
// Hotels – static fallback / default data
// ─────────────────────────────────────────────────────────────────────────────

export const HOTEL_DEFAULT_REVIEWS = [
  {
    author: 'Sarah Jenkins',
    rating: 5,
    comment: 'Lovely stay, the garden is beautiful. Very spacious and cozy throughout.'
  },
  {
    author: 'Emily Towada',
    rating: 5,
    comment: 'Modern amenities and perfect for my family. Highly recommend for a relaxing vacation.'
  },
  { author: 'Elena Rodriguez', rating: 5, comment: 'Great space and welcoming.' },
  {
    author: 'David Miller',
    rating: 5,
    comment: 'Clean, spacious and beautiful. We had a wonderful time here. Lovely garden setup!'
  }
]

export const HOTEL_RATING_BREAKDOWN = [
  { label: 'Cleanliness', value: 85, score: '4.3' },
  { label: 'Accuracy', value: 90, score: '4.5' },
  { label: 'Communication', value: 98, score: '4.9' },
  { label: 'Location', value: 92, score: '4.6' }
]

export const HOTEL_DEFAULT_RULES = [
  { rule: 'Check-in', note: 'After 3:00 PM' },
  { rule: 'Check-out', note: 'Before 11:00 AM' },
  { rule: 'No Smoking', note: 'Smoking is not permitted in the property' },
  { rule: 'No Parties', note: 'Loud music and loud gathering prohibited' }
]

export const HOTEL_DEFAULT_FAQS = [
  {
    question: 'What are the check-in & check-out times?',
    answer: 'Check-in is after 3:00 PM and check-out is before 11:00 AM.'
  },
  {
    question: 'Can I cancel my booking for free and get a full refund?',
    answer: 'Yes, you can cancel free of charge with full refund until 2 days before arrival.'
  },
  {
    question: 'How much does it cost to stay?',
    answer: 'Pricing varies by season and dates selected. See the booking widget for exact pricing.'
  },
  {
    question: 'Are meals included in the stay?',
    answer: 'Meals are not included in the room rate unless specified in the selected room option.'
  },
  {
    question: 'Is there parking available at the property?',
    answer: 'Yes, free parking is available at the property. Please confirm when booking.'
  }
]

export const HOTEL_DEFAULT_NEARBY = [
  { name: 'Train Station', distance: '0.4 mi away', icon: 'tabler:train' },
  { name: 'Mountain Meditation', distance: '25 mi away', icon: 'tabler:mountain' },
  { name: 'Local Restaurant', distance: '0.3 mi away', icon: 'tabler:fork-knife' },
  { name: 'Shopping Centre', distance: '1.2 mi away', icon: 'tabler:building-store' }
]

export const HOST_STATS = [
  { value: '10/10', label: 'Communications' },
  { value: '9.8/10', label: 'Cleanliness' },
  { value: '0%', label: 'Cancellation' },
  { value: '< 1hr', label: 'Response rate' }
]

export const BOOKING_STEPS = [
  { label: 'Your Selection', step: 1 },
  { label: 'Your Details', step: 2 },
  { label: 'Final Step', step: 3 }
]

// ─────────────────────────────────────────────────────────────────────────────
// Guest Demographics – static option lists for multi-select fields
// ─────────────────────────────────────────────────────────────────────────────

// All countries driven by the country-state-city library (isoCode → value, name → label).
// CA (Canada) is marked default for pre-selecting in booking forms.
export const POPULAR_COUNTRIES = Country.getAllCountries().map(c => ({
  value: c.isoCode,
  label: c.name,
  ...(c.isoCode === 'CA' ? { default: true } : {})
}))

export const POPULAR_REGIONS = [
  { value: 'western-europe', label: 'Western Europe' },
  { value: 'eastern-europe', label: 'Eastern Europe' },
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'south-asia', label: 'South Asia' },
  { value: 'southeast-asia', label: 'South-East Asia' },
  { value: 'east-asia', label: 'East Asia' },
  { value: 'central-asia', label: 'Central Asia' },
  { value: 'north-africa', label: 'North Africa' },
  { value: 'sub-saharan-africa', label: 'Sub-Saharan Africa' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'central-america', label: 'Central America' }
]

// ─────────────────────────────────────────────────────────────────────────────
// Landing page – tabs, search fields, location lists, filter & property configs
// (previously in src/views/pages/home/landing/data.js)
// ─────────────────────────────────────────────────────────────────────────────

export const landingTabs = [
  { id: 'community', label: 'Go Community Map', route: '/community-map', icon: 'tabler:map-pin' },
  { id: 'hotels', label: 'Hotels', route: '/newhome/properties', icon: 'tabler:building-skyscraper' },
  { id: 'rentals', label: 'Rentals', route: '/rentals/properties', icon: 'tabler:home' },
  { id: 'furniture', label: 'Furniture place', route: '/furniture-marketplace', icon: 'tabler:armchair-2' }
]

export const landingSearchFields = [
  { id: 'from', label: 'Where from?', value: 'United States', icon: 'tabler:world' },
  { id: 'to', label: 'Where to?', value: 'Japan', icon: 'tabler:map-pin' },
  { id: 'date', label: 'Dates', value: 'Oct 12 - 18', icon: 'tabler:calendar-time' },
  { id: 'guests', label: 'Guests', value: '2', icon: 'tabler:users' }
]

// Library-driven: country names resolved from country-state-city ISO codes
export const landingCountries = ['US', 'GB', 'CA', 'AU', 'JP', 'SG', 'AE', 'DE', 'FR', 'IN']
  .map(code => Country.getCountryByCode(code)?.name)
  .filter(Boolean)

export const landingLocations = [
  { id: 'hyderabad-pk', city: 'Hyderabad', region: 'Sindh', country: 'Pakistan' },
  { id: 'hyderabad-in', city: 'Hyderabad', region: 'Telangana (Hyderabad Region)', country: 'India' },
  { id: 'tokyo-jp', city: 'Tokyo', region: 'Kanto', country: 'Japan' },
  { id: 'osaka-jp', city: 'Osaka', region: 'Kansai', country: 'Japan' },
  { id: 'dubai-uae', city: 'Dubai', region: 'Dubai', country: 'United Arab Emirates' },
  { id: 'singapore-sg', city: 'Singapore', region: 'Central Region', country: 'Singapore' },
  { id: 'london-uk', city: 'London', region: 'England', country: 'United Kingdom' },
  { id: 'toronto-ca', city: 'Toronto', region: 'Ontario', country: 'Canada' },
  { id: 'berlin-de', city: 'Berlin', region: 'Berlin', country: 'Germany' },
  { id: 'paris-fr', city: 'Paris', region: 'Ile-de-France', country: 'France' }
]

export const hotelFilterConfig = [
  {
    id: 'rooms',
    typeCode: 'FTR_BEDANDBATH',
    title: 'Bedrooms and Bathrooms',
    type: 'counter',
    counters: [
      { id: 'bedrooms', label: 'Bedrooms', value: 0, min: 0 },
      { id: 'bathrooms', label: 'Bathrooms', value: 0, min: 0 }
    ],
    isDeletable: true,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'budget',
    typeCode: 'FTR_BUDGET',
    title: 'Your Budget (Per Night)',
    type: 'radio',
    isDeletable: true,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'review-score',
    typeCode: 'FTR_REVSCR',
    title: 'Review Score',
    type: 'radio',
    isDeletable: true,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'room-facilities',
    typeCode: 'FTR_RMFAC',
    title: 'Room Facilities',
    type: 'checkbox',
    isDeletable: true,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'fun-things',
    typeCode: 'FTR_FUNTHNG',
    title: 'Fun Things to Do',
    type: 'checkbox',
    isDeletable: true,
    isEditable: true,
    isAddable: true
  }
]

export const rentalFilterConfig = [
  {
    id: 'rental-duration',
    typeCode: 'FTR_RNTDUR',
    title: 'Rental Duration',
    type: 'checkbox',
    options: [{ id: 'none', label: 'None' }],
    isDeletable: true,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'price-range',
    typeCode: 'FTR_PRCRNG',
    title: 'Price Range (Per Night)',
    type: 'range',
    min: 50,
    max: 500,
    value: [50, 500],
    unitPrefix: '$',
    isDeletable: false,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'property-type',
    typeCode: 'PROPTYPE',
    title: 'Property Type',
    type: 'checkbox',
    options: [{ id: 'none', label: 'None' }],
    isDeletable: false,
    isEditable: false,
    isAddable: false
  },
  {
    id: 'rental_bedrooms',
    typeCode: 'FTR_BDRM',
    title: 'Bedrooms',
    type: 'range',
    min: 1,
    max: 4,
    value: [1, 4],
    isDeletable: false,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'property-size',
    typeCode: 'FTR_PRPSIZE',
    title: 'Property Size',
    type: 'range',
    min: 500,
    max: 2500,
    value: [500, 2500],
    isDeletable: true,
    isEditable: true,
    isAddable: true
  },
  {
    id: 'amenities',
    typeCode: 'FTR_AMNT',
    title: 'Amenities',
    type: 'checkbox',
    options: [{ id: 'none', label: 'None' }],
    isDeletable: false,
    isEditable: true,
    isAddable: true
  }
]

/** @deprecated use hotelFilterConfig */
export const landingFilterConfig = hotelFilterConfig

export const hotelPropertySections = []

export const rentalPropertySections = [
  {
    id: 'london',
    title: 'Modern Rentals in London',
    subtitle: 'Contemporary apartments and houses',
    cards: [
      {
        id: 'london-1',
        title: 'Cozy Westminster Flat',
        district: 'Westminster, London',
        image: '/images/banners/banner-14.jpg',
        beds: 2,
        baths: 1,
        guests: 3,
        rating: 4.85,
        price: 180,
        lat: 51.5007,
        lng: -0.1246,
        rentalType: 'short-term',
        propertyType: 'apartments',
        size: 850,
        amenities: ['wifi', 'kitchen', 'washer', 'aircon', 'tv']
      },
      {
        id: 'london-2',
        title: 'Spacious Camden House',
        district: 'Camden, London',
        image: '/images/banners/banner-16.jpg',
        beds: 4,
        baths: 3,
        guests: 6,
        rating: 4.92,
        price: 350,
        lat: 51.542,
        lng: -0.1439,
        rentalType: 'long-term',
        propertyType: 'houses',
        size: 1800,
        amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'aircon', 'heating', 'workspace']
      },
      {
        id: 'london-3',
        title: 'Chelsea Modern Apartment',
        district: 'Chelsea, London',
        image: '/images/banners/banner-17.jpg',
        beds: 1,
        baths: 1,
        guests: 2,
        rating: 4.78,
        price: 140,
        lat: 51.4875,
        lng: -0.1687,
        rentalType: 'short-term',
        propertyType: 'apartments',
        size: 650,
        amenities: ['wifi', 'kitchen', 'aircon', 'tv', 'hairdryer']
      },
      {
        id: 'london-4',
        title: 'Kensington Family Home',
        district: 'Kensington, London',
        image: '/images/banners/banner-18.jpg',
        beds: 3,
        baths: 2,
        guests: 5,
        rating: 4.88,
        price: 280,
        lat: 51.4994,
        lng: -0.1938,
        rentalType: 'long-term',
        propertyType: 'houses',
        size: 1500,
        amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'heating', 'workspace', 'tv', 'iron']
      }
    ]
  },
  {
    id: 'manchester',
    title: 'Urban Living in Manchester',
    subtitle: 'City center apartments and student housing',
    cards: [
      {
        id: 'manchester-1',
        title: 'City Centre Loft',
        district: 'Manchester City Centre',
        image: '/images/banners/banner-19.jpg',
        beds: 2,
        baths: 2,
        guests: 4,
        rating: 4.65,
        price: 160,
        lat: 53.4808,
        lng: -2.2426,
        rentalType: 'short-term',
        propertyType: 'apartments',
        size: 900,
        amenities: ['wifi', 'kitchen', 'washer', 'aircon', 'workspace', 'tv']
      },
      {
        id: 'manchester-2',
        title: 'Northern Quarter Studio',
        district: 'Northern Quarter',
        image: '/images/banners/banner-20.jpg',
        beds: 1,
        baths: 1,
        guests: 2,
        rating: 4.55,
        price: 95,
        lat: 53.4839,
        lng: -2.2361,
        rentalType: 'long-term',
        propertyType: 'apartments',
        size: 550,
        amenities: ['wifi', 'kitchen', 'heating', 'tv']
      },
      {
        id: 'manchester-3',
        title: 'Salford Quays Penthouse',
        district: 'Salford Quays',
        image: '/images/banners/banner-21.jpg',
        beds: 3,
        baths: 2,
        guests: 5,
        rating: 4.91,
        price: 320,
        lat: 53.4713,
        lng: -2.2902,
        rentalType: 'short-term',
        propertyType: 'apartments',
        size: 1400,
        amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'aircon', 'heating', 'workspace', 'tv', 'hairdryer', 'iron']
      },
      {
        id: 'manchester-4',
        title: 'Didsbury Cottage',
        district: 'Didsbury',
        image: '/images/banners/banner-22.jpg',
        beds: 2,
        baths: 1,
        guests: 3,
        rating: 4.72,
        price: 135,
        lat: 53.4184,
        lng: -2.2312,
        rentalType: 'long-term',
        propertyType: 'houses',
        size: 1100,
        amenities: ['wifi', 'kitchen', 'washer', 'heating', 'workspace']
      }
    ]
  }
]

/** @deprecated use rentalPropertySections */
export const landingPropertySections = hotelPropertySections

// ─────────────────────────────────────────────────────────────────────────────
// Phone prefixes — all countries with ISO code, dial code, and flag emoji
// ─────────────────────────────────────────────────────────────────────────────

export const PHONE_PREFIXES = [
  { value: 'AF', label: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { value: 'AL', label: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { value: 'DZ', label: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { value: 'AS', label: 'American Samoa', dialCode: '+1-684', flag: '🇦🇸' },
  { value: 'AD', label: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
  { value: 'AO', label: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { value: 'AI', label: 'Anguilla', dialCode: '+1-264', flag: '🇦🇮' },
  { value: 'AG', label: 'Antigua and Barbuda', dialCode: '+1-268', flag: '🇦🇬' },
  { value: 'AR', label: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { value: 'AM', label: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
  { value: 'AW', label: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
  { value: 'AU', label: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { value: 'AT', label: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { value: 'AZ', label: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
  { value: 'BS', label: 'Bahamas', dialCode: '+1-242', flag: '🇧🇸' },
  { value: 'BH', label: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { value: 'BD', label: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { value: 'BB', label: 'Barbados', dialCode: '+1-246', flag: '🇧🇧' },
  { value: 'BY', label: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
  { value: 'BE', label: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { value: 'BZ', label: 'Belize', dialCode: '+501', flag: '🇧🇿' },
  { value: 'BJ', label: 'Benin', dialCode: '+229', flag: '🇧🇯' },
  { value: 'BM', label: 'Bermuda', dialCode: '+1-441', flag: '🇧🇲' },
  { value: 'BT', label: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
  { value: 'BO', label: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { value: 'BA', label: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦' },
  { value: 'BW', label: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { value: 'BR', label: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { value: 'IO', label: 'British Indian Ocean Territory', dialCode: '+246', flag: '🇮🇴' },
  { value: 'VG', label: 'British Virgin Islands', dialCode: '+1-284', flag: '🇻🇬' },
  { value: 'BN', label: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
  { value: 'BG', label: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { value: 'BF', label: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { value: 'BI', label: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { value: 'KH', label: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
  { value: 'CM', label: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
  { value: 'CA', label: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { value: 'CV', label: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
  { value: 'KY', label: 'Cayman Islands', dialCode: '+1-345', flag: '🇰🇾' },
  { value: 'CF', label: 'Central African Republic', dialCode: '+236', flag: '🇨🇫' },
  { value: 'TD', label: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { value: 'CL', label: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { value: 'CN', label: 'China', dialCode: '+86', flag: '🇨🇳' },
  { value: 'CX', label: 'Christmas Island', dialCode: '+61', flag: '🇨🇽' },
  { value: 'CC', label: 'Cocos Islands', dialCode: '+61', flag: '🇨🇨' },
  { value: 'CO', label: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { value: 'KM', label: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
  { value: 'CK', label: 'Cook Islands', dialCode: '+682', flag: '🇨🇰' },
  { value: 'CR', label: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { value: 'HR', label: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
  { value: 'CU', label: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { value: 'CW', label: 'Curacao', dialCode: '+599', flag: '🇨🇼' },
  { value: 'CY', label: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
  { value: 'CZ', label: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { value: 'CD', label: 'DR Congo', dialCode: '+243', flag: '🇨🇩' },
  { value: 'DK', label: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { value: 'DJ', label: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { value: 'DM', label: 'Dominica', dialCode: '+1-767', flag: '🇩🇲' },
  { value: 'DO', label: 'Dominican Republic', dialCode: '+1-809', flag: '🇩🇴' },
  { value: 'EC', label: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { value: 'EG', label: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { value: 'SV', label: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { value: 'GQ', label: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
  { value: 'ER', label: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
  { value: 'EE', label: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { value: 'SZ', label: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
  { value: 'ET', label: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { value: 'FK', label: 'Falkland Islands', dialCode: '+500', flag: '🇫🇰' },
  { value: 'FO', label: 'Faroe Islands', dialCode: '+298', flag: '🇫🇴' },
  { value: 'FJ', label: 'Fiji', dialCode: '+679', flag: '🇫🇯' },
  { value: 'FI', label: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { value: 'FR', label: 'France', dialCode: '+33', flag: '🇫🇷' },
  { value: 'GF', label: 'French Guiana', dialCode: '+594', flag: '🇬🇫' },
  { value: 'PF', label: 'French Polynesia', dialCode: '+689', flag: '🇵🇫' },
  { value: 'GA', label: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { value: 'GM', label: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { value: 'GE', label: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
  { value: 'DE', label: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { value: 'GH', label: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { value: 'GI', label: 'Gibraltar', dialCode: '+350', flag: '🇬🇮' },
  { value: 'GR', label: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { value: 'GL', label: 'Greenland', dialCode: '+299', flag: '🇬🇱' },
  { value: 'GD', label: 'Grenada', dialCode: '+1-473', flag: '🇬🇩' },
  { value: 'GP', label: 'Guadeloupe', dialCode: '+590', flag: '🇬🇵' },
  { value: 'GU', label: 'Guam', dialCode: '+1-671', flag: '🇬🇺' },
  { value: 'GT', label: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { value: 'GG', label: 'Guernsey', dialCode: '+44-1481', flag: '🇬🇬' },
  { value: 'GN', label: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
  { value: 'GW', label: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { value: 'GY', label: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
  { value: 'HT', label: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
  { value: 'HN', label: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { value: 'HK', label: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { value: 'HU', label: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { value: 'IS', label: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
  { value: 'IN', label: 'India', dialCode: '+91', flag: '🇮🇳' },
  { value: 'ID', label: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { value: 'IR', label: 'Iran', dialCode: '+98', flag: '🇮🇷' },
  { value: 'IQ', label: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
  { value: 'IE', label: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { value: 'IM', label: 'Isle of Man', dialCode: '+44-1624', flag: '🇮🇲' },
  { value: 'IL', label: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { value: 'IT', label: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { value: 'CI', label: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮' },
  { value: 'JM', label: 'Jamaica', dialCode: '+1-876', flag: '🇯🇲' },
  { value: 'JP', label: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { value: 'JE', label: 'Jersey', dialCode: '+44-1534', flag: '🇯🇪' },
  { value: 'JO', label: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { value: 'KZ', label: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
  { value: 'KE', label: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { value: 'KI', label: 'Kiribati', dialCode: '+686', flag: '🇰🇮' },
  { value: 'XK', label: 'Kosovo', dialCode: '+383', flag: '🇽🇰' },
  { value: 'KW', label: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { value: 'KG', label: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬' },
  { value: 'LA', label: 'Laos', dialCode: '+856', flag: '🇱🇦' },
  { value: 'LV', label: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
  { value: 'LB', label: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { value: 'LS', label: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
  { value: 'LR', label: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { value: 'LY', label: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { value: 'LI', label: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮' },
  { value: 'LT', label: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
  { value: 'LU', label: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { value: 'MO', label: 'Macau', dialCode: '+853', flag: '🇲🇴' },
  { value: 'MG', label: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { value: 'MW', label: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { value: 'MY', label: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { value: 'MV', label: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
  { value: 'ML', label: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { value: 'MT', label: 'Malta', dialCode: '+356', flag: '🇲🇹' },
  { value: 'MH', label: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭' },
  { value: 'MQ', label: 'Martinique', dialCode: '+596', flag: '🇲🇶' },
  { value: 'MR', label: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { value: 'MU', label: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
  { value: 'YT', label: 'Mayotte', dialCode: '+262', flag: '🇾🇹' },
  { value: 'MX', label: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { value: 'FM', label: 'Micronesia', dialCode: '+691', flag: '🇫🇲' },
  { value: 'MD', label: 'Moldova', dialCode: '+373', flag: '🇲🇩' },
  { value: 'MC', label: 'Monaco', dialCode: '+377', flag: '🇲🇨' },
  { value: 'MN', label: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
  { value: 'ME', label: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
  { value: 'MS', label: 'Montserrat', dialCode: '+1-664', flag: '🇲🇸' },
  { value: 'MA', label: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { value: 'MZ', label: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { value: 'MM', label: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { value: 'NA', label: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { value: 'NR', label: 'Nauru', dialCode: '+674', flag: '🇳🇷' },
  { value: 'NP', label: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { value: 'NL', label: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { value: 'NC', label: 'New Caledonia', dialCode: '+687', flag: '🇳🇨' },
  { value: 'NZ', label: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { value: 'NI', label: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { value: 'NE', label: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { value: 'NG', label: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { value: 'NU', label: 'Niue', dialCode: '+683', flag: '🇳🇺' },
  { value: 'NF', label: 'Norfolk Island', dialCode: '+672', flag: '🇳🇫' },
  { value: 'KP', label: 'North Korea', dialCode: '+850', flag: '🇰🇵' },
  { value: 'MK', label: 'North Macedonia', dialCode: '+389', flag: '🇲🇰' },
  { value: 'MP', label: 'Northern Mariana Islands', dialCode: '+1-670', flag: '🇲🇵' },
  { value: 'NO', label: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { value: 'OM', label: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { value: 'PK', label: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { value: 'PW', label: 'Palau', dialCode: '+680', flag: '🇵🇼' },
  { value: 'PS', label: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
  { value: 'PA', label: 'Panama', dialCode: '+507', flag: '🇵🇦' },
  { value: 'PG', label: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬' },
  { value: 'PY', label: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { value: 'PE', label: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { value: 'PH', label: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { value: 'PN', label: 'Pitcairn Islands', dialCode: '+64', flag: '🇵🇳' },
  { value: 'PL', label: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { value: 'PT', label: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { value: 'PR', label: 'Puerto Rico', dialCode: '+1-787', flag: '🇵🇷' },
  { value: 'QA', label: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { value: 'CG', label: 'Republic of the Congo', dialCode: '+242', flag: '🇨🇬' },
  { value: 'RE', label: 'Reunion', dialCode: '+262', flag: '🇷🇪' },
  { value: 'RO', label: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { value: 'RU', label: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { value: 'RW', label: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { value: 'BL', label: 'Saint Barthelemy', dialCode: '+590', flag: '🇧🇱' },
  { value: 'SH', label: 'Saint Helena', dialCode: '+290', flag: '🇸🇭' },
  { value: 'KN', label: 'Saint Kitts and Nevis', dialCode: '+1-869', flag: '🇰🇳' },
  { value: 'LC', label: 'Saint Lucia', dialCode: '+1-758', flag: '🇱🇨' },
  { value: 'MF', label: 'Saint Martin', dialCode: '+590', flag: '🇲🇫' },
  { value: 'PM', label: 'Saint Pierre and Miquelon', dialCode: '+508', flag: '🇵🇲' },
  { value: 'VC', label: 'Saint Vincent and the Grenadines', dialCode: '+1-784', flag: '🇻🇨' },
  { value: 'WS', label: 'Samoa', dialCode: '+685', flag: '🇼🇸' },
  { value: 'SM', label: 'San Marino', dialCode: '+378', flag: '🇸🇲' },
  { value: 'ST', label: 'Sao Tome and Principe', dialCode: '+239', flag: '🇸🇹' },
  { value: 'SA', label: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { value: 'SN', label: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { value: 'RS', label: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
  { value: 'SC', label: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { value: 'SL', label: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { value: 'SG', label: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { value: 'SX', label: 'Sint Maarten', dialCode: '+1-721', flag: '🇸🇽' },
  { value: 'SK', label: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
  { value: 'SI', label: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
  { value: 'SB', label: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧' },
  { value: 'SO', label: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { value: 'ZA', label: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { value: 'KR', label: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { value: 'SS', label: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
  { value: 'ES', label: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { value: 'LK', label: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { value: 'SD', label: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { value: 'SR', label: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
  { value: 'SJ', label: 'Svalbard and Jan Mayen', dialCode: '+47', flag: '🇸🇯' },
  { value: 'SE', label: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { value: 'CH', label: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { value: 'SY', label: 'Syria', dialCode: '+963', flag: '🇸🇾' },
  { value: 'TW', label: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
  { value: 'TJ', label: 'Tajikistan', dialCode: '+992', flag: '🇹🇯' },
  { value: 'TZ', label: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { value: 'TH', label: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { value: 'TL', label: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱' },
  { value: 'TG', label: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { value: 'TK', label: 'Tokelau', dialCode: '+690', flag: '🇹🇰' },
  { value: 'TO', label: 'Tonga', dialCode: '+676', flag: '🇹🇴' },
  { value: 'TT', label: 'Trinidad and Tobago', dialCode: '+1-868', flag: '🇹🇹' },
  { value: 'TN', label: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { value: 'TR', label: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { value: 'TM', label: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲' },
  { value: 'TC', label: 'Turks and Caicos Islands', dialCode: '+1-649', flag: '🇹🇨' },
  { value: 'TV', label: 'Tuvalu', dialCode: '+688', flag: '🇹🇻' },
  { value: 'VI', label: 'US Virgin Islands', dialCode: '+1-340', flag: '🇻🇮' },
  { value: 'UG', label: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { value: 'UA', label: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { value: 'AE', label: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { value: 'GB', label: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { value: 'US', label: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { value: 'UY', label: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { value: 'UZ', label: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿' },
  { value: 'VU', label: 'Vanuatu', dialCode: '+678', flag: '🇻🇺' },
  { value: 'VA', label: 'Vatican City', dialCode: '+39-06', flag: '🇻🇦' },
  { value: 'VE', label: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { value: 'VN', label: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { value: 'WF', label: 'Wallis and Futuna', dialCode: '+681', flag: '🇼🇫' },
  { value: 'EH', label: 'Western Sahara', dialCode: '+212', flag: '🇪🇭' },
  { value: 'YE', label: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
  { value: 'ZM', label: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
  { value: 'ZW', label: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' }
]

export const phonePrefixes = [
  { code: 'AF', label: 'AF +93', prefix: '+93' },
  { code: 'AL', label: 'AL +355', prefix: '+355' },
  { code: 'DZ', label: 'DZ +213', prefix: '+213' },
  { code: 'AD', label: 'AD +376', prefix: '+376' },
  { code: 'AO', label: 'AO +244', prefix: '+244' },
  { code: 'AG', label: 'AG +1268', prefix: '+1268' },
  { code: 'AR', label: 'AR +54', prefix: '+54' },
  { code: 'AM', label: 'AM +374', prefix: '+374' },
  { code: 'AU', label: 'AU +61', prefix: '+61' },
  { code: 'AT', label: 'AT +43', prefix: '+43' },
  { code: 'AZ', label: 'AZ +994', prefix: '+994' },
  { code: 'BS', label: 'BS +1242', prefix: '+1242' },
  { code: 'BH', label: 'BH +973', prefix: '+973' },
  { code: 'BD', label: 'BD +880', prefix: '+880' },
  { code: 'BB', label: 'BB +1246', prefix: '+1246' },
  { code: 'BY', label: 'BY +375', prefix: '+375' },
  { code: 'BE', label: 'BE +32', prefix: '+32' },
  { code: 'BZ', label: 'BZ +501', prefix: '+501' },
  { code: 'BJ', label: 'BJ +229', prefix: '+229' },
  { code: 'BT', label: 'BT +975', prefix: '+975' },
  { code: 'BO', label: 'BO +591', prefix: '+591' },
  { code: 'BA', label: 'BA +387', prefix: '+387' },
  { code: 'BW', label: 'BW +267', prefix: '+267' },
  { code: 'BR', label: 'BR +55', prefix: '+55' },
  { code: 'BN', label: 'BN +673', prefix: '+673' },
  { code: 'BG', label: 'BG +359', prefix: '+359' },
  { code: 'BF', label: 'BF +226', prefix: '+226' },
  { code: 'BI', label: 'BI +257', prefix: '+257' },
  { code: 'CV', label: 'CV +238', prefix: '+238' },
  { code: 'KH', label: 'KH +855', prefix: '+855' },
  { code: 'CM', label: 'CM +237', prefix: '+237' },
  { code: 'CA', label: 'CA +1', prefix: '+1' },
  { code: 'CF', label: 'CF +236', prefix: '+236' },
  { code: 'TD', label: 'TD +235', prefix: '+235' },
  { code: 'CL', label: 'CL +56', prefix: '+56' },
  { code: 'CN', label: 'CN +86', prefix: '+86' },
  { code: 'CO', label: 'CO +57', prefix: '+57' },
  { code: 'KM', label: 'KM +269', prefix: '+269' },
  { code: 'CD', label: 'CD +243', prefix: '+243' },
  { code: 'CG', label: 'CG +242', prefix: '+242' },
  { code: 'CR', label: 'CR +506', prefix: '+506' },
  { code: 'HR', label: 'HR +385', prefix: '+385' },
  { code: 'CU', label: 'CU +53', prefix: '+53' },
  { code: 'CY', label: 'CY +357', prefix: '+357' },
  { code: 'CZ', label: 'CZ +420', prefix: '+420' },
  { code: 'DK', label: 'DK +45', prefix: '+45' },
  { code: 'DJ', label: 'DJ +253', prefix: '+253' },
  { code: 'DM', label: 'DM +1767', prefix: '+1767' },
  { code: 'DO', label: 'DO +1809', prefix: '+1809' },
  { code: 'EC', label: 'EC +593', prefix: '+593' },
  { code: 'EG', label: 'EG +20', prefix: '+20' },
  { code: 'SV', label: 'SV +503', prefix: '+503' },
  { code: 'GQ', label: 'GQ +240', prefix: '+240' },
  { code: 'ER', label: 'ER +291', prefix: '+291' },
  { code: 'EE', label: 'EE +372', prefix: '+372' },
  { code: 'SZ', label: 'SZ +268', prefix: '+268' },
  { code: 'ET', label: 'ET +251', prefix: '+251' },
  { code: 'FJ', label: 'FJ +679', prefix: '+679' },
  { code: 'FI', label: 'FI +358', prefix: '+358' },
  { code: 'FR', label: 'FR +33', prefix: '+33' },
  { code: 'GA', label: 'GA +241', prefix: '+241' },
  { code: 'GM', label: 'GM +220', prefix: '+220' },
  { code: 'GE', label: 'GE +995', prefix: '+995' },
  { code: 'DE', label: 'DE +49', prefix: '+49' },
  { code: 'GH', label: 'GH +233', prefix: '+233' },
  { code: 'GR', label: 'GR +30', prefix: '+30' },
  { code: 'GD', label: 'GD +1473', prefix: '+1473' },
  { code: 'GT', label: 'GT +502', prefix: '+502' },
  { code: 'GN', label: 'GN +224', prefix: '+224' },
  { code: 'GW', label: 'GW +245', prefix: '+245' },
  { code: 'GY', label: 'GY +592', prefix: '+592' },
  { code: 'HT', label: 'HT +509', prefix: '+509' },
  { code: 'HN', label: 'HN +504', prefix: '+504' },
  { code: 'HU', label: 'HU +36', prefix: '+36' },
  { code: 'IS', label: 'IS +354', prefix: '+354' },
  { code: 'IN', label: 'IN +91', prefix: '+91' },
  { code: 'ID', label: 'ID +62', prefix: '+62' },
  { code: 'IR', label: 'IR +98', prefix: '+98' },
  { code: 'IQ', label: 'IQ +964', prefix: '+964' },
  { code: 'IE', label: 'IE +353', prefix: '+353' },
  { code: 'IL', label: 'IL +972', prefix: '+972' },
  { code: 'IT', label: 'IT +39', prefix: '+39' },
  { code: 'JM', label: 'JM +1876', prefix: '+1876' },
  { code: 'JP', label: 'JP +81', prefix: '+81' },
  { code: 'JO', label: 'JO +962', prefix: '+962' },
  { code: 'KZ', label: 'KZ +7', prefix: '+7' },
  { code: 'KE', label: 'KE +254', prefix: '+254' },
  { code: 'KI', label: 'KI +686', prefix: '+686' },
  { code: 'KP', label: 'KP +850', prefix: '+850' },
  { code: 'KR', label: 'KR +82', prefix: '+82' },
  { code: 'KW', label: 'KW +965', prefix: '+965' },
  { code: 'KG', label: 'KG +996', prefix: '+996' },
  { code: 'LA', label: 'LA +856', prefix: '+856' },
  { code: 'LV', label: 'LV +371', prefix: '+371' },
  { code: 'LB', label: 'LB +961', prefix: '+961' },
  { code: 'LS', label: 'LS +266', prefix: '+266' },
  { code: 'LR', label: 'LR +231', prefix: '+231' },
  { code: 'LY', label: 'LY +218', prefix: '+218' },
  { code: 'LI', label: 'LI +423', prefix: '+423' },
  { code: 'LT', label: 'LT +370', prefix: '+370' },
  { code: 'LU', label: 'LU +352', prefix: '+352' },
  { code: 'MG', label: 'MG +261', prefix: '+261' },
  { code: 'MW', label: 'MW +265', prefix: '+265' },
  { code: 'MY', label: 'MY +60', prefix: '+60' },
  { code: 'MV', label: 'MV +960', prefix: '+960' },
  { code: 'ML', label: 'ML +223', prefix: '+223' },
  { code: 'MT', label: 'MT +356', prefix: '+356' },
  { code: 'MH', label: 'MH +692', prefix: '+692' },
  { code: 'MR', label: 'MR +222', prefix: '+222' },
  { code: 'MU', label: 'MU +230', prefix: '+230' },
  { code: 'MX', label: 'MX +52', prefix: '+52' },
  { code: 'FM', label: 'FM +691', prefix: '+691' },
  { code: 'MD', label: 'MD +373', prefix: '+373' },
  { code: 'MC', label: 'MC +377', prefix: '+377' },
  { code: 'MN', label: 'MN +976', prefix: '+976' },
  { code: 'ME', label: 'ME +382', prefix: '+382' },
  { code: 'MA', label: 'MA +212', prefix: '+212' },
  { code: 'MZ', label: 'MZ +258', prefix: '+258' },
  { code: 'MM', label: 'MM +95', prefix: '+95' },
  { code: 'NA', label: 'NA +264', prefix: '+264' },
  { code: 'NR', label: 'NR +674', prefix: '+674' },
  { code: 'NP', label: 'NP +977', prefix: '+977' },
  { code: 'NL', label: 'NL +31', prefix: '+31' },
  { code: 'NZ', label: 'NZ +64', prefix: '+64' },
  { code: 'NI', label: 'NI +505', prefix: '+505' },
  { code: 'NE', label: 'NE +227', prefix: '+227' },
  { code: 'NG', label: 'NG +234', prefix: '+234' },
  { code: 'MK', label: 'MK +389', prefix: '+389' },
  { code: 'NO', label: 'NO +47', prefix: '+47' },
  { code: 'OM', label: 'OM +968', prefix: '+968' },
  { code: 'PK', label: 'PK +92', prefix: '+92' },
  { code: 'PW', label: 'PW +680', prefix: '+680' },
  { code: 'PA', label: 'PA +507', prefix: '+507' },
  { code: 'PG', label: 'PG +675', prefix: '+675' },
  { code: 'PY', label: 'PY +595', prefix: '+595' },
  { code: 'PE', label: 'PE +51', prefix: '+51' },
  { code: 'PH', label: 'PH +63', prefix: '+63' },
  { code: 'PL', label: 'PL +48', prefix: '+48' },
  { code: 'PT', label: 'PT +351', prefix: '+351' },
  { code: 'QA', label: 'QA +974', prefix: '+974' },
  { code: 'RO', label: 'RO +40', prefix: '+40' },
  { code: 'RU', label: 'RU +7', prefix: '+7' },
  { code: 'RW', label: 'RW +250', prefix: '+250' },
  { code: 'KN', label: 'KN +1869', prefix: '+1869' },
  { code: 'LC', label: 'LC +1758', prefix: '+1758' },
  { code: 'VC', label: 'VC +1784', prefix: '+1784' },
  { code: 'WS', label: 'WS +685', prefix: '+685' },
  { code: 'SM', label: 'SM +378', prefix: '+378' },
  { code: 'ST', label: 'ST +239', prefix: '+239' },
  { code: 'SA', label: 'SA +966', prefix: '+966' },
  { code: 'SN', label: 'SN +221', prefix: '+221' },
  { code: 'RS', label: 'RS +381', prefix: '+381' },
  { code: 'SC', label: 'SC +248', prefix: '+248' },
  { code: 'SL', label: 'SL +232', prefix: '+232' },
  { code: 'SG', label: 'SG +65', prefix: '+65' },
  { code: 'SK', label: 'SK +421', prefix: '+421' },
  { code: 'SI', label: 'SI +386', prefix: '+386' },
  { code: 'SB', label: 'SB +677', prefix: '+677' },
  { code: 'SO', label: 'SO +252', prefix: '+252' },
  { code: 'ZA', label: 'ZA +27', prefix: '+27' },
  { code: 'SS', label: 'SS +211', prefix: '+211' },
  { code: 'ES', label: 'ES +34', prefix: '+34' },
  { code: 'LK', label: 'LK +94', prefix: '+94' },
  { code: 'SD', label: 'SD +249', prefix: '+249' },
  { code: 'SR', label: 'SR +597', prefix: '+597' },
  { code: 'SE', label: 'SE +46', prefix: '+46' },
  { code: 'CH', label: 'CH +41', prefix: '+41' },
  { code: 'SY', label: 'SY +963', prefix: '+963' },
  { code: 'TW', label: 'TW +886', prefix: '+886' },
  { code: 'TJ', label: 'TJ +992', prefix: '+992' },
  { code: 'TZ', label: 'TZ +255', prefix: '+255' },
  { code: 'TH', label: 'TH +66', prefix: '+66' },
  { code: 'TL', label: 'TL +670', prefix: '+670' },
  { code: 'TG', label: 'TG +228', prefix: '+228' },
  { code: 'TO', label: 'TO +676', prefix: '+676' },
  { code: 'TT', label: 'TT +1868', prefix: '+1868' },
  { code: 'TN', label: 'TN +216', prefix: '+216' },
  { code: 'TR', label: 'TR +90', prefix: '+90' },
  { code: 'TM', label: 'TM +993', prefix: '+993' },
  { code: 'TV', label: 'TV +688', prefix: '+688' },
  { code: 'UG', label: 'UG +256', prefix: '+256' },
  { code: 'UA', label: 'UA +380', prefix: '+380' },
  { code: 'AE', label: 'AE +971', prefix: '+971' },
  { code: 'GB', label: 'GB +44', prefix: '+44' },
  { code: 'US', label: 'US +1', prefix: '+1' },
  { code: 'UY', label: 'UY +598', prefix: '+598' },
  { code: 'UZ', label: 'UZ +998', prefix: '+998' },
  { code: 'VU', label: 'VU +678', prefix: '+678' },
  { code: 'VE', label: 'VE +58', prefix: '+58' },
  { code: 'VN', label: 'VN +84', prefix: '+84' },
  { code: 'YE', label: 'YE +967', prefix: '+967' },
  { code: 'ZM', label: 'ZM +260', prefix: '+260' },
  { code: 'ZW', label: 'ZW +263', prefix: '+263' }
]

export const arrivalTimeOptions = [
  "I don't know yet",
  'Before 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
  '6:00 PM – 8:00 PM',
  '8:00 PM – 10:00 PM',
  'After 10:00 PM'
]

export const SELLER_TYPES = [
  { value: 1, title: 'Individual' },
  { value: 2, title: 'Business' }
]

export const CONDITIONS = [
  { value: 1, title: 'New' },
  { value: 2, title: 'Like New' },
  { value: 3, title: 'Used' }
]

export const DELIVERY_OPTIONS = [
  { value: 1, title: 'Shipping' },
  { value: 2, title: 'Local Pickup' }
]
