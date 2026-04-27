// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

// ** Next Import
import { useRouter } from 'next/router'
import { API_URL } from 'src/configs'

// **
import { axios } from 'src/configs'

import { decUserData, encUserData } from 'src/@core/utils'
import { toast } from 'react-hot-toast'
import { deleteAllCookies } from 'src/configs/services/constant-functions'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const requestTimeout = 5000

  // ** Hooks
  const router = useRouter()

  const killSession = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    deleteAllCookies()
    router.push('/home')
  }

  const isTokenExpired = token => {
    try {
      const { exp } = jwtDecode(token)

      return Date.now() >= exp * 1000
    } catch {
      return true
    }
  }

  const initAuth = async () => {
    const data = decUserData(window.localStorage.getItem('userData'))
    const userData = data && JSON?.parse(data)
    if (userData?.usercode) {
      if (isTokenExpired(userData.token) && isTokenExpired(userData.refreshToken)) {
        setLoading(false)
        toast.error('Session has expired. Please log in again.', {
          position: 'top-center',
          icon: '⚠️',
          style: { padding: 10, fontSize: 12, minWidth: 200 },
          duration: 5000
        })
        killSession()

        return
      }

      setLoading(true)

      await axios
        .post(
          API_URL.TOKEN_VERIFY,
          { email: userData.email, token: userData.token, refreshToken: userData.refreshToken },
          { timeout: requestTimeout }
        )
        .then(async response => {
          setLoading(false)

          const _userData = { ...userData, token: response.data.token, refreshToken: response.data.refresh_token }
          setUser(_userData)

          const _encdata = encUserData(_userData)

          window.localStorage.setItem('userData', _encdata)
          if (!response.data.token) {
            handleLogout()
            toast.error('Session has been expired, Please Re-login', {
              position: 'top-center',
              icon: '⚠️',
              style: { padding: 10, fontSize: 12, minWidth: 200 },
              duration: 5000
            })

            return
          }
        })
        .catch(error => {
          toast.error('Session has been expired, Please Relogin', {
            position: 'top-center',
            style: { padding: 10, fontSize: 24, minWidth: 200 },
            duration: 5000
          })
          setLoading(false)
          handleLogout()
        })
    } else {
      setLoading(false)
    }
  }
  useEffect(() => {
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Silently refresh token every 15 minutes while user is logged in
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      initAuth()
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleLogin = async (params, errorCallback) => {
    axios
      .post(API_URL.LOGIN, { email: params.username, password: params.password })
      .then(async response => {
        const data = {
          usercode: response.data.usercode,
          fullName: response.data.user_name,
          email: response.data.email,
          userType: response.data.user_type,
          roleName: response.data.role_name,
          token: response.data.token,
          refreshToken: response.data.refresh_token
        }

        const returnUrl = router.query.returnUrl
        setUser(data)
        const encData = encUserData(data)
        params.rememberMe ? window.localStorage.setItem('userData', encData) : null
        if (params.noRedirect) {
          toast.success('Login successful', {
            position: 'top-center',
            style: { padding: 10, fontWeight: 'bold', fontSize: 24, minWidth: 200 },
            duration: 3000,
            icon: '👏'
          })
        } else {
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL)
        }

        // initAuth()
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)

        if (err.code === 'ECONNABORTED') {
          toast.error('Connection Timeout, Server Not Responding ')
        }

        handleLogout()
      })
  }

  const handleLogout = () => {
    if (user) {
      axios
        .post(API_URL.LOGOUT, {
          email: user.email,
          token: user.token,
          refreshToken: user.refreshToken
        })
        .then(async response => {
          killSession()
        })
        .catch(error => {})
    } else {
      killSession()
    }
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
