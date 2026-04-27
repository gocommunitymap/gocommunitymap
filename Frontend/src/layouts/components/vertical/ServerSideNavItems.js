// ** React Imports
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { decUserData } from 'src/@core/utils'

// ** Axios Import
import { getNavigationAPI } from 'src/configs'
import { useAuth } from 'src/hooks/useAuth'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState([])
  const { user } = useAuth()
  useEffect(() => {
    if (user?.usercode) {
      getNavigationAPI({ usercode: user.usercode, refresh_token: user.refreshToken })
        .then(response => {
          let menu = []
          let menuArray = response?.data
          menuArray = menuArray.map(item => ({
            form_id: item.FORM_ID,
            title: item.TITLE,
            icon: item.ICON,
            parent_id: item.PARENT_ID,
            path: item.PATH,
            key: item.FORM_ID
          }))
          const navLevel1 = menuArray.filter(i => i.parent_id === null)
          for (let a = 0; a < navLevel1.length; a++) {
            let n1 = navLevel1[a]
            const navLevel2 = menuArray.filter(i => i.parent_id === n1.form_id)
            if (navLevel2.length) {
              n1 = { ...n1, children: navLevel2 }
            }
            menu.push(n1) // = { ...menu, ...n1 }
            menu = menu.length ? menu : [menu]

            //----------------------------------------------------------------//
            for (let b = 0; b < navLevel2.length; b++) {
              let n2 = navLevel2[b]
              let nl1 = menu.filter(i => i.form_id === n2.parent_id)
              const navLevel3 = menuArray.filter(i => i.parent_id === n2.form_id)
              if (navLevel3.length) {
                n2 = { ...n2, children: navLevel3 }
              }
              nl1[a] = n2
              menu[a].children[b] = nl1[a]
            }
          }
          setMenuItems(menu)
        })
        .catch(err => {
          toast.error(err.message)
        })
    }
  }, [user])

  return { menuItems }
}

export default ServerSideNavItems
