import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'
import Spinner from 'src/@core/components/spinner'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'

import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import Error401 from 'src/pages/401'
import { isAllowed } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { topNavBar } from 'src/configs'

const UserLayout = ({ guestGuard, children, contentHeightFixed }) => {
  const location = useRouter()

  // ** Hooks
  const permission = usePermission()
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState([])
  useEffect(() => {
    setIsLoading(true)

    setPermissions(permission)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [permission])
  const { settings, saveSettings } = useSettings()

  // ** Vars for server side navigation
  const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  const error404 = () => {
    return <Error401 />
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: verticalMenuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {isLoading ? (
        <Spinner />
      ) : guestGuard ||
        isAllowed(permissions, 'R') ||
        location.pathname === '/' ||
        location.pathname === '/admin/bookings' ||
        location.pathname === '/admin/applicationsetup' ||
        location.pathname === '/furniture-marketplace' ||
        location.pathname.startsWith('/account') ||
        location.pathname === '/saved' ||
        location.pathname === '/savedsearch' ||
        location.pathname.startsWith('/hotels') ||
        location.pathname.startsWith('/rentals') ||
        location.pathname === '/payment' ||
        location.pathname === '/home' ? (
        children
      ) : (
        error404()
      )}
    </Layout>
  )
}

export default UserLayout
