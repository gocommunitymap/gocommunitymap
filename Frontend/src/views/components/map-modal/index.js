import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('src/views/components/map'), { ssr: false })

/**
 * MapModal — reusable map dialog
 *
 * Props:
 *   open      {boolean}  — controlled open state
 *   onClose   {function} — called when dialog requests close
 *   title     {string}   — property / place name shown in header
 *   subtitle  {string}   — optional secondary label (district, address, etc.)
 *   lat       {number}   — latitude
 *   lng       {number}   — longitude
 *   mapUrl    {string}   — optional Google Maps URL
 */
export const MapModal = ({ open, onClose, title, subtitle, lat, lng, mapUrl }) => {
  const hasCoords = lat && lng

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
          <Stack>
            <Typography variant='h6' fontWeight={700} noWrap>
              {title || 'Location'}
            </Typography>
            {subtitle && (
              <Typography variant='caption' color='text.secondary'>
                {subtitle}
              </Typography>
            )}
          </Stack>
          <IconButton onClick={onClose} size='small' sx={{ mt: -0.5 }}>
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: 420 }}>
        {hasCoords ? (
          <Map data={{ LATITUDE: lat, LONGITUDE: lng, MAP_URL: mapUrl || '' }} height='420px' width='100%' zoom={14} />
        ) : (
          <Stack height='100%' alignItems='center' justifyContent='center' spacing={1} color='text.disabled'>
            <Icon icon='tabler:map-off' fontSize={48} />
            <Typography variant='body2'>Location not available</Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default MapModal
