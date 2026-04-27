import { getRequest, postRequest } from '../http'
import { API_URL } from '../api-url'

//>>>>>>>>>>>USER<<<<<<<<<<<//
export const forgotPasswordAPI = params =>
  postRequest(API_URL.FORGOT_PASSWORD, { params: params.data, config: { isGuest: true } })

export const resetPasswordAPI = params =>
  postRequest(API_URL.RESET_PASSWORD, { params: params.data, config: { isGuest: true } })

export const getResetRequestAPI = params =>
  getRequest(API_URL.GET_RESET_REQUEST, {
    data: params,
    config: { useBaseURL: true, isGuest: true, errorToast: false, errorMessage: 'Request Not Found' }
  })
