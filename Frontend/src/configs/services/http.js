import zIndex from '@mui/material/styles/zIndex'
import base_axios from 'axios'
import { toast } from 'react-hot-toast'
import { decUserData } from 'src/@core/utils'

const toastProps = { duration: 5000 }

export const axios = base_axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASEURL}`
})

// Handle platform-wide HTTP status codes once, before individual request handlers.
axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    if (status === 429) {
      const retryAfter = Number(error.response.headers['retry-after']) || 60
      toast.error(`Too many requests — please wait ${retryAfter} seconds and try again.`, toastProps)
      error._intercepted = true
    } else if (status === 410) {
      toast.error('This listing has been removed.', toastProps)
      error._intercepted = true
    }
    return Promise.reject(error)
  }
)

export const getRequest = async (
  url,
  { data = {}, config = { useBaseURL: true, isGuest: false, errorMessage: null, errorToast: true } } = {}
) => {
  if (config.useBaseURL) {
    if (!config.isGuest) {
      let userData = []

      try {
        userData = JSON.parse(decUserData(window.localStorage.getItem('userData')))
      } catch (error) {}
      const token = `Bearer ${userData?.token}`
      axios.defaults.headers.common['Authorization'] = token
    }

    return axios({
      method: 'get',
      url,
      params: data,
      config,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
      .then(response => {
        if (response?.data) {
          return response
        } else {
          toast.error(response.error)

          return []
        }
      })
      .catch(error => {
        if (error._intercepted) return false
        if (config.errorToast) {
          if (config.errorMessage !== null) {
            toast.error(config.errorMessage)
          } else {
            alert('11')
            toast.error(error.message)
          }
        }
      })
  } else {
    return base_axios(url, {
      method: 'get',
      data
    })
      .then(response => {
        if (!response?.data[0]?.ERROR) {
          return response
        } else {
          toast.error(response?.data[0]?.ERROR)

          return []
        }
      })
      .catch(error => {
        toast.error(error.message)

        return false
      })
  }
}

export const postRequest = (
  url,
  {
    data = {},
    params = {},
    config = { toast: true, isGuest: false, returnErrorResponse: false },
    customMessage = null
  } = {}
) => {
  if (!config.isGuest) {
    const userData = JSON.parse(decUserData(window.localStorage.getItem('userData')))
    const token = `Bearer ${userData.token}`
    axios.defaults.headers.common['Authorization'] = token
  }

  return axios({
    method: 'post',
    url,
    data,
    params
  })
    .then(response => {
      if (!response?.data[0]?.ERROR) {
        if (config.toast) {
          if (customMessage !== null) {
            toast.success(customMessage, { duration: 5000 })
          } else {
            const m = response.data[0].MESSAGE
            const c = response.data[0].CODE
            toast.success(`${m} WITH CODE: ${c}`, toastProps)
          }
        }
      } else if (config.returnErrorResponse) {
        return { error: response.data[0].ERROR, code: response.data[0].CODE }
      } else {
        toast.error(response?.data[0]?.ERROR, toastProps, { style: { zIndex: '10000 !important' } })

        return false
      }

      return response
    })
    .catch(error => {
      if (error._intercepted) return false
      alert('12')
      toast.error(error.message, toastProps)

      return false
    })
}

export const deleteRequest = (url, { data = {}, config = { toast: true } } = {}) => {
  const userData = JSON.parse(decUserData(window.localStorage.getItem('userData')))
  const token = `Bearer ${userData.token}`
  axios.defaults.headers.common['Authorization'] = token

  return axios({
    method: 'delete',
    url,
    params: data,
    config
  })
    .then(response => {
      if (!response?.data[0]?.ERROR) {
        const m = response.data[0].MESSAGE
        const c = response.data[0].CODE
        if (config.toast) {
          toast.success(`${m} WITH CODE: ${c}`, toastProps)
        }
      } else {
        if (config.toast) {
          toast.error(response?.data[0]?.ERROR, toastProps)
        }

        return false
      }

      return response
    })
    .catch(error => {
      if (error._intercepted) return false
      if (config.toast) {
        toast.error(error.message, toastProps)
      }

      return false
    })
}

export const fileUpload = (url, { data = {}, file = null } = {}) => {
  const userData = JSON.parse(decUserData(window.localStorage.getItem('userData')))
  const token = `Bearer ${userData.token}`
  axios.defaults.headers.common['Authorization'] = token

  const formData = new FormData()
  formData.append('fileDetails', data.file)
  axios
    .post(url, formData, {
      params: { dir: data.dir, fileName: data.fileName, isSecure: data.isSecure },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      return response
    })
    .catch(error => {
      toast.error(error.message, toastProps)

      return false
    })
}
