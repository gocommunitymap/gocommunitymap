import { Avatar, Card, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { HOST_STATS } from 'src/@core/utils/constant'

const PropertyHost = ({ property }) => {
  const hostName = property?.AGENT_NAME || property?.HOSTED_BY || 'Host'
  const hostInitial = hostName.charAt(0).toUpperCase()

  const hostBio =
    property?.AGENT_BIO || `${hostName} has been voted for in hospitality for reliability and guest experience.`

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        About the host
      </Typography>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs={12} sm='auto'>
          <Avatar sx={{ width: 80, height: 80, backgroundColor: '#27ae60', fontSize: '2rem' }}>{hostInitial}</Avatar>
        </Grid>
        <Grid item xs={12} sm>
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            Hosted by {hostName}
          </Typography>
          <Typography variant='caption' sx={{ color: '#666' }}>
            {hostBio}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      {/* <Grid container spacing={2}>
        {hostStats.map((stat, idx) => (
          <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }} key={idx}>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#27ae60' }}>
              {stat.value}
            </Typography>
            <Typography variant='caption'>{stat.label}</Typography>
          </Grid>
        ))}
      </Grid> */}
    </Card>
  )
}

export default PropertyHost
