import { Box, Button, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SeoHead from 'src/components/SeoHead'
import { dateConvert, defaultPageFont } from 'src/@core/utils'
import themeConfig from 'src/configs/themeConfig'

const RentalBookingConfirmed = () => {
  const router = useRouter()
  const q = router.query

  const nights = Number(q.nights) || 1
  const pricePerNight = Number(q.pricePerNight) || 0
  const rawTotal = Number(q.total) || 0

  const selectedRooms = (() => {
    try {
      const parsed = JSON.parse(q.selectedRooms || '[]')

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  const roomsSubtotal =
    selectedRooms.length > 0
      ? selectedRooms.reduce((sum, s) => sum + (Number(s.price) || 0) * (Number(s.qty) || 1) * nights, 0)
      : 0

  const computedSubtotal =
    roomsSubtotal > 0 ? roomsSubtotal : Number(q.subtotal) > 0 ? Number(q.subtotal) : pricePerNight * nights
  const computedServiceFee = Number(q.serviceFee) > 0 ? Number(q.serviceFee) : Math.round(computedSubtotal * 0.1)
  const computedTotal = rawTotal > 0 ? rawTotal : computedSubtotal + computedServiceFee

  const bookingData = {
    propertyName: q.propertyName || 'Rental Property',
    place: q.place || '',
    checkIn: q.checkIn || '',
    checkOut: q.checkOut || '',
    checkInTime: q.checkInTime || '',
    checkOutTime: q.checkOutTime || '',
    nights,
    total: computedTotal,
    paymentMethod: q.paymentMethod || 'Credit Card',
    guestEmail: q.guestEmail || 'your email'
  }

  const bookingId = q.bookingRef || ''

  return (
    <>
      <SeoHead
        title={`Booking Confirmed – ${themeConfig.templateName}`}
        description='Your rental booking is confirmed.'
      />

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #e8f8ef 0%, #f4fdf8 50%, #ffffff 100%)',
          pb: 10
        }}
      >
        <Box sx={{ maxWidth: 680, mx: 'auto', px: { xs: 2, md: 4 }, pt: { xs: 5, md: 8 }, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 24px rgba(39,174,96,0.3)'
            }}
          >
            <Icon icon='tabler:check' style={{ fontSize: 44, color: '#fff' }} />
          </Box>

          <Typography variant='h4' fontWeight={800} fontFamily={defaultPageFont} sx={{ mb: 1 }}>
            Booking Confirmed!
          </Typography>
          <Typography variant='body1' color='text.secondary' fontFamily={defaultPageFont} sx={{ mb: 4 }}>
            We&apos;re getting things ready for you. A confirmation email has been sent to{' '}
            <Typography component='span' fontWeight={600} color='text.primary'>
              {bookingData.guestEmail}
            </Typography>
          </Typography>

          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              textAlign: 'left',
              mb: 4
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Stack direction='row' spacing={1} alignItems='center'>
                <Icon icon='tabler:home' style={{ fontSize: 22, color: '#fff' }} />
                <Typography variant='subtitle2' fontWeight={600} color='#fff' fontFamily={defaultPageFont}>
                  RENTAL STAY
                </Typography>
              </Stack>
              <Chip
                label='CONFIRMED'
                size='small'
                sx={{
                  backgroundColor: '#fff',
                  color: '#27ae60',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  letterSpacing: 1
                }}
              />
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography variant='h6' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 0.5 }}>
                {bookingData.propertyName}
              </Typography>
              {bookingData.place && (
                <Stack direction='row' spacing={0.5} alignItems='center' sx={{ mb: 2 }}>
                  <Icon icon='tabler:map-pin' style={{ fontSize: 14, color: '#888' }} />
                  <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont}>
                    {bookingData.place}
                  </Typography>
                </Stack>
              )}

              <Divider sx={{ mb: 2.5 }} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Stack direction='row' spacing={1.5} alignItems='flex-start'>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: '#f0faf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon icon='tabler:plane-arrival' style={{ fontSize: 18, color: '#27ae60' }} />
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Check-in
                      </Typography>
                      <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                        {dateConvert(bookingData.checkIn)}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {bookingData.checkInTime ? `From ${bookingData.checkInTime}` : 'From —'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction='row' spacing={1.5} alignItems='flex-start'>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: '#fef9f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon icon='tabler:plane-departure' style={{ fontSize: 18, color: '#e67e22' }} />
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Check-out
                      </Typography>
                      <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                        {dateConvert(bookingData.checkOut)}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {bookingData.checkOutTime ? `By ${bookingData.checkOutTime}` : 'By —'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                    Duration
                  </Typography>
                  <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                    {bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5 }} />

              <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                    Total price (paid via {bookingData.paymentMethod})
                  </Typography>
                  <Typography variant='h6' fontWeight={800} fontFamily={defaultPageFont} color='#27ae60'>
                    $ {bookingData.total.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                    Booking ID
                  </Typography>
                  <Typography
                    variant='body2'
                    fontWeight={700}
                    fontFamily={defaultPageFont}
                    sx={{
                      backgroundColor: '#f0faf4',
                      color: '#27ae60',
                      px: 1.5,
                      py: 0.3,
                      borderRadius: 1,
                      display: 'inline-block',
                      mt: 0.3
                    }}
                  >
                    #{bookingId}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center' sx={{ mb: 5 }}>
            <Button
              variant='contained'
              size='large'
              sx={{
                backgroundColor: '#27ae60',
                '&:hover': { backgroundColor: '#229954' },
                px: 4,
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                fontFamily: defaultPageFont,
                gap: 1
              }}
              onClick={() => router.push('/account/bookings')}
            >
              <Icon icon='tabler:calendar-event' style={{ fontSize: 20 }} />
              My Bookings
            </Button>

            {bookingId && (
              <Button
                variant='outlined'
                size='large'
                sx={{
                  borderColor: '#27ae60',
                  color: '#27ae60',
                  '&:hover': { borderColor: '#229954', backgroundColor: '#f0faf4' },
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontFamily: defaultPageFont,
                  gap: 1
                }}
                onClick={() => router.push(`/rentals/booking/${bookingId}`)}
              >
                <Icon icon='tabler:ticket' style={{ fontSize: 20 }} />
                View Booking
              </Button>
            )}

            {bookingId && (
              <Button
                variant='outlined'
                size='large'
                sx={{
                  borderColor: '#1a7d4d',
                  color: '#1a7d4d',
                  '&:hover': { borderColor: '#27ae60', backgroundColor: '#f0faf4' },
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontFamily: defaultPageFont,
                  gap: 1
                }}
                onClick={() => router.push(`/rentals/booking/invoice/${bookingId}`)}
              >
                <Icon icon='tabler:file-invoice' style={{ fontSize: 20 }} />
                Download Invoice
              </Button>
            )}

            <Button
              variant='outlined'
              size='large'
              sx={{
                borderColor: '#27ae60',
                color: '#27ae60',
                '&:hover': { borderColor: '#229954', backgroundColor: '#f0faf4' },
                px: 4,
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                fontFamily: defaultPageFont,
                gap: 1
              }}
              onClick={() => router.push('/')}
            >
              <Icon icon='tabler:compass' style={{ fontSize: 20 }} />
              Explore Community
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />
          <Stack direction='row' spacing={3} justifyContent='center' flexWrap='wrap' sx={{ mb: 2 }}>
            {['Privacy Policy', 'Terms of Service', 'Help Center'].map(link => (
              <Typography
                key={link}
                variant='caption'
                sx={{ color: '#888', cursor: 'pointer', '&:hover': { color: '#27ae60' } }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
          <Stack direction='row' spacing={2} justifyContent='center'>
            {['tabler:brand-facebook', 'tabler:brand-instagram', 'tabler:brand-twitter'].map(icon => (
              <Box
                key={icon}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#e0faf0' }
                }}
              >
                <Icon icon={icon} style={{ fontSize: 16, color: '#555' }} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

RentalBookingConfirmed.getLayout = page => <GuestBlankLayout>{page}</GuestBlankLayout>

export default RentalBookingConfirmed
