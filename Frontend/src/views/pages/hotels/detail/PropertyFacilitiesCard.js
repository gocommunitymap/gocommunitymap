import { Button, Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const SHOW_LIMIT = 6

const PropertyFacilitiesCard = ({ facilities = [] }) => {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? facilities : facilities.slice(0, SHOW_LIMIT)

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        Facilities
      </Typography>
      {facilities.length ? (
        <>
          <Grid container spacing={2}>
            {displayed.map((facility, idx) => (
              <Grid item xs={6} sm={4} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon
                    icon={facility.icon ? `tabler:${facility.icon}` : 'tabler:circle-check'}
                    style={{ color: '#27ae60' }}
                  />
                  <Typography variant='body2'>{facility.title}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          {facilities.length > SHOW_LIMIT && (
            <Button variant='text' sx={{ mt: 3, color: '#27ae60' }} onClick={() => setShowAll(prev => !prev)}>
              {showAll ? 'Show less' : `Show all ${facilities.length} amenities`}
            </Button>
          )}
        </>
      ) : (
        <Typography variant='body2' color='text.secondary'>
          No facilities available.
        </Typography>
      )}
    </Card>
  )
}

export default PropertyFacilitiesCard
