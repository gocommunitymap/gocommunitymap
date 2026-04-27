// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewNavGroup = props => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  const checkForVisibleChild = arr => {
    return arr.some(i => {
      if (i.children) {
        return checkForVisibleChild(i.children)
      } else {
        return i.auth //ability?.can(i.action, i.subject)
      }
    })
  }

  const canViewMenuGroup = item => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)

    // if (!(item.action && item.subject)) {
    //   return hasAnyVisibleChild
    // }

    // return ability && ability.can(item.action, item.subject) && hasAnyVisibleChild
    return hasAnyVisibleChild
  }

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup ? <>{children}</> : null
  }
}

export default CanViewNavGroup
