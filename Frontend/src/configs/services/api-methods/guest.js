import { getRequest, postRequest } from '../http'
import { API_URL } from '../api-url'
import { staticParams, updateParams } from '../constant-functions.js'

//>>>>>>>>>>>Get<<<<<<<<<<<//

export const getHomeNavigation1API = params =>
  getRequest(API_URL.HOME_NAVIGATION, {
    data: { ...staticParams(params), active: true, type: 1 },
    config: { useBaseURL: true, isGuest: true }
  })

export const getHomeNavigation2API = params =>
  getRequest(API_URL.HOME_NAVIGATION, {
    data: { ...staticParams(params), active: true, type: 2 },
    config: { useBaseURL: true, isGuest: true }
  })

export const getFooterLinksAPI = params =>
  getRequest(API_URL.HOME_NAVIGATION, {
    data: { ...staticParams(params), active: true, type: 3 },
    config: { useBaseURL: true, isGuest: true }
  })

export const getHomeSectionsAPI = params =>
  getRequest(API_URL.HOME_SECTIONS, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const getNewsSectionsAPI = async params =>
  await getRequest(API_URL.GET_NEWS, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const getDiscoverSectionsAPI = params =>
  getRequest(API_URL.DISCOVER_SECTION, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const getPropertiesAPI = params =>
  getRequest(API_URL.GET_PROPERTIES, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const getPropertiesFullDetailsAPI = params =>
  getRequest(API_URL.GET_PROPERTIES_FULL_DETAILS, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const getPropertiesByUserAPI = params =>
  getRequest(API_URL.GET_PROPERTIES_BY_USER, {
    data: { ...updateParams(params), active: true }
  })

export const getAgentInfoAPI = params =>
  getRequest(API_URL.GET_AGENT_INFO, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const getAgentListAPI = params =>
  getRequest(API_URL.GET_AGENT_LIST, {
    data: { ...staticParams(params) },
    config: { useBaseURL: true, isGuest: true }
  })

export const GetPlacesByPostCodeAPI = params =>
  getRequest(API_URL.GET_PLACES_BY_POSTCODE, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

export const CreateValuation = params =>
  getRequest(API_URL.CreateValuation, {
    data: { ...staticParams(params), active: true },
    config: { useBaseURL: true, isGuest: true }
  })

//>>>>>>>>>>>Bookings<<<<<<<<<<<//

export const createBookingAPI = data =>
  postRequest(API_URL.CREATE_BOOKING, {
    data,
    config: { toast: false, isGuest: false }
  })

export const getBookingAPI = params =>
  getRequest(API_URL.GET_BOOKING, {
    data: { ...updateParams(params) },
    config: { useBaseURL: true, isGuest: false }
  })

export const getBookingStatusAPI = params =>
  getRequest(API_URL.GET_BOOKING_STATUS, {
    data: { ...updateParams(params) },
    config: { useBaseURL: true, isGuest: true }
  })

export const cancelBookingAPI = data =>
  postRequest(API_URL.CANCEL_BOOKING, {
    data,
    config: { toast: true, isGuest: false }
  })

export const updateBookingStatusAPI = data =>
  postRequest(API_URL.UPDATE_BOOKING, {
    data,
    config: { toast: true, isGuest: false }
  })
