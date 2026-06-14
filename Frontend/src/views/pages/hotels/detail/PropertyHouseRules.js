import { Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Icon } from '@iconify/react'
import { HOTEL_DEFAULT_RULES } from 'src/@core/utils/constant'

const PropertyHouseRules = ({ rules }) => {
  const list = rules && rules.length ? rules : HOTEL_DEFAULT_RULES

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        House Rules
      </Typography>
      <Grid container spacing={3}>
        {list.map((item, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Icon icon='tabler:circle-check' style={{ color: '#27ae60' }} />
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  {item.RULE || item.rule}
                </Typography>
              </Box>
              <Typography variant='caption' sx={{ color: '#666', ml: 4 }}>
                {item.NOTE || item.note}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default PropertyHouseRules
