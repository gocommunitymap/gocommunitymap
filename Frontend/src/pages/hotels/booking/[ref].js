import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SeoHead from 'src/components/SeoHead'
import { getBookingAPI } from 'src/configs/services/api-methods/guest'
import { dateConvert, defaultPageFont } from 'src/@core/utils'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import themeConfig from 'src/configs/themeConfig'

const formatDate = dateStr => {
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

const InfoRow = ({ icon, label, value }) => (
  <Stack direction='row' spacing={1.5} alignItems='flex-start'>
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: 2,
        backgroundColor: '#f0faf4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        mt: 0.3
      }}
    >
      <Icon icon={icon} style={{ fontSize: 18, color: '#27ae60' }} />
    </Box>
    <Box>
      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
        {label}
      </Typography>
      <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
        {value || '—'}
      </Typography>
    </Box>
  </Stack>
)

const HotelBookingDetail = () => {
  const router = useRouter()
  const { ref } = router.query

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ref) return

    setLoading(true)
    getBookingAPI({ BOOKING_NO: ref })
      .then(res => {
        const record = res?.data?.[0] || null
        if (record) {
          setBooking(record)
          setError('')
        } else {
          setError('Booking not found')
        }
      })
      .catch(() => {
        setError('Booking not found')
      })
      .finally(() => setLoading(false))
  }, [ref])

  const statusColor = status => {
    if (!status) return { bg: '#f5f5f5', text: '#666' }
    const s = status.toUpperCase()
    if (s === 'CONFIRMED') return { bg: '#e8f8ef', text: '#27ae60' }
    if (s === 'CANCELLED') return { bg: '#fdecea', text: '#e53935' }
    if (s === 'PENDING') return { bg: '#fff8e1', text: '#f59e0b' }

    return { bg: '#f5f5f5', text: '#555' }
  }

  const roomDetails = (() => {
    if (!booking?.ROOM_DETAILS) return []
    try {
      const parsed = JSON.parse(booking.ROOM_DETAILS)

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  return (
    <>
      <SeoHead
        title={
          booking
            ? `Booking #${booking.CODE || ref} – ${themeConfig.templateName}`
            : `Booking Details – ${themeConfig.templateName}`
        }
        description='View your hotel booking details.'
      />

      <Box>
        {/* Header bar */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            px: { xs: 2, md: 4 },
            py: 1.8,
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <Box
            sx={{
              width: '100%',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Button
              size='small'
              startIcon={<Icon icon='tabler:arrow-left' />}
              onClick={() => router.back()}
              sx={{ color: '#555', fontFamily: defaultPageFont, textTransform: 'none' }}
            >
              Back
            </Button>
            <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont}>
              Booking Details
            </Typography>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 4 }, pt: 4 }}>
          {/* Loading skeleton */}
          {loading && (
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant='rectangular' height={28} width='40%' sx={{ mb: 2 }} />
              <Skeleton variant='rectangular' height={20} width='60%' sx={{ mb: 1 }} />
              <Skeleton variant='rectangular' height={20} width='50%' sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={6} md={4} key={i}>
                    <Skeleton variant='rectangular' height={56} />
                  </Grid>
                ))}
              </Grid>
            </Card>
          )}

          {/* Error state */}
          {!loading && error && (
            <Card sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Icon icon='tabler:file-search' style={{ fontSize: 56, color: '#ccc' }} />
              <Typography variant='h6' fontWeight={700} fontFamily={defaultPageFont} sx={{ mt: 2, mb: 1 }}>
                Booking not found
              </Typography>
              <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont} sx={{ mb: 3 }}>
                {error}
              </Typography>
              <Button
                variant='contained'
                onClick={() => router.push('/account')}
                sx={{
                  backgroundColor: '#27ae60',
                  '&:hover': { backgroundColor: '#229954' },
                  fontFamily: defaultPageFont,
                  borderRadius: 2
                }}
              >
                View My Bookings
              </Button>
            </Card>
          )}

          {/* Booking detail */}
          {!loading && booking && (
            <>
              {/* Status header */}
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)'
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  <Stack direction='row' spacing={1.5} alignItems='center'>
                    <Icon icon='tabler:building-hotel' style={{ fontSize: 24, color: '#fff' }} />
                    <Box>
                      <Typography variant='h6' fontWeight={800} color='#fff' fontFamily={defaultPageFont}>
                        {booking.PROPERTY_NAME || 'Hotel Booking'}
                      </Typography>
                      {booking.PLACE && (
                        <Stack direction='row' spacing={0.5} alignItems='center'>
                          <Icon icon='tabler:map-pin' style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }} />
                          <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.85)' }}>
                            {booking.PLACE}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={(booking.STATUS || 'CONFIRMED').toUpperCase()}
                      size='small'
                      sx={{
                        backgroundColor: '#fff',
                        color: statusColor(booking.STATUS).text,
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        letterSpacing: 1,
                        mb: 0.5
                      }}
                    />
                    <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                      Ref: #{booking.CODE || ref}
                    </Typography>
                  </Box>
                </Box>

                {/* Stay dates */}
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Stack direction='row' spacing={1.5} alignItems='flex-start'>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                            backgroundColor: '#f0faf4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon icon='tabler:plane-arrival' style={{ fontSize: 18, color: '#27ae60' }} />
                        </Box>
                        <Box>
                          <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                            Check-in
                          </Typography>
                          <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                            {dateConvert(booking.CHECK_IN)}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {booking?.CHECK_IN_TIMESLOT_DESC ? `From ${booking.CHECK_IN_TIMESLOT_DESC}` : 'From —'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction='row' spacing={1.5} alignItems='flex-start'>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                            backgroundColor: '#fef9f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon icon='tabler:plane-departure' style={{ fontSize: 18, color: '#e67e22' }} />
                        </Box>
                        <Box>
                          <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                            Check-out
                          </Typography>
                          <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                            {dateConvert(booking.CHECK_OUT)}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {booking?.CHECK_OUT_TIMESLOT_DESC ? `By ${booking.CHECK_OUT_TIMESLOT_DESC}` : 'By —'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Duration
                      </Typography>
                      <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                        {booking.NIGHTS} night{Number(booking.NIGHTS) !== 1 ? 's' : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Guests
                      </Typography>
                      <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                        {booking.ADULTS} adult{Number(booking.ADULTS) !== 1 ? 's' : ''}
                        {Number(booking.CHILDREN) > 0 &&
                          `, ${booking.CHILDREN} child${Number(booking.CHILDREN) !== 1 ? 'ren' : ''}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                        Rooms
                      </Typography>
                      <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                        {booking.ROOMS} room{Number(booking.ROOMS) !== 1 ? 's' : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Card>

              {/* Booked Rooms */}
              {roomDetails.length > 0 && (
                <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2.5 }}>
                    Booked Rooms
                  </Typography>
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#27ae60' }}>
                          {['#', 'Room Type', 'Price / Night', 'Qty', 'Nights', 'Amount'].map((h, i) => (
                            <TableCell
                              key={h}
                              align={i === 0 || i === 1 ? 'left' : 'right'}
                              sx={{
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: 12,
                                whiteSpace: 'nowrap',
                                borderBottom: 'none'
                              }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roomDetails.map((room, idx) => {
                          const roomAmount =
                            Number(room.PRICE || 0) * (room.ROOMS_QUANTITY || 1) * Number(booking.NIGHTS || 1)

                          return (
                            <TableRow
                              key={room.ROOM_ID || idx}
                              sx={{
                                backgroundColor: idx % 2 === 0 ? '#f9fdfb' : '#fff',
                                '&:last-child td': { borderBottom: 0 }
                              }}
                            >
                              <TableCell sx={{ color: '#888', fontWeight: 600, fontFamily: defaultPageFont }}>
                                {idx + 1}
                              </TableCell>
                              <TableCell sx={{ color: '#1a1a1a', fontWeight: 600, fontFamily: defaultPageFont }}>
                                {room.ROOM_TYPE?.[0]?.ROOM_TYPE_DESC || '—'}
                              </TableCell>
                              <TableCell
                                align='right'
                                sx={{
                                  color: '#27ae60',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                  fontFamily: defaultPageFont
                                }}
                              >
                                $ {Number(room.PRICE || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell align='right' sx={{ color: '#555', fontFamily: defaultPageFont }}>
                                {room.ROOMS_QUANTITY || 1}
                              </TableCell>
                              <TableCell align='right' sx={{ color: '#555', fontFamily: defaultPageFont }}>
                                {booking.NIGHTS || 1}
                              </TableCell>
                              <TableCell
                                align='right'
                                sx={{
                                  color: '#27ae60',
                                  fontWeight: 700,
                                  fontFamily: defaultPageFont
                                }}
                              >
                                $ {roomAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              )}
              <Grid container spacing={3}>
                {/* Left column */}
                <Grid item xs={12} md={7}>
                  {/* Guest info */}
                  <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2.5 }}>
                      Guest Information
                    </Typography>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <InfoRow
                          icon='tabler:user'
                          label='Guest name'
                          value={`${booking.GUEST_FIRST_NAME || ''} ${booking.GUEST_LAST_NAME || ''}`.trim()}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoRow icon='tabler:mail' label='Email' value={booking.GUEST_EMAIL} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoRow icon='tabler:phone' label='Phone' value={booking.GUEST_PHONE} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoRow icon='tabler:world' label='Country' value={booking.GUEST_COUNTRY} />
                      </Grid>
                      {booking.ARRIVAL_TIME && (
                        <Grid item xs={12} sm={6}>
                          <InfoRow icon='tabler:clock' label='Expected arrival' value={booking.ARRIVAL_TIME} />
                        </Grid>
                      )}
                    </Grid>
                  </Card>

                  {/* Payment info */}
                  <Card sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2.5 }}>
                      Payment Details
                    </Typography>
                    <Stack spacing={1.5}>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont}>
                          Room subtotal
                        </Typography>
                        <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                          $ {Number(booking.SUBTOTAL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Stack>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont}>
                          Taxes & fees
                        </Typography>
                        <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                          $ {Number(booking.SERVICE_FEE || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                          Total paid
                        </Typography>
                        <Typography variant='h6' fontWeight={800} fontFamily={defaultPageFont} color='#27ae60'>
                          $ {Number(booking.TOTAL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Stack>
                      {booking.PAYMENT_METHOD && (
                        <Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 0.5 }}>
                          <Icon icon='tabler:credit-card' style={{ fontSize: 16, color: '#888' }} />
                          <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                            Paid via {booking.PAYMENT_METHOD}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                </Grid>

                {/* Right column */}
                <Grid item xs={12} md={5}>
                  {/* Booking reference card */}
                  <Card sx={{ p: 3, borderRadius: 3, mb: 3, border: '2px solid #e8f8ef' }}>
                    <Stack direction='row' spacing={1.5} alignItems='center' sx={{ mb: 2 }}>
                      <Icon icon='tabler:ticket' style={{ fontSize: 22, color: '#27ae60' }} />
                      <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont}>
                        Booking Reference
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        backgroundColor: '#f0faf4',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        mb: 2
                      }}
                    >
                      <Typography
                        variant='h5'
                        fontWeight={800}
                        fontFamily={defaultPageFont}
                        sx={{ color: '#27ae60', letterSpacing: 2 }}
                      >
                        #{booking.CODE || ref}
                      </Typography>
                    </Box>
                    <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                      Keep this reference handy — you&apos;ll need it to manage your booking or contact support.
                    </Typography>
                  </Card>

                  {/* Cancellation policy */}
                  <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant='subtitle2' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 1.5 }}>
                      Cancellation Policy
                    </Typography>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                      <Box>
                        <Typography
                          variant='body2'
                          sx={{ color: '#27ae60', fontWeight: 600, fontFamily: defaultPageFont }}
                        >
                          Free cancellation
                        </Typography>
                        <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                          Until 48 hours before check-in
                        </Typography>
                      </Box>
                      <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                        $ 0
                      </Typography>
                    </Stack>
                  </Card>

                  {/* Need help */}
                  <Card sx={{ p: 3, borderRadius: 3 }}>
                    <Stack direction='row' spacing={1.5} alignItems='flex-start'>
                      <Icon icon='tabler:headset' style={{ fontSize: 20, color: '#555', marginTop: 2 }} />
                      <Box>
                        <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                          Need help?
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#27ae60', cursor: 'pointer' }}>
                          Contact Support
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>

              {/* Actions */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center' sx={{ mt: 4 }}>
                <Button
                  variant='contained'
                  size='large'
                  startIcon={<Icon icon='tabler:file-invoice' />}
                  onClick={() => router.push(`/hotels/booking/invoice/${booking.BOOKING_NO || ref}`)}
                  sx={{
                    backgroundColor: '#27ae60',
                    '&:hover': { backgroundColor: '#229954' },
                    fontFamily: defaultPageFont,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4
                  }}
                >
                  View Invoice
                </Button>

                <Button
                  variant='outlined'
                  size='large'
                  startIcon={<Icon icon='tabler:calendar-event' />}
                  onClick={() => router.push('/account/bookings')}
                  sx={{
                    borderColor: '#27ae60',
                    color: '#27ae60',
                    '&:hover': { borderColor: '#229954', backgroundColor: '#f0faf4' },
                    fontFamily: defaultPageFont,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4
                  }}
                >
                  My Bookings
                </Button>
                <Button
                  variant='outlined'
                  size='large'
                  startIcon={<Icon icon='tabler:building-hotel' />}
                  onClick={() => router.push('/hotels')}
                  sx={{
                    borderColor: '#ddd',
                    color: '#555',
                    '&:hover': { borderColor: '#bbb', backgroundColor: '#f9f9f9' },
                    fontFamily: defaultPageFont,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4
                  }}
                >
                  Find More Hotels
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}

HotelBookingDetail.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default HotelBookingDetail
