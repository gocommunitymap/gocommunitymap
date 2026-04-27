import { Box, Button, Grid, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const SHOW_LIMIT = 12

const safeParseArray = value => {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const Facilities = ({ data }) => {
  const [showAll, setShowAll] = useState(false)

  const features = safeParseArray(data?.PROPERTY_FEATURES).map(i => ({ title: i?.FEATURES, icon: i?.ICON }))
  const utilities = safeParseArray(data?.PROPERTY_UTILITIES).map(i => ({ title: i?.UTILITIES, icon: i?.ICON }))

  const uap = safeParseArray(data?.PROPERTY_UAP)
    .filter(i => {
      const v = `${i?.SELECT_VALUE || ''}`.trim().toLowerCase()

      return v && v !== '0' && v !== 'n' && v !== 'false'
    })
    .map(i => ({ title: i?.DESCRIPTION, icon: i?.ICON }))
  const custom = safeParseArray(data?.CUSTOM_FEATURES).map(i => ({ title: i?.DESCRIPTION, icon: i?.ICON }))

  const allFacilities = [...features, ...utilities, ...uap, ...custom].filter(f => f.title)
  const displayed = showAll ? allFacilities : allFacilities.slice(0, SHOW_LIMIT)

  if (!allFacilities.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          No facilities listed for this property.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
        All Facilities
      </Typography>
      <Grid container spacing={2}>
        {displayed.map((f, idx) => (
          <Grid item xs={6} sm={4} key={idx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon
                icon={f.icon ? `tabler:${f.icon}` : 'tabler:circle-check'}
                style={{ color: '#27ae60', fontSize: 18 }}
              />
              <Typography variant='body2'>{f.title}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      {allFacilities.length > SHOW_LIMIT && (
        <Button variant='text' sx={{ mt: 3, color: '#27ae60' }} onClick={() => setShowAll(p => !p)}>
          {showAll ? 'Show less' : `Show all ${allFacilities.length} facilities`}
        </Button>
      )}
    </Box>
  )
}

export default Facilities
