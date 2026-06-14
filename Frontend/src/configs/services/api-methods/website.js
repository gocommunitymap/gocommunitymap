import { getRequest, postRequest, deleteRequest } from '../http'
import { API_URL } from '../api-url'
import { updateParams } from '../constant-functions.js'
import { listingTypes } from '../constant-data'

//>>>>>>>>>>>NEWS<<<<<<<<<<<//
export const getNewsAPI = params => getRequest(API_URL.GET_NEWS, { data: updateParams(params) })

export const createNewsAPI = params => postRequest(API_URL.CREATE_NEWS, { data: updateParams(params) })

export const updateNewsAPI = params => postRequest(API_URL.UPDATE_NEWS, { data: updateParams(params) })

export const deleteNewsAPI = params => deleteRequest(API_URL.DELETE_NEWS, { data: updateParams(params) })

//>>>>>>>>>>>COMMUNITY<<<<<<<<<<<//

export const getCommunityAPI = params => getRequest(API_URL.GET_COMMUNITIES, { data: updateParams(params) })

export const getCommunitiesAPI = params =>
  getRequest(API_URL.GET_COMMUNITIES, {
    data: updateParams(params),
    config: { useBaseURL: true, isGuest: true, errorToast: false }
  })

export const createCommunityAPI = params => postRequest(API_URL.CREATE_COMMUNITIES, { data: updateParams(params) })

export const updateCommunityAPI = params => postRequest(API_URL.UPDATE_COMMUNITIES, { data: updateParams(params) })

export const deleteCommunityAPI = params => deleteRequest(API_URL.DELETE_COMMUNITIES, { data: updateParams(params) })

export const getCommunityMemberAPI = params => getRequest(API_URL.GET_COMMUNITY_MEMBER, { data: updateParams(params) })

export const getCommunitiesMemberListAPI = params =>
  getRequest(API_URL.GET_COMMUNITY_MEMBER, { data: updateParams(params) })

export const updateCommunityMemberAPI = params =>
  postRequest(API_URL.UPDATE_COMMUNITY_MEMBER, { params: updateParams(params), config: { toast: false } })

//>>>>>>>>>>>Navigation<<<<<<<<<<<//
export const getNavAPI = params => getRequest(API_URL.GET_NAV, { data: updateParams(params) })

export const createNavAPI = params => postRequest(API_URL.CREATE_NAV, { data: updateParams(params) })

export const updateNavAPI = params => postRequest(API_URL.UPDATE_NAV, { data: updateParams(params) })

export const deleteNavAPI = params => deleteRequest(API_URL.DELETE_NAV, { data: updateParams(params) })

//>>>>>>>>>>>Discover Section<<<<<<<<<<<//
export const getDiscoverSectionAPI = params => getRequest(API_URL.GET_DISCOVER_SECTION, { data: updateParams(params) })

export const createDiscoverSectionAPI = params =>
  postRequest(API_URL.CREATE_DISCOVER_SECTION, { data: updateParams(params) })

export const updateDiscoverSectionAPI = params =>
  postRequest(API_URL.UPDATE_DISCOVER_SECTION, { data: updateParams(params) })

export const deleteDiscoverSectionAPI = params =>
  deleteRequest(API_URL.DELETE_DISCOVER_SECTION, { data: updateParams(params) })

//>>>>>>>>>>>Sections<<<<<<<<<<<//
export const getSectionsAPI = params => getRequest(API_URL.GET_SECTIONS, { data: updateParams(params) })

export const createSectionsAPI = params => postRequest(API_URL.CREATE_SECTIONS, { data: updateParams(params) })

export const updateSectionsAPI = params => postRequest(API_URL.UPDATE_SECTIONS, { data: updateParams(params) })

export const deleteSectionsAPI = params => deleteRequest(API_URL.DELETE_SECTIONS, { data: updateParams(params) })

//>>>>>>>>>>>Features<<<<<<<<<<<//
export const getFeaturesAPI = params => getRequest(API_URL.GET_FEATURES, { data: updateParams(params) })

export const createFeaturesAPI = params => postRequest(API_URL.CREATE_FEATURES, { data: updateParams(params) })

export const updateFeaturesAPI = params => postRequest(API_URL.UPDATE_FEATURES, { data: updateParams(params) })

export const deleteFeaturesAPI = params => deleteRequest(API_URL.DELETE_FEATURES, { data: updateParams(params) })

//>>>>>>>>>>>Utilities<<<<<<<<<<<//
export const getUtilitiesAPI = params => getRequest(API_URL.GET_UTILITIES, { data: updateParams(params) })

export const createUtilitiesAPI = params => postRequest(API_URL.CREATE_UTILITIES, { data: updateParams(params) })

export const updateUtilitiesAPI = params => postRequest(API_URL.UPDATE_UTILITIES, { data: updateParams(params) })

export const deleteUtilitiesAPI = params => deleteRequest(API_URL.DELETE_UTILITIES, { data: updateParams(params) })

//>>>>>>>>>>>Using and Plannings<<<<<<<<<<<//
export const getUsingAndPlanningAPI = params =>
  getRequest(API_URL.GET_USING_AND_PLANNING, { data: updateParams(params) })

export const createUsingAndPlanningAPI = params =>
  postRequest(API_URL.CREATE_USING_AND_PLANNING, { data: updateParams(params) })

export const updateUsingAndPlanningAPI = params =>
  postRequest(API_URL.UPDATE_USING_AND_PLANNING, { data: updateParams(params) })

export const deleteUsingAndPlanningAPI = params =>
  deleteRequest(API_URL.DELETE_USING_AND_PLANNING, { data: updateParams(params) })

//>>>>>>>>>>>Saved Links<<<<<<<<<<<//
export const getSavedLinksAPI = params => getRequest(API_URL.GET_SAVED_LINK, { data: updateParams(params) })

export const postSavedLinksAPI = params =>
  postRequest(API_URL.POST_SAVED_LINK, { data: updateParams(params), config: { toast: false } })

export const deleteSavedLinksAPI = params =>
  deleteRequest(API_URL.DELETE_SAVED_LINK, { data: updateParams(params), config: { toast: false } })

//>>>>>>>>>>>Global Parameters<<<<<<<<<<<//
export const getGlobalParametersAPI = params =>
  getRequest(API_URL.GET_GLOBAL_PARAMETERS, {
    data: updateParams(params),
    config: { useBaseURL: true, isGuest: true, toast: false }
  })

export const getGlobalParametersGuestAPI = params =>
  getRequest(API_URL.GET_GLOBAL_PARAMETERS, { data: params, config: { useBaseURL: true, isGuest: true, toast: false } })

export const getGlobalParametersByTypeCodesAPI = params =>
  getRequest(API_URL.GET_GLOBAL_PARAMETERS_BY_TYPE_CODES, {
    data: updateParams(params),
    config: { useBaseURL: true, isGuest: true, toast: false }
  })

export const createGlobalParametersAPI = params => {
  return postRequest(API_URL.CREATE_GLOBAL_PARAMETERS, { data: updateParams(params) })
}

export const updateGlobalParametersAPI = params =>
  postRequest(API_URL.UPDATE_GLOBAL_PARAMETERS, { data: updateParams(params) })

export const deleteGlobalParametersAPI = params =>
  deleteRequest(API_URL.DELETE_GLOBAL_PARAMETERS, { data: updateParams(params) })

//>>>>>>>>>>>Property Setup Hotels/Rental<<<<<<<<<<<//
export const getPropertySetupHotelsSetupListAPI = params =>
  getRequest(API_URL.GET_PROPERTY_SETUP_LIST, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID })
  })

export const getPropertySetupHotelsAPI = params =>
  getRequest(API_URL.GET_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID })
  })

export const createPropertySetupHotelsAPI = params =>
  postRequest(API_URL.CREATE_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID })
  })

export const updatePropertySetupHotelsAPI = params =>
  postRequest(API_URL.UPDATE_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID })
  })

export const deletePropertySetupHotelsAPI = params =>
  deleteRequest(API_URL.DELETE_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID })
  })

export const getPropertySetupRentalsSetupListAPI = params =>
  getRequest(API_URL.GET_PROPERTY_SETUP_LIST, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })
  })

export const getPropertySetupRentalAPI = params =>
  getRequest(API_URL.GET_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })
  })

export const createPropertySetupRentalAPI = params =>
  postRequest(API_URL.CREATE_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })
  })

export const updatePropertySetupRentalAPI = params =>
  postRequest(API_URL.UPDATE_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })
  })

export const deletePropertySetupRentalAPI = params =>
  deleteRequest(API_URL.DELETE_PROPERTY_SETUP, {
    data: updateParams({ ...params, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })
  })

//>>>>>>>>>>>Room Detail<<<<<<<<<<<//
export const getRoomDetailAPI = params => getRequest(API_URL.GET_ROOM_DETAIL, { data: updateParams(params) })

export const createRoomDetailAPI = params => postRequest(API_URL.CREATE_ROOM_DETAIL, { data: updateParams(params) })

export const updateRoomDetailAPI = params => postRequest(API_URL.UPDATE_ROOM_DETAIL, { data: updateParams(params) })

export const deleteRoomDetailAPI = params => deleteRequest(API_URL.DELETE_ROOM_DETAIL, { data: updateParams(params) })

//>>>>>>>>>>>Product Setup<<<<<<<<<<<//

export const getProductSetupListAPI = params =>
  getRequest(API_URL.GET_PRODUCT_SETUP_LIST, {
    data: updateParams(params)
  })

export const getProductSetupAPI = params =>
  getRequest(API_URL.GET_PRODUCT_SETUP, {
    data: updateParams(params)
  })

export const createProductSetupAPI = params =>
  postRequest(API_URL.CREATE_PRODUCT_SETUP, {
    data: updateParams(params)
  })

export const updateProductSetupAPI = params =>
  postRequest(API_URL.UPDATE_PRODUCT_SETUP, {
    data: updateParams(params)
  })

export const deleteProductSetupAPI = params =>
  deleteRequest(API_URL.DELETE_PRODUCT_SETUP, {
    data: updateParams(params)
  })

//>>>>>>>>>>>Agent Subscription<<<<<<<<<<<//
export const getAgentSubscriptionAPI = params =>
  getRequest(API_URL.GET_AGENT_SUBSCRIPTION, { data: updateParams(params) })

export const createAgentSubscriptionAPI = params =>
  postRequest(API_URL.CREATE_AGENT_SUBSCRIPTION, { data: updateParams(params) })

export const updateAgentSubscriptionAPI = params =>
  postRequest(API_URL.UPDATE_AGENT_SUBSCRIPTION, { data: updateParams(params) })

export const deleteAgentSubscriptionAPI = params =>
  deleteRequest(API_URL.DELETE_AGENT_SUBSCRIPTION, { data: updateParams(params) })

//>>>>>>>>>>>Agent Valuation<<<<<<<<<<<//
export const getAgentValuationAPI = params =>
  getRequest(API_URL.GET_AGENT_VALUATION_BY_AGENT, { data: updateParams(params) })

export const getAgentValuationByAgentAPI = params =>
  getRequest(API_URL.GET_AGENT_VALUATION, { data: updateParams(params) })

export const createAgentValuationAPI = params =>
  postRequest(API_URL.CREATE_AGENT_VALUATION, { data: updateParams(params), config: { isGuest: true, toast: false } })

//>>>>>>>>>>>Instant Valuation<<<<<<<<<<<//
export const getInstantValuationAPI = params =>
  getRequest(API_URL.GET_INSTANT_VALUATION, { data: updateParams(params) })

export const createInstantValuationAPI = params =>
  postRequest(API_URL.CREATE_INSTANT_VALUATION, { data: updateParams(params), config: { isGuest: true, toast: false } })
