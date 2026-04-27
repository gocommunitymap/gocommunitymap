import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import fetchPermissions from 'src/store/permissions'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** React
const usePermission = () => {
  const [permissions, setPermissions] = useState([])
  const location = useRouter()
  const { user } = useAuth()
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      dispatch(fetchPermissions({ page: location.pathname })).then(resp => {
        const data = resp?.payload?.length && resp?.payload[0]?.PERMISSIONS
        if (data) {
          const arr = data?.split(',')
          setPermissions(arr)
        } else {
          setPermissions(null)
        }
      })
    }
  }, [dispatch, location.pathname])

  return permissions
}

export default usePermission
