import { deleteRequest, getRequest, postRequest } from '../http'
import { API_URL } from '../api-url'
import { updateParams } from '../constant-functions.js'

export const getNavigationAPI = params =>
  postRequest(API_URL.MENU_LIST, { data: updateParams(params), config: { toast: false } })

//>>>>>>>>>>>USER<<<<<<<<<<<//
export const getUserAPI = params => getRequest(API_URL.GET_USER, { data: updateParams(params) })

export const getAgentUserAPI = params => getRequest(API_URL.GET_AGENT_USER, { data: updateParams(params) })

export const createUserAPI = params => postRequest(API_URL.CREATE_USER, { data: updateParams(params) })

export const registerUserAPI = ({ data, config }) =>
  postRequest(API_URL.REGISTER_USER, {
    data,
    config
  })

export const updateUserAPI = params => postRequest(API_URL.UPDATE_USER, { data: updateParams(params) })

export const agentApprovalAPI = params =>
  postRequest(API_URL.UPDATE_USER, {
    data: updateParams(params),
    customMessage: 'Agent Approved Successfully!'
  })

export const changePasswordAPI = params =>
  postRequest(API_URL.CHANGE_PASSWORD, { data: updateParams(params.data), customMessage: params.customMessage })

export const deleteUserAPI = params => postRequest(API_URL.DELETE_USER, { data: updateParams(params) })

//>>>>>>>>>>>ROLE<<<<<<<<<<<//
export const getRoleAPI = params => getRequest(API_URL.GET_ROLE, { data: updateParams(params) })

export const getRoleMasterAPI = params => getRequest(API_URL.GET_ROLE_MASTER, { data: updateParams(params) })

export const createRoleAPI = params => postRequest(API_URL.CREATE_ROLE, { data: updateParams(params) })

export const updateRoleAPI = params => postRequest(API_URL.UPDATE_ROLE, { data: updateParams(params) })

export const deleteRoleAPI = params => deleteRequest(API_URL.DELETE_ROLE, { data: updateParams(params) })

//>>>>>>>>>>>OTHER<<<<<<<<<<<//
export const getPermissionAPI = params => postRequest(API_URL.PERMISSIONS, { data: updateParams(params) })

export const getFormsAPI = params =>
  postRequest(API_URL.FORMS, { data: updateParams({ ...params, action: 'R' }), config: { toast: false } })
