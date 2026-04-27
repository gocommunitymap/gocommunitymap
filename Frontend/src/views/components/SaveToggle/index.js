import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import { postSavedLinksAPI } from 'src/configs'
import { useAuth } from 'src/hooks/useAuth'

const { Button, Card, IconButton } = require('@mui/material')

const SaveToggle = ({ propertyId, title, isSaved }) => {
  const { asPath, replace } = useRouter()
  const { user } = useAuth()
  const [saved, setSaved] = useState(Boolean(isSaved))

  const handleSaveToggle = async event => {
    event.stopPropagation()
    if (!propertyId) return

    if (!user?.usercode) {
      replace(`/login/?returnUrl=${asPath}`)

      return
    }

    try {
      const response = await postSavedLinksAPI({
        PROPERTY_ID: propertyId,
        ACTIVE: !saved,
        LINK: asPath,
        TYPE: 'P',
        DESCRIPTION: title
      })

      if (response?.data?.[0]?.MESSAGE?.includes('SUCCESSFULLY')) {
        setSaved(!saved)
        toast.success(!saved ? 'Saved!' : 'Un Saved!', { position: 'top-center' })
      }
    } catch {
      toast.error('Failed to Saved!')
    }
  }

  return (
    <IconButton onClick={handleSaveToggle} color='primary' sx={{ mx: 1, border: 'solid 1px #eee' }}>
      <IconifyIcon icon={saved ? 'tabler:heart-filled' : 'tabler:heart'} fontSize='1rem' />
    </IconButton>
  )
}

export default SaveToggle
