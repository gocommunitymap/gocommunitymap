import { Box, Button, Container, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import CommunityMapViewComponent from '../../community-map/CommunityMapViewComponent'
import CommunityListViewComponent from '../../community-map/CommunityListViewComponent'

import { defaultPageFont } from 'src/@core/utils'

const LandingCommunityMap = () => {
  const [view, setView] = useState(1)
  const toggleView = () => setView(prev => (prev === 1 ? 2 : 1))

  return (
    <Box sx={{ py: 8, bgcolor: '#fafbfc' }}>
      <Container maxWidth='lg'>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant='h3'
            sx={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#0b1730',
              fontFamily: defaultPageFont,
              textAlign: 'center'
            }}
          >
            🗺️
          </Typography>
          <Typography
            variant='h3'
            sx={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#0b1730',
              fontFamily: defaultPageFont
            }}
          >
            Go Community <span style={{ color: '#10B981' }}>Map</span>
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => {
                if (newView !== null) setView(newView)
              }}
              sx={{ bgcolor: '#f3f4f6', borderRadius: 2, boxShadow: 1, mb: 5 }}
            >
              <ToggleButton
                value={1}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  fontFamily: defaultPageFont,
                  border: 0,
                  bgcolor: view === 1 ? '#10B981' : 'transparent',
                  color: view === 1 ? '#fff' : '#0b1730'
                }}
              >
                <IconifyIcon icon='tabler:list' fontSize='1.2rem' sx={{ mr: 1 }} />
                List View
              </ToggleButton>
              <ToggleButton
                value={2}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  fontFamily: defaultPageFont,
                  border: 0,
                  bgcolor: view === 2 ? '#10B981' : 'transparent',
                  color: view === 2 ? '#fff' : '#0b1730'
                }}
              >
                <IconifyIcon icon='tabler:map' fontSize='1.2rem' sx={{ mr: 1 }} />
                Map View
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        {view == 1 ? <CommunityListViewComponent /> : <CommunityMapViewComponent />}
      </Container>
    </Box>
  )
}

export default LandingCommunityMap
