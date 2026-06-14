// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import { store } from 'src/store'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner-with-logo'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache, dateConvert, isTokenExpired } from 'src/@core/utils'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import { Provider } from 'react-redux'
import Error401 from './401'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }) => {
  const { user } = useAuth()
  useEffect(() => {
    const INACTIVE_LIMIT = 1 * 30 * 1000 // 30 minutes

    const updateActivity = () => {
      const exp = user ? jwtDecode(user?.token)?.exp : null
      if (exp) {
        const expTime = new Date(exp * 1000)
        localStorage.setItem('lastActivityTime', expTime.toString())
      }
    }

    const checkUserReturn = () => {
      const lastActivity = localStorage.getItem('lastActivityTime')

      if (!lastActivity) {
        updateActivity()

        return
      }

      const inactiveTime = Date.now() - Number(lastActivity)

      console.log(`Last Activity ${lastActivity} minutes`, inactiveTime, inactiveTime > INACTIVE_LIMIT)
      if (inactiveTime > INACTIVE_LIMIT) {
        console.log(`User returned after ${Math.floor(inactiveTime / 1000 / 30)} minutes`)
        alert(`You have been inactive for ${Math.floor(inactiveTime / 1000 / 30)} minutes, please login again`)

        // Your logic here
        // Example:
        // window.location.reload();
        // logoutUser();
        // fetchLatestData();
        // showSessionExpiredPopup();
      }

      updateActivity()
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    events.forEach(event => {
      window.addEventListener(event, updateActivity)
    })

    window.addEventListener('focus', checkUserReturn)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkUserReturn()
      }
    })

    // Initial load
    checkUserReturn()

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })

      window.removeEventListener('focus', checkUserReturn)
    }
  }, [user])

  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ??
    (page => (
      <UserLayout guestGuard={Component.guestGuard} contentHeightFixed={contentHeightFixed}>
        {page}
      </UserLayout>
    ))
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} `}</title>
          <meta name='description' content={`${themeConfig.templateName}`} />
          <meta name='keywords' content={themeConfig.templateName} />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </Guard>
                    </WindowWrapper>
                    <ReactHotToast>
                      <Toaster
                        position={settings.toastPosition}
                        toastOptions={{ className: 'react-hot-toast', style: { zIndex: 2000 } }}
                      />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
