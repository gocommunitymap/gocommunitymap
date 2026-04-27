import { Button, CircularProgress, Tooltip, Typography } from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import useClipboard from 'src/@core/hooks/useClipboard'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { getAgentInfoAPI } from 'src/configs'
import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/system'

export const EmailButton = ({ PROPERTY_ID }) => {
  const clipboard = useClipboard()
  const [show, setShow] = useState(false)
  const [count, setCount] = useState(0)

  const [agentEmail, setAgentEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClipboard = value => {
    if (value?.length > 0) {
      clipboard.copy(value)
    }
    toast.success('copied!', {
      duration: 2000
    })
  }

  const getAgentInfo = async () => {
    setLoading(true)
    await getAgentInfoAPI({ PROPERTY_ID, TYPE: 'E' })
      .then(response => {
        if (!response || response?.data[0].RESULT === null) {
          setShow(false)

          return
        }
        setShow(true)
        setCount(10)

        setAgentEmail(response?.data[0].RESULT)
      })
      .catch(() => {
        setShow(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow(false)
      }, 10000)
    }
  }, [show])
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setCount(count - 1)
      }, 1000)
    }
  }, [count])

  return show ? (
    <Tooltip title='Click to Copy'>
      <Button loading={loading} onClick={() => handleClipboard(agentEmail)}>
        <IconifyIcon icon='tabler:mail' />
        {agentEmail}
        <Box sx={{ mx: 1, position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant='determinate' color='secondary' size={30} value={count * 10} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant='caption' component='div' color='text.secondary'>
              {count}
            </Typography>
          </Box>
        </Box>
      </Button>
    </Tooltip>
  ) : (
    <LoadingButton onClick={getAgentInfo}>
      <IconifyIcon icon='tabler:mail' />
      Email
    </LoadingButton>
  )
}
