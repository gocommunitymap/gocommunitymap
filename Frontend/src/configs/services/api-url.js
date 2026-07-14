const apiPrefix = '/api/'
const authPrefix = '/auth/'
const fileProcessPrefix = '/fileprocess/'

const setAPIPrefix = value => `${apiPrefix}${value}`
const setAuthPrefix = value => `${authPrefix}${value}`

export const setFileProcessPrefix = value => `${fileProcessPrefix}${value}`

export const API_URL = Object.freeze({
  LOGIN: setAuthPrefix('GenerateToken'),
  LOGOUT: setAuthPrefix('TokenRevoke'),
  TOKEN_VERIFY: setAuthPrefix('AuthenticateValidToken'),
  PERMISSIONS: setAPIPrefix('SP_PERMISSIONS'),
  NAVIGATION: setAPIPrefix('P_USER_PERMISSION'),
  FORMS: setAPIPrefix('SP_FORMS'),
  MENU_LIST: setAPIPrefix('SP_MENU_LIST'),

  // ----------Guest END POINTS---------- //
  GET_FILE: setFileProcessPrefix('GetFile'),
  UPLOAD_FILE: setFileProcessPrefix('UploadFile'),
  DELETE_FILE: setFileProcessPrefix('DeleteFile'),

  // ----------Guest END POINTS---------- //
  HOME_NAVIGATION: '/Navbar/GetNavbar',
  HOME_SECTIONS: '/Sections/GetSections',
  DISCOVER_SECTION: '/DiscoverSection/GetDiscoverSection',
  GET_PROPERTIES_FULL_DETAILS: '/Guest/GetPropertiesFullDetails',
  GET_PROPERTIES: '/Guest/GetProperties',
  GET_PROPERTIES_FOR_MAP: '/Guest/GetPropertiesForMap',
  GET_PROPERTIES_BY_USER: '/Guest/GetPropertiesByUser',
  GET_AGENT_INFO: '/Guest/GetAgentInfo',
  GET_AGENT_LIST: '/Guest/GetAgentList',
  GET_PLACES_BY_POSTCODE: '/Guest/GetPlacesByPostCode',
  GET_HOTEL_BOOKING_CALENDAR: '/BookingCalendar/GetHotelBookingCalendar',
  GET_RENTAL_BOOKING_CALENDAR: '/BookingCalendar/GetRentalBookingCalendar',

  // ----------Guest END POINTS---------- //
  GET_SAVED_LINK: 'SavedLinks/GetSavedLinks',
  POST_SAVED_LINK: 'SavedLinks/PostSavedLinks',
  DELETE_SAVED_LINK: 'SavedLinks/DeleteSavedLinks',

  // ----------ADMIN END POINTS---------- //
  GET_ROLE: '/Role/GetRole',
  GET_ROLE_MASTER: '/Role/GetRoleMaster',
  CREATE_ROLE: '/Role/CreateRole',
  UPDATE_ROLE: '/Role/UpdateRole',
  DELETE_ROLE: '/Role/DeleteRole',
  GET_USER: '/SetUsers/GetUsers',
  GET_AGENT_USER: '/SetUsers/GetAgentUsers',
  REGISTER_USER: '/SetUsers/RegisterUser',
  CREATE_USER: '/SetUsers/CreateUsers',
  UPDATE_USER: '/SetUsers/UpdateUsers',
  DELETE_USER: '/SetUsers/DeleteUsers',
  CHANGE_PASSWORD: '/SetUsers/ChangePassword',

  // ----------WEBSITE END POINTS---------- //
  GET_NEWS: '/News/GetNews',
  CREATE_NEWS: '/News/CreateNews',
  UPDATE_NEWS: '/News/UpdateNews',
  DELETE_NEWS: '/News/DeleteNews',

  GET_COMMUNITIES: '/Communities/GetCommunities',
  CREATE_COMMUNITIES: '/Communities/CreateCommunities',
  UPDATE_COMMUNITIES: '/Communities/UpdateCommunities',
  DELETE_COMMUNITIES: '/Communities/DeleteCommunities',
  GET_COMMUNITY_MEMBER: '/Communities/GetCommunitiesMemberList',
  UPDATE_COMMUNITY_MEMBER: '/Communities/UpdateCommunitiesMemberList',

  GET_GLOBAL_PARAMETERS: '/GlobalParameters/GetGlobalParameters',
  GET_GLOBAL_PARAMETERS_BY_TYPE_CODES: '/GlobalParameters/GetGlobalParametersByTypeCodes',
  CREATE_GLOBAL_PARAMETERS: '/GlobalParameters/CreateGlobalParameters',
  UPDATE_GLOBAL_PARAMETERS: '/GlobalParameters/UpdateGlobalParameters',
  DELETE_GLOBAL_PARAMETERS: '/GlobalParameters/DeleteGlobalParameters',

  GET_PROPERTY_SETUP: '/SetProperties/GetProperty',
  GET_PROPERTY_SETUP_LIST: '/SetProperties/GetPropertySetupList',
  CREATE_PROPERTY_SETUP: '/SetProperties/CreateProperty',
  UPDATE_PROPERTY_SETUP: '/SetProperties/UpdateProperty',
  DELETE_PROPERTY_SETUP: '/SetProperties/DeleteProperty',

  GET_ROOM_DETAIL: '/Rooms/GetRooms',
  CREATE_ROOM_DETAIL: '/Rooms/CreateRoom',
  UPDATE_ROOM_DETAIL: '/Rooms/UpdateRoom',
  DELETE_ROOM_DETAIL: '/Rooms/DeleteRoom',

  GET_PRODUCT_SETUP: '/SetProducts/GetProduct',
  GET_PRODUCT_SETUP_LIST: '/SetProducts/GetProductSetupList',
  CREATE_PRODUCT_SETUP: '/SetProducts/CreateProduct',
  UPDATE_PRODUCT_SETUP: '/SetProducts/UpdateProduct',
  DELETE_PRODUCT_SETUP: '/SetProducts/DeleteProduct',

  // ----------Navigation ---------- //
  GET_NAV: '/Navbar/GetNavbar',
  CREATE_NAV: '/Navbar/CreateNavbar',
  UPDATE_NAV: '/Navbar/UpdateNavbar',
  DELETE_NAV: '/Navbar/DeleteNavbar',

  // ----------Navigation ---------- //
  GET_DISCOVER_SECTION: '/DiscoverSection/GetDiscoverSection',
  CREATE_DISCOVER_SECTION: '/DiscoverSection/CreateDiscoverSection',
  UPDATE_DISCOVER_SECTION: '/DiscoverSection/UpdateDiscoverSection',
  DELETE_DISCOVER_SECTION: '/DiscoverSection/DeleteDiscoverSection',

  // ----------Sections---------- //
  GET_SECTIONS: '/Sections/GetSections',
  CREATE_SECTIONS: '/Sections/CreateSection',
  UPDATE_SECTIONS: '/Sections/UpdateSection',
  DELETE_SECTIONS: '/Sections/DeleteSection',

  // ----------Sections---------- //
  GET_FEATURES: '/Features/GetFeatures',
  CREATE_FEATURES: '/Features/CreateFeatures',
  UPDATE_FEATURES: '/Features/UpdateFeatures',
  DELETE_FEATURES: '/Features/DeleteFeatures',

  // ----------Utilities---------- //
  GET_UTILITIES: '/Utilities/GetUtilities',
  CREATE_UTILITIES: '/Utilities/CreateUtilities',
  UPDATE_UTILITIES: '/Utilities/UpdateUtilities',
  DELETE_UTILITIES: '/Utilities/DeleteUtilities',

  // ----------Using and Plannings---------- //
  GET_USING_AND_PLANNING: '/UsingPlanning/GetUsingPlanning',
  CREATE_USING_AND_PLANNING: '/UsingPlanning/CreateUsingPlanning',
  UPDATE_USING_AND_PLANNING: '/UsingPlanning/UpdateUsingPlanning',
  DELETE_USING_AND_PLANNING: '/UsingPlanning/DeleteUsingPlanning',

  //-------------Password------------//
  FORGOT_PASSWORD: '/ForgotPassword',
  GET_RESET_REQUEST: '/GetResetRequest',
  RESET_PASSWORD: '/ResetPassword',

  // ----------Agent Subscription---------- //
  GET_AGENT_SUBSCRIPTION: '/SetAgentSubscription/GetAgentSubscription',
  CREATE_AGENT_SUBSCRIPTION: '/SetAgentSubscription/CreateAgentSubscription',
  UPDATE_AGENT_SUBSCRIPTION: '/SetAgentSubscription/UpdateAgentSubscription',
  DELETE_AGENT_SUBSCRIPTION: '/SetAgentSubscription/DeleteAgentSubscription',

  // ----------Agent Valuation---------- //
  GET_AGENT_VALUATION: '/AgentValuation/GetAgentValuation',
  GET_AGENT_VALUATION_BY_AGENT: '/AgentValuation/GetAgentValuationByAgent',
  CREATE_AGENT_VALUATION: '/AgentValuation/CreateAgentValuation',

  GET_INSTANT_VALUATION: '/InstantValuation/GetInstantValuation',
  CREATE_INSTANT_VALUATION: '/InstantValuation/CreateInstantValuation',

  // ----------Bookings---------- //
  GET_BOOKING: '/HotelBookings/GetBookings',
  GET_BOOKING_STATUS: '/HotelBookings/GetBookingStatus',
  CREATE_BOOKING: '/HotelBookings/CreateBooking',
  UPDATE_BOOKING: '/HotelBookings/UpdateBooking',
  CANCEL_BOOKING: '/HotelBookings/CancelBooking',
  DELETE_BOOKING: '/HotelBookings/DeleteBooking',

  // ----------Payment---------- //
  CREATE_PAYMENT: '/Payment/CreatePayment'
})
