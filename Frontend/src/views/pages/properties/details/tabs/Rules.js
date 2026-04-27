import { Box, Grid, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const defaultRules = [
  { rule: 'Check-in', note: 'After 3:00 PM' },
  { rule: 'Check-out', note: 'Before 11:00 AM' },
  { rule: 'No Smoking', note: 'Smoking is not permitted anywhere on the property' },
  { rule: 'No Parties or Events', note: 'Loud music and gatherings are prohibited' },
  { rule: 'Pets', note: 'Not allowed unless prior agreement with the host' },
  { rule: 'Quiet Hours', note: '10:00 PM – 8:00 AM' }
]

const Rules = ({ data }) => {
  const safeRules = (() => {
    try {
      const parsed = data?.PROPERTY_RULES
        ? typeof data.PROPERTY_RULES === 'string'
          ? JSON.parse(data.PROPERTY_RULES)
          : data.PROPERTY_RULES
        : []

      return Array.isArray(parsed) && parsed.length
        ? parsed.map(r => ({ rule: r?.RULE || r?.rule, note: r?.NOTE || r?.note })).filter(r => r.rule)
        : defaultRules
    } catch {
      return defaultRules
    }
  })()

  return (
    <Box>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
        House Rules
      </Typography>
      <Grid container spacing={3}>
        {safeRules.map((item, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Icon icon='tabler:circle-check' style={{ color: '#27ae60' }} />
                <Typography variant='subtitle2' fontWeight={600}>
                  {item.rule}
                </Typography>
              </Box>
              <Typography variant='caption' sx={{ color: '#666', ml: 4 }}>
                {item.note}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Rules
