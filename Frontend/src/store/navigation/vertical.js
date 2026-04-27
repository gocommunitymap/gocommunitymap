//api/vertical-nav/data

import { createAsyncThunk } from '@reduxjs/toolkit'
import { decUserData } from 'src/@core/utils'

// ** Axios Imports
import { API_URL, axios } from 'src/configs'

// ** Fetch Users
export const fetchVerticalNav = createAsyncThunk('appUsers/fetchData', async params => {
  const userDetail = decUserData(window.localStorage.getItem('userData'))
  const { usercode, refreshToken } = JSON.parse(userDetail)

  const response = await axios.post(API_URL.MENU_LIST, { data: { usercode } })

  return response?.data
})

export default fetchVerticalNav
