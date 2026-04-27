import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { decUserData } from 'src/@core/utils'

// ** Axios Imports
import { axios, postRequest } from 'src/configs'
import { API_URL } from 'src/configs'

// ** Fetch Users
export const fetchPermissions = createAsyncThunk(API_URL.PERMISSIONS, async params => {
  const UserDetail = decUserData(window.localStorage.getItem('userData'))
  const { usercode, refreshToken } = JSON.parse(UserDetail)

  const response = await postRequest(API_URL.PERMISSIONS, {
    data: {
      usercode,
      path: params.page,
      refresh_token: refreshToken
    },
    config: { toast: false }
  })

  return response?.data
})

export default fetchPermissions
