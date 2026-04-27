import base_axios from 'axios'
import { decUserData, encUserData } from 'src/@core/utils'
import { API_URL } from './api-url'
import toast from 'react-hot-toast'
import { options } from 'src/pages/home'

let location = {}
if (typeof window !== 'undefined') {
  location = window.location
}

const _env = process.env.NODE_ENV

const N_URL =
  _env === 'development'
    ? `${process.env.NEXT_PUBLIC_BASEURL_PUBLIC}:${process.env.NEXT_PUBLIC_API_PORT}/`
    : `${location.protocol}//${location.hostname}:${
        process.env.NEXT_PUBLIC_IS_DYNAMIC_PORT === 'no'
          ? process.env.NEXT_PUBLIC_API_PORT
          : parseInt(location.port) - 1
      }`

// const P_URL = process.env.NEXT_PUBLIC_BASEURL_PUBLIC
// const L_URL = process.env.NEXT_PUBLIC_BASEURL_LOCAL
// let BASE_URL = L_URL

// if (BASE_URL.split('//')[1].substring(0, 3) === location?.hostname?.substring(0, 3)) {
//   BASE_URL = P_URL
// }

export const axios = base_axios.create({
  baseURL: `${N_URL}`
})

const refreshAccessToken = async () => {
  try {
    // alert('Refresh Access Token')
    const userData = JSON.parse(decUserData(window.localStorage.getItem('userData')))

    return await axios({
      url: API_URL.TOKEN_VERIFY,
      method: 'post',
      headers: {
        Authorization: `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      },
      data: { email: userData.email, token: userData.token, refreshToken: userData.refreshToken },
      options: { timeout: 20000 }
    })
      .then(async response => {
        const _userData = { ...userData, token: response.data.token, refreshToken: response.data.refresh_token }

        const _encdata = encUserData(_userData)

        window.localStorage.setItem('userData', _encdata)

        return response?.data?.token
      })
      .catch(error => {
        const userData = window.localStorage.getItem('userData')
        if (userData) {
          toast.error('Session has been expired, Please Re-login', {
            position: 'top-center',
            style: { padding: 10, fontSize: 24, minWidth: 200 },
            duration: 5000
          })
        }

        window.localStorage.removeItem('userData')
        window.location.replace('/login')
      })
  } catch (error) {
    console.error('Failed to refresh token', error)
  }
}

axios.interceptors.request.use(
  config => config,
  error => {

    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (
      (error.response?.status === 401 || error.code === 'ERR_NETWORK') &&
      originalRequest?.url != '/auth/GenerateToken' &&
      originalRequest?.url != '/auth/AuthenticateValidToken' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {

        const newAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return axios(originalRequest)
      } catch (refreshError) {
        // Handle refresh token error (e.g., redirect to login)
        console.error('Refresh token error', refreshError)
      }
    }

    // window.localStorage.removeItem('userData')
    // window.location.replace('/login')

    return Promise.reject(error)
  }
)
