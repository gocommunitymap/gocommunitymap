import { Button, Grid, IconButton, Link, Typography } from '@mui/material'
import { SocialPlatforms, getShareUrl } from '@phntms/react-share'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import Modal from '../../modal/modal'

const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const URL = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <>
      <IconButton
        variant='contained'
        color='primary'
        sx={{ mx: 1, border: 'solid 1px #eee' }}
        onClick={() => setIsOpen(true)}
      >
        <IconifyIcon icon='tabler:share' fontSize='1rem' />
      </IconButton>
      <Modal
        title={
          <Typography variant='h6' display='flex' alignItems='center'>
            <IconifyIcon icon='tabler:share' />
            Share
          </Typography>
        }
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Grid container>
          <Grid item xs={3} textAlign='center'>
            <Link target='_blank' href={getShareUrl(SocialPlatforms.Facebook, { url: URL })}>
              <IconButton sx={{ boxShadow: '5' }}>
                <IconifyIcon icon='tabler:brand-facebook' />
              </IconButton>
            </Link>
          </Grid>
          <Grid item xs={3} textAlign='center'>
            <Link target='_blank' href={getShareUrl(SocialPlatforms.WhatsApp, { url: URL })}>
              <IconButton sx={{ boxShadow: '5' }}>
                <IconifyIcon icon='tabler:brand-whatsapp' />
              </IconButton>
            </Link>
          </Grid>
          <Grid item xs={3} textAlign='center'>
            <Link target='_blank' href={getShareUrl(SocialPlatforms.Twitter, { url: URL })}>
              <IconButton sx={{ boxShadow: '5' }}>
                <IconifyIcon icon='tabler:brand-x' />
              </IconButton>
            </Link>
          </Grid>
          <Grid item xs={3} textAlign='center'>
            <Link target='_blank' href={getShareUrl(SocialPlatforms.Linkedin, { url: URL })}>
              <IconButton sx={{ boxShadow: '5' }}>
                <IconifyIcon icon='tabler:brand-linkedin' />
              </IconButton>
            </Link>
          </Grid>
        </Grid>
      </Modal>
    </>
  )
}

export default ShareButton
