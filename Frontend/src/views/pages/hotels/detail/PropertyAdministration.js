import { Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Icon } from '@iconify/react'

const PropertyAdministration = ({ letting_arrangements, lettings_deposit_payable, fee_apply }) => {
  const administrationItems = [
    {
      title: 'Letting Arrangements',
      description: letting_arrangements || ''
    },
    {
      title: 'Lettings Deposit Payable',
      description: lettings_deposit_payable || ''
    },
    {
      title: 'Fee Apply',
      description: fee_apply || ''
    }
  ]

  // Only show if at least one field has content
  const hasContent = administrationItems.some(item => item.description)

  if (!hasContent) {
    return null
  }

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        Administration
      </Typography>
      <Grid container spacing={3}>
        {administrationItems.map(
          (item, idx) =>
            item.description && (
              <Grid item xs={12} sm={6} key={idx}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Icon icon='tabler:circle-check' style={{ color: '#27ae60' }} />
                    <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant='caption' sx={{ color: '#666', ml: 4 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            )
        )}
      </Grid>
    </Card>
  )
}

export default PropertyAdministration
