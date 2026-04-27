import { Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Icon } from '@iconify/react'

const PropertyHighlights = ({ facilities = [] }) => {
  const highlighted = facilities.filter(f => f.highlighted)
  if (!highlighted.length) return null

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        Highlights
      </Typography>
      <Grid container spacing={3}>
        {highlighted.map((item, idx) => (
          <Grid item xs={6} sm={highlighted.length <= 4 ? 3 : highlighted.length <= 6 ? 4 : 3} key={idx}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>
                <Icon icon={`tabler:${item.icon || 'star'}`} style={{ fontSize: 40, color: '#27ae60' }} />
              </Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                {item.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default PropertyHighlights
