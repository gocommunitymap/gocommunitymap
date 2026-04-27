// ** React Import
import { useEffect, useRef } from 'react'

// ** Layout Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import { useAuth } from 'src/hooks/useAuth'
import HorizontalLayoutGuest from './HorizontalLayoutGuest'

const Layout = props => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props
  const { user } = useAuth()

  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)

  // const setLayout = async () => {
  //   if (user?.userType !== 2) {
  //     await saveSettings({ ...settings, layout: 'vertical' })
  //   } else if (user?.userType == 2) {
  //     await saveSettings({ ...settings, layout: 'horizontal' })
  //   }
  // }

  // useEffect(() => {
  //   setLayout()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, hidden])
  useEffect(() => {
    if (hidden) {
      if (settings.navCollapsed) {
        saveSettings({ ...settings, navCollapsed: false, layout: 'horizontal' })
        isCollapsed.current = true
      }
    } else {
      if (isCollapsed.current) {
        saveSettings({ ...settings, navCollapsed: true, layout: settings.lastLayout })
        isCollapsed.current = false
      } else {
        if (settings.lastLayout !== settings.layout) {
          saveSettings({ ...settings, layout: settings.lastLayout })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

  // if (user?.userType) {
  //   if (user?.userType == 2) {
  //     return <HorizontalLayout {...props}>{children}</HorizontalLayout>
  //   }

  //   return <VerticalLayout {...props}>{children}</VerticalLayout>
  // } else {
  //   return <HorizontalLayoutGuest {...props}>{children}</HorizontalLayoutGuest>
  // }
  return <HorizontalLayout {...props}>{children}</HorizontalLayout>
}

export default Layout
