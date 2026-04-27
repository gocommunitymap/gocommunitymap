import { deleteRequest, fileUpload, getRequest, postRequest } from '../http'
import { API_URL } from '../api-url'
import { updateParams } from '../constant-functions.js'

export const getFileAPI = params => getRequest(API_URL.GET_FILE, { data: updateParams(params) })

export const updateFileAPI = params => {
  return fileUpload(API_URL.UPLOAD_FILE, { data: updateParams(params) })
}

export const deleteFileAPI = params =>
  deleteRequest(API_URL.DELETE_FILE, { data: updateParams(params), config: { toast: false } })
