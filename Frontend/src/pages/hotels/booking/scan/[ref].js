import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Card, Chip, Divider, Stack, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SeoHead from 'src/components/SeoHead'
import { getBookingAPI, getBookingStatusAPI } from 'src/configs/services/api-methods/guest'
import { defaultPageFont } from 'src/@core/utils'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ─── helpers ────────────────────────────────────────────────────────────────

const fmtDate = dateStr => {
  if (!dateStr) return '—'
  const [y, m, d] = String(dateStr).split('-').map(Number)
  if (!y || !m || !d) return dateStr

  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const statusConfig = s => {
  const v = (s || '').toUpperCase()
  if (v === 'CONFIRMED') return { bg: '#e8f8f0', color: '#1b7a45', icon: 'tabler:circle-check-filled' }
  if (v === 'PENDING') return { bg: '#fffbeb', color: '#b45309', icon: 'tabler:clock-filled' }
  if (v === 'CANCELLED') return { bg: '#fef2f2', color: '#b91c1c', icon: 'tabler:circle-x-filled' }

  return { bg: '#f5f5f5', color: '#555', icon: 'tabler:info-circle' }
}

// ─── scan summary page ───────────────────────────────────────────────────────

const BookingScanSummary = () => {
  const router = useRouter()
  const { ref } = router.query

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ref) return
    setLoading(true)
    getBookingStatusAPI({ BOOKING_NO: ref })
      .then(res => {
        const record = res?.data?.[0] || null
        if (record) {
          setBooking(record)
          setError('')
        } else {
          setError('Booking not found')
        }
      })
      .catch(() => setError('Could not load booking'))
      .finally(() => setLoading(false))
  }, [ref])

  const sc = statusConfig(booking?.STATUS)
  const guestName = booking ? `${booking.GUEST_FIRST_NAME || ''} ${booking.GUEST_LAST_NAME || ''}`.trim() : '—'

  return (
    <>
      <SeoHead title='Booking Summary' />

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #f0faf5 0%, #e8f4fd 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 6
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 460 }}>
          {/* Header badge */}
          <Stack direction='row' alignItems='center' justifyContent='center' spacing={1.5} sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(39,174,96,0.35)'
              }}
            >
              <Icon icon='tabler:qrcode' style={{ fontSize: 22, color: '#fff' }} />
            </Box>
            <Box>
              <Typography
                variant='h6'
                fontWeight={800}
                fontFamily={defaultPageFont}
                sx={{ lineHeight: 1.2, color: '#1a1a2e' }}
              >
                Booking Summary
              </Typography>
              <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                Scanned via GoCommunityMap
              </Typography>
            </Box>
          </Stack>

          {/* Loading skeleton */}
          {loading && (
            <Card sx={{ borderRadius: 4, p: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              {[70, 50, 90, 60, 80, 55].map((w, i) => (
                <Box
                  key={i}
                  sx={{
                    height: i === 0 ? 28 : 18,
                    width: `${w}%`,
                    borderRadius: 1,
                    backgroundColor: '#e8e8e8',
                    mb: i === 0 ? 3 : 1.5,
                    animation: 'pulse 1.4s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%,100%': { opacity: 1 },
                      '50%': { opacity: 0.45 }
                    }
                  }}
                />
              ))}
            </Card>
          )}

          {/* Error state */}
          {!loading && error && (
            <Card sx={{ borderRadius: 4, p: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <Icon icon='tabler:file-search' style={{ fontSize: 52, color: '#ccc' }} />
              <Typography variant='h6' fontWeight={700} fontFamily={defaultPageFont} sx={{ mt: 2, mb: 1 }}>
                Booking Not Found
              </Typography>
              <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont}>
                {error}
              </Typography>
            </Card>
          )}

          {/* Booking summary card */}
          {!loading && booking && (
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}
            >
              {/* Gradient top bar */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1b7a45 0%, #27ae60 60%, #2ecc71 100%)',
                  px: 3,
                  py: 2.5
                }}
              >
                <Typography
                  variant='caption'
                  sx={{ color: 'rgba(255,255,255,0.75)', fontFamily: defaultPageFont, letterSpacing: 1.5 }}
                >
                  BOOKING REFERENCE
                </Typography>
                <Typography variant='h5' fontWeight={800} color='#fff' fontFamily={defaultPageFont} sx={{ mt: 0.25 }}>
                  {booking.BOOKING_NO || ref}
                </Typography>
              </Box>

              <Box sx={{ px: 3, py: 3 }}>
                {/* Status */}
                <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      backgroundColor: sc.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon icon={sc.icon} style={{ fontSize: 20, color: sc.color }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                      Booking Status
                    </Typography>
                    <Box>
                      <Chip
                        label={(booking.STATUS || 'CONFIRMED').toUpperCase()}
                        size='small'
                        sx={{
                          backgroundColor: sc.bg,
                          color: sc.color,
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          letterSpacing: 0.8,
                          height: 22,
                          mt: 0.25
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                {/* Billed To */}
                <SummaryRow icon='tabler:user-circle' label='Billed To' value={guestName || '—'} />

                <Divider sx={{ my: 2 }} />

                {/* Hotel */}
                <SummaryRow icon='tabler:building' label='Hotel' value={booking.PROPERTY_NAME || '—'} />
                {booking.PLACE && (
                  <Stack direction='row' spacing={0.75} alignItems='center' sx={{ mt: 0.5, pl: '34px' }}>
                    <Icon icon='tabler:map-pin' style={{ fontSize: 13, color: '#999' }} />
                    <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                      {booking.PLACE}
                    </Typography>
                  </Stack>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Stay Period */}
                <Typography
                  variant='caption'
                  color='text.secondary'
                  fontFamily={defaultPageFont}
                  sx={{ display: 'block', mb: 1.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}
                >
                  Stay Period
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Box
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      backgroundColor: '#f0faf4',
                      px: 2,
                      py: 1.5,
                      borderLeft: '3px solid #27ae60'
                    }}
                  >
                    <Stack direction='row' spacing={0.75} alignItems='center' sx={{ mb: 0.25 }}>
                      <Icon icon='tabler:plane-arrival' style={{ fontSize: 14, color: '#27ae60' }} />
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Check-in
                      </Typography>
                    </Stack>
                    <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                      {fmtDate(booking.CHECK_IN)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      backgroundColor: '#fef9f0',
                      px: 2,
                      py: 1.5,
                      borderLeft: '3px solid #e67e22'
                    }}
                  >
                    <Stack direction='row' spacing={0.75} alignItems='center' sx={{ mb: 0.25 }}>
                      <Icon icon='tabler:plane-departure' style={{ fontSize: 14, color: '#e67e22' }} />
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Check-out
                      </Typography>
                    </Stack>
                    <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                      {fmtDate(booking.CHECK_OUT)}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Stay Details */}
                <Typography
                  variant='caption'
                  color='text.secondary'
                  fontFamily={defaultPageFont}
                  sx={{ display: 'block', mb: 1.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}
                >
                  Stay Details
                </Typography>
                <Stack direction='row' spacing={1}>
                  <DetailChip
                    icon='tabler:moon'
                    value={`${booking.NIGHTS} night${Number(booking.NIGHTS) !== 1 ? 's' : ''}`}
                  />
                  <DetailChip
                    icon='tabler:door'
                    value={`${booking.ROOMS} room${Number(booking.ROOMS) !== 1 ? 's' : ''}`}
                  />
                  <DetailChip
                    icon='tabler:users'
                    value={[
                      `${booking.ADULTS} adult${Number(booking.ADULTS) !== 1 ? 's' : ''}`,
                      Number(booking.CHILDREN) > 0
                        ? `${booking.CHILDREN} child${Number(booking.CHILDREN) !== 1 ? 'ren' : ''}`
                        : null
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  />
                </Stack>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: '#f8fffe',
                  borderTop: '1px solid #e8f5ee',
                  textAlign: 'center'
                }}
              >
                <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                  Powered by{' '}
                  <Box component='span' sx={{ color: '#27ae60', fontWeight: 700 }}>
                    GoCommunityMap
                  </Box>
                </Typography>
              </Box>
            </Card>
          )}
        </Box>
      </Box>
    </>
  )
}

// ─── sub-components ──────────────────────────────────────────────────────────

const SummaryRow = ({ icon, label, value }) => (
  <Stack direction='row' spacing={1.5} alignItems='flex-start'>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1.5,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        mt: 0.25
      }}
    >
      <Icon icon={icon} style={{ fontSize: 17, color: '#555' }} />
    </Box>
    <Box>
      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
        {label}
      </Typography>
      <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
        {value}
      </Typography>
    </Box>
  </Stack>
)

const DetailChip = ({ icon, value }) => (
  <Stack
    direction='row'
    spacing={0.75}
    alignItems='center'
    sx={{
      flex: 1,
      borderRadius: 2,
      border: '1px solid #e0e0e0',
      px: 1.5,
      py: 1,
      backgroundColor: '#fff'
    }}
  >
    <Icon icon={icon} style={{ fontSize: 15, color: '#27ae60', flexShrink: 0 }} />
    <Typography variant='caption' fontWeight={600} fontFamily={defaultPageFont} sx={{ lineHeight: 1.3 }}>
      {value}
    </Typography>
  </Stack>
)

BookingScanSummary.getLayout = page => <BlankLayout>{page}</BlankLayout>
BookingScanSummary.guestGuard = true

export default BookingScanSummary
