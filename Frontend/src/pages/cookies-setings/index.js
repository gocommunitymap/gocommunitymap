import PropTypes from 'prop-types'
import { Card, CardContent, Container, Divider, Grid, Typography } from '@mui/material'

import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import themeConfig from 'src/configs/themeConfig'
import { Box } from '@mui/system'
import UnderDevelopment from 'src/views/components/under-development'

const CookieSettings = props => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h3'>Cookie Settings</Typography>
          <UnderDevelopment />
        </Grid>
      </Grid>
    </Container>
  )
}

CookieSettings.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
}

CookieSettings.guestGuard = true

export default CookieSettings

// import React, { useState, useEffect } from 'react'
// import Cookies from 'js-cookie'
// import {
//   Container,
//   Typography,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Switch,
//   FormControlLabel,
//   Box,
//   Paper
// } from '@mui/material'

// const CookieSettings = () => {
//   const [openDialog, setOpenDialog] = useState(false)
//   const [cookiesAccepted, setCookiesAccepted] = useState(false)

//   const [cookiePreferences, setCookiePreferences] = useState({
//     analytics: false,
//     marketing: false,
//     functional: false
//   })

//   // Check for existing cookie preferences on load
//   useEffect(() => {
//     const preferences = Cookies.get('cookiePreferences')
//     if (preferences) {
//       setCookiesAccepted(true)
//       setCookiePreferences(JSON.parse(preferences))
//     }
//   }, [])

//   // Save preferences to cookies
//   const handleSavePreferences = () => {
//     Cookies.set('cookiePreferences', JSON.stringify(cookiePreferences), { expires: 365 })
//     setCookiesAccepted(true)
//     setOpenDialog(false)
//   }

//   // Handle acceptance of all cookies
//   const handleAcceptAll = () => {
//     const allPreferences = {
//       analytics: true,
//       marketing: true,
//       functional: true
//     }
//     Cookies.set('cookiePreferences', JSON.stringify(allPreferences), { expires: 365 })
//     setCookiePreferences(allPreferences)
//     setCookiesAccepted(true)
//     setOpenDialog(false)
//   }

//   // Handle rejection of all cookies
//   const handleRejectAll = () => {
//     const noPreferences = {
//       analytics: false,
//       marketing: false,
//       functional: false
//     }
//     Cookies.set('cookiePreferences', JSON.stringify(noPreferences), { expires: 365 })
//     setCookiePreferences(noPreferences)
//     setCookiesAccepted(false)
//     setOpenDialog(false)
//   }

//   return (
//     <Container maxWidth='sm' sx={{ mt: 5 }}>
//       <Typography variant='h4' gutterBottom>
//         Cookie Management
//       </Typography>
//       <Typography variant='body1' sx={{ mb: 3 }}>
//         Manage your cookie preferences below. Your choices will be saved for future visits.
//       </Typography>

//       {cookiesAccepted && (
//         <Box sx={{ mb: 3 }}>
//           <Button variant='contained' color='primary' onClick={() => setOpenDialog(true)}>
//             Manage Cookies
//           </Button>
//         </Box>
//       )}

//       {cookiesAccepted && (
//         <Paper sx={{ p: 2, mb: 3 }}>
//           <Typography variant='h6'>Current Preferences</Typography>
//           <Typography variant='body2'>Analytics: {cookiePreferences.analytics ? 'Enabled' : 'Disabled'}</Typography>
//           <Typography variant='body2'>Marketing: {cookiePreferences.marketing ? 'Enabled' : 'Disabled'}</Typography>
//           <Typography variant='body2'>Functional: {cookiePreferences.functional ? 'Enabled' : 'Disabled'}</Typography>
//         </Paper>
//       )}

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Cookie Preferences</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Choose which cookies you want to allow on this website:</DialogContentText>
//           <Box>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={cookiePreferences.analytics}
//                   onChange={e => setCookiePreferences({ ...cookiePreferences, analytics: e.target.checked })}
//                 />
//               }
//               label='Analytics Cookies'
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={cookiePreferences.marketing}
//                   onChange={e => setCookiePreferences({ ...cookiePreferences, marketing: e.target.checked })}
//                 />
//               }
//               label='Marketing Cookies'
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={cookiePreferences.functional}
//                   onChange={e => setCookiePreferences({ ...cookiePreferences, functional: e.target.checked })}
//                 />
//               }
//               label='Functional Cookies'
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleRejectAll} color='secondary'>
//             Reject All
//           </Button>
//           <Button onClick={handleAcceptAll} color='primary'>
//             Accept All
//           </Button>
//           <Button onClick={handleSavePreferences} variant='contained' color='primary'>
//             Save Preferences
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   )
// }

// CookieSettings.guestGuard = true

// export default CookieSettings
