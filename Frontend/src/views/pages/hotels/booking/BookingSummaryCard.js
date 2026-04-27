import { Box, Card, Chip, Divider, Rating, Stack, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

import { defaultPageFont } from 'src/@core/utils'

/**
 * Shared sidebar summary card shown on details + payment screens.
 * Props: propertyName, place, rating, image, checkIn, checkOut, nights,
 *        pricePerNight, subtotal, serviceFee, total, paymentMethod
 */
const BookingSummaryCard = ({
  propertyName,
  place,
  rating = 9.2,
  image,
  checkIn,
  checkOut,
  nights,
  pricePerNight,
  subtotal,
  serviceFee,
  total,
  paymentMethod,
  selectedRooms = [],
  showPriceSummary = true,
  showCancellation = true
}) => {
  const formatDate = dateStr => {
    if (!dateStr) return '–'
    try {
      // Parse yyyy-MM-dd as local time (not UTC) to avoid off-by-one day in negative-offset timezones
      const [y, m, d] = String(dateStr).split('-').map(Number)
      if (y && m && d) {
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }

      return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #eee' }}>
      {/* Property Header */}
      <Box sx={{ p: 2.5 }}>
        <Stack direction='row' spacing={2} alignItems='flex-start'>
          {image && (
            <Box
              component='img'
              src={image}
              alt={propertyName}
              sx={{ width: 72, height: 72, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Stack direction='row' spacing={0.5} alignItems='center' sx={{ mb: 0.5 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Icon key={i} icon='tabler:star-filled' style={{ color: '#f59e0b', fontSize: 12 }} />
              ))}
            </Stack>
            <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont} sx={{ lineHeight: 1.3 }}>
              {propertyName || 'Hotel Property'}
            </Typography>
            <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
              {place || ''}
            </Typography>
            {rating && (
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={
                    <Stack direction='row' spacing={0.5} alignItems='center'>
                      <Typography variant='caption' fontWeight={800} color='#fff'>
                        {rating}
                      </Typography>
                      <Typography variant='caption' color='rgba(255,255,255,0.85)'>
                        Superb
                      </Typography>
                    </Stack>
                  }
                  size='small'
                  sx={{ backgroundColor: '#27ae60', height: 20, px: 0.5 }}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Booking Dates */}
      <Box sx={{ p: 2.5 }}>
        <Stack direction='row' justifyContent='space-between' sx={{ mb: 1.5 }}>
          <Box>
            <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
              Check-in
            </Typography>
            <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
              {formatDate(checkIn)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
              Check-out
            </Typography>
            <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
              {formatDate(checkOut)}
            </Typography>
          </Box>
        </Stack>
        <Typography variant='caption' color='text.secondary'>
          {nights ? `${nights} night${nights !== 1 ? 's' : ''}` : 'Select dates'}
        </Typography>
      </Box>

      {showPriceSummary && total > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2.5 }}>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1.5 }}>
              Your price summary
            </Typography>

            {/* Room lines */}
            {selectedRooms.length > 0
              ? selectedRooms.map((s, i) => (
                  <Stack key={i} direction='row' justifyContent='space-between' sx={{ mb: 0.75 }}>
                    <Typography variant='caption' fontFamily={defaultPageFont}>
                      {s.name} &times; {s.qty}
                    </Typography>
                    <Typography variant='caption' fontFamily={defaultPageFont}>
                      ${' '}
                      {((s.price || 0) * (s.qty || 1) * (nights || 1)).toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}
                    </Typography>
                  </Stack>
                ))
              : pricePerNight > 0 &&
                nights > 0 && (
                  <Stack direction='row' justifyContent='space-between' sx={{ mb: 0.75 }}>
                    <Typography variant='caption' fontFamily={defaultPageFont}>
                      $ {pricePerNight} &times; {nights} night{nights !== 1 ? 's' : ''}
                    </Typography>
                    <Typography variant='caption' fontFamily={defaultPageFont}>
                      $ {(pricePerNight * nights).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Stack>
                )}

            {/* Fees */}
            {serviceFee > 0 && (
              <Stack direction='row' justifyContent='space-between' sx={{ mb: 0.75 }}>
                <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                  Taxes &amp; fees
                </Typography>
                <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                  $ {serviceFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
              </Stack>
            )}

            <Divider sx={{ my: 1 }} />
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                Total
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant='h6' fontWeight={800} fontFamily={defaultPageFont}>
                  $ {total?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Typography>
              </Box>
            </Stack>
            {paymentMethod && (
              <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
                Paid via {paymentMethod}
              </Typography>
            )}
          </Box>
        </>
      )}

      {showCancellation && (
        <>
          <Divider />
          <Box sx={{ p: 2.5 }}>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
              Cancellation Policy
            </Typography>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant='body2' sx={{ color: '#27ae60', fontWeight: 600 }}>
                  Free cancellation
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Until 2 days before arrival
                </Typography>
              </Box>
              <Typography variant='body2' fontWeight={700}>
                $ 0
              </Typography>
            </Stack>
          </Box>
        </>
      )}
    </Card>
  )
}

export default BookingSummaryCard
