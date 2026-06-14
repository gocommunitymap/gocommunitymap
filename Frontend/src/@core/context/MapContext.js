import { Box, CircularProgress, Typography } from '@mui/material'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import { createContext, useContext, useEffect } from 'react'
import IconifyIcon from '../components/icon'

const GoogleMapContext = createContext({
  isLoaded: false,
  loadError: undefined
})

export function GoogleMapProvider({ mapLoaded, setMapLoaded, mapProps, children }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['maps']
  })
  if (loadError) {
    return (
      <Box
        sx={{
          height: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 4,
          flexDirection: 'column',
          gap: 2,
          p: 4,
          textAlign: 'center'
        }}
      >
        <IconifyIcon icon='tabler:alert-circle' fontSize='3rem' color='#ef4444' />
        <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem' }}>
          Error Loading Google Maps
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 500 }}>
          {loadError.message || 'Failed to load Google Maps'}
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 2, maxWidth: 600 }}>
          <Typography sx={{ color: '#856404', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
            Common Solutions:
          </Typography>
          <Typography component='div' sx={{ color: '#856404', fontSize: '0.75rem', textAlign: 'left' }}>
            1. Check if NEXT_PUBLIC_GOOGLE_MAP_KEY is set in .env file
            <br />
            2. Enable "Maps JavaScript API" in Google Cloud Console
            <br />
            3. Enable billing for your Google Cloud Project
            <br />
            4. Check API key restrictions (HTTP referrers)
            <br />
            5. Restart your development server after changing .env
          </Typography>
        </Box>
      </Box>
    )
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 4
        }}
      >
        <CircularProgress sx={{ color: '#10B981' }} />
      </Box>
    )
  }
  if (isLoaded) {
    setMapLoaded(isLoaded)
  }

  return (
    <GoogleMapContext.Provider>
      <GoogleMap
        {...mapProps}
        value={{
          isLoaded,
          loadError
        }}
      >
        {children}
      </GoogleMap>
    </GoogleMapContext.Provider>
  )
}

export const useGoogleMap = () => useContext(GoogleMapContext)
