import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useJsApiLoader } from '@react-google-maps/api'
import { useEffect } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const MapLoader = (mapLoaded, setMapLoaded, MAP_HEIGHT) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'community-map-script',
    googleMapsApiKey: apiKey
  })

  useEffect(() => {
    if (isLoaded) {
      setMapLoaded(true)
    } else {
      setMapLoaded(false)
    }
  }, [isLoaded])

  // Check if API key is missing
  if (!apiKey) {
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
        <IconifyIcon icon='tabler:key-off' fontSize='3rem' color='#f59e0b' />
        <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.2rem' }}>
          Google Maps API Key Missing
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 500 }}>
          The environment variable NEXT_PUBLIC_GOOGLE_MAP_KEY is not set
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fef3c7', borderRadius: 2, maxWidth: 600 }}>
          <Typography sx={{ color: '#92400e', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>To fix this:</Typography>
          <Typography component='div' sx={{ color: '#92400e', fontSize: '0.75rem', textAlign: 'left' }}>
            1. Add NEXT_PUBLIC_GOOGLE_MAP_KEY to your .env file
            <br />
            2. Get an API key from Google Cloud Console
            <br />
            3. Enable "Maps JavaScript API"
            <br />
            4. Restart your development server
          </Typography>
        </Box>
      </Box>
    )
  }

  // if (loadError) {
  //   return (
  //     <Box
  //       sx={{
  //         height: '700px',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         bgcolor: '#f8f9fa',
  //         borderRadius: 4,
  //         flexDirection: 'column',
  //         gap: 2,
  //         p: 4,
  //         textAlign: 'center'
  //       }}
  //     >
  //       <IconifyIcon icon='tabler:alert-circle' fontSize='3rem' color='#ef4444' />
  //       <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem' }}>
  //         Error Loading Google Maps
  //       </Typography>
  //       <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 500 }}>
  //         {loadError.message || 'Failed to load Google Maps'}
  //       </Typography>
  //       <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 2, maxWidth: 600 }}>
  //         <Typography sx={{ color: '#856404', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
  //           Common Solutions:
  //         </Typography>
  //         <Typography component='div' sx={{ color: '#856404', fontSize: '0.75rem', textAlign: 'left' }}>
  //           1. Check if NEXT_PUBLIC_GOOGLE_MAP_KEY is set in .env file
  //           <br />
  //           2. Enable "Maps JavaScript API" in Google Cloud Console
  //           <br />
  //           3. Enable billing for your Google Cloud Project
  //           <br />
  //           4. Check API key restrictions (HTTP referrers)
  //           <br />
  //           5. Restart your development server after changing .env
  //         </Typography>
  //       </Box>
  //     </Box>
  //   )
  // }
  if (!isLoaded) {
    return (
      <Box sx={{ height: MAP_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }
}

export default MapLoader
