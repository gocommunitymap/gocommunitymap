import { Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Icon } from '@iconify/react'
import Map from 'src/views/components/map'
import { HOTEL_DEFAULT_NEARBY } from 'src/@core/utils/constant'

const PropertyMapCard = ({ property, nearby }) => {
  const nearbyList = nearby && nearby.length ? nearby : HOTEL_DEFAULT_NEARBY

  return (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Map zoom={120} height='200px' data={{ LATITUDE: property?.LATITUDE, LONGITUDE: property?.LONGITUDE }} />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {nearbyList.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#27ae60',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    <Icon icon={item.ICON || 'tabler:map-pin'} />
                  </Box>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {item.NAME}
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#999' }}>
                      {item.DISTANCE}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}

export default PropertyMapCard
