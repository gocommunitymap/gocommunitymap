import { Stack, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

import { defaultPageFont } from 'src/@core/utils'

export const StarRating = ({ value, showValue = true }) => {
  const stars = [1, 2, 3, 4, 5].map(n => {
    if (value >= n) return 'tabler:star-filled'
    if (value >= n - 0.5) return 'tabler:star-half-filled'

    return 'tabler:star'
  })

  return (
    <Stack direction='row' spacing={0.3} alignItems='center'>
      {stars.map((icon, i) => (
        <IconifyIcon key={i} icon={icon} fontSize='0.85rem' color='#f3b11d' />
      ))}
      {showValue && (
        <Typography
          sx={{ color: '#0b1730', fontFamily: defaultPageFont, fontWeight: 700, fontSize: '0.85rem', ml: 0.5 }}
        >
          {value}
        </Typography>
      )}
    </Stack>
  )
}
