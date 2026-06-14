import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import { getBookingAPI, cancelBookingAPI } from 'src/configs/services/api-methods/guest'
import SeoHead from 'src/components/SeoHead'
import { dateConvert } from 'src/@core/utils'
import themeConfig from 'src/configs/themeConfig'

const pageTitle = 'My Bookings'

const statusMeta = status => {
  const s = (status || '').toUpperCase()
  if (s === 'CONFIRMED') return { label: 'Confirmed', color: 'success', bg: '#e8f8ef', text: '#27ae60' }
  if (s === 'CANCELLED') return { label: 'Cancelled', color: 'error', bg: '#fdecea', text: '#e53935' }
  if (s === 'PENDING') return { label: 'Pending', color: 'warning', bg: '#fff8e1', text: '#f59e0b' }

  return { label: status || 'Unknown', color: 'default', bg: '#f5f5f5', text: '#555' }
}

const formatDate = dateStr => {
  if (!dateStr) return '—'
  const [y, m, d] = String(dateStr).split('-').map(Number)
  if (!y || !m || !d) return dateStr

  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const resolveBookingListingType = booking => {
  const numericCandidates = [
    booking?.LISTING_TYPE_ID,
    booking?.LISTING_TYPE,
    booking?.PROPERTY_LISTING_TYPE_ID,
    booking?.TYPE_ID
  ]

  for (const candidate of numericCandidates) {
    const parsed = Number(candidate)
    if (parsed === 2) return 2
    if (parsed === 1) return 1
  }

  const displayType = Number(booking?.DISPLAY_TYPE)
  if (displayType === 3) return 2
  if (displayType === 2) return 1

  const hintText = [
    booking?.LISTING_TYPE_DESC,
    booking?.LISTING_TYPE_NAME,
    booking?.PROPERTY_TYPE_DESC,
    booking?.CATEGORY
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (hintText.includes('rental')) return 2
  if (hintText.includes('hotel')) return 1

  return 1
}

const bookingRouteBase = booking => (resolveBookingListingType(booking) === 2 ? '/rentals/booking' : '/hotels/booking')

const BookingCard = ({ booking, onView, onCancel }) => {
  const meta = statusMeta(booking.STATUS)
  const isCancelled = (booking.STATUS || '').toUpperCase() === 'CANCELLED'
  const isRental = resolveBookingListingType(booking) === 2
  const bookingLabel = booking.PROPERTY_NAME || (isRental ? 'Rental Booking' : 'Hotel Booking')

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: isCancelled ? '1px solid #fdecea' : '1px solid #e8f8ef',
        opacity: isCancelled ? 0.75 : 1
      }}
    >
      {/* Coloured header strip */}
      <Box
        sx={{
          background: isCancelled
            ? 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)'
            : 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Stack direction='row' spacing={1.5} alignItems='center'>
          <Icon icon={isRental ? 'tabler:home' : 'tabler:building-hotel'} style={{ fontSize: 20, color: '#fff' }} />
          <Typography variant='subtitle2' fontWeight={700} color='#fff'>
            {bookingLabel}
          </Typography>
        </Stack>
        <Chip
          label={meta.label.toUpperCase()}
          size='small'
          sx={{ backgroundColor: '#fff', color: meta.text, fontWeight: 800, fontSize: '0.7rem', letterSpacing: 0.5 }}
        />
      </Box>

      <Box sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2} alignItems='center'>
          {/* Booking ref */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant='caption' color='text.secondary'>
              Booking Ref
            </Typography>
            <Typography variant='body2' fontWeight={700} sx={{ color: isCancelled ? '#e53935' : '#27ae60' }}>
              #{booking.BOOKING_NO}
            </Typography>
          </Grid>

          {/* Dates */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant='caption' color='text.secondary'>
              Check-in
            </Typography>
            <Typography variant='body2' fontWeight={600}>
              {dateConvert(booking.CHECK_IN)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant='caption' color='text.secondary'>
              Check-out
            </Typography>
            <Typography variant='body2' fontWeight={600}>
              {dateConvert(booking.CHECK_OUT)}
            </Typography>
          </Grid>

          {/* Guests summary */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant='caption' color='text.secondary'>
              Stay
            </Typography>
            <Typography variant='body2' fontWeight={600}>
              {booking.NIGHTS}N &bull; {booking.ROOMS}R &bull; {booking.ADULTS}A
              {Number(booking.CHILDREN) > 0 ? ` ${booking.CHILDREN}C` : ''}
            </Typography>
          </Grid>

          {/* Total */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant='caption' color='text.secondary'>
              Total Paid
            </Typography>
            <Typography variant='body2' fontWeight={700} color={isCancelled ? 'text.secondary' : '#27ae60'}>
              $ {Number(booking.TOTAL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} sm={12} md={2}>
            <Stack direction='row' spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Tooltip title='View booking details'>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<Icon icon='tabler:eye' />}
                  onClick={() => onView(booking)}
                  sx={{
                    backgroundColor: isCancelled ? '#888' : '#27ae60',
                    '&:hover': { backgroundColor: isCancelled ? '#666' : '#229954' },
                    fontSize: '0.75rem'
                  }}
                >
                  View
                </Button>
              </Tooltip>
              {!isCancelled && (
                <Tooltip title='Cancel this booking'>
                  <Button
                    size='small'
                    variant='outlined'
                    color='error'
                    startIcon={<Icon icon='tabler:x' />}
                    onClick={() => onCancel(booking)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Cancel
                  </Button>
                </Tooltip>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

const MyBookings = () => {
  const router = useRouter()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [filter, setFilter] = useState('ALL')

  const fetchBookings = () => {
    setLoading(true)
    getBookingAPI()
      .then(res => setBookings(res?.data || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await cancelBookingAPI({ BOOKING_NO: cancelTarget.BOOKING_NO })
      toast.success('Booking cancelled successfully')
      setCancelTarget(null)
      fetchBookings()
    } catch {
      toast.error('Failed to cancel booking. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const filterTabs = ['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED']

  const displayed = filter === 'ALL' ? bookings : bookings.filter(b => (b.STATUS || '').toUpperCase() === filter)

  return (
    <>
      <SeoHead
        title={`${pageTitle} – ${themeConfig.templateName}`}
        description='View and manage your property bookings.'
      />

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={pageTitle}
              subheader={`${bookings.length} total booking${bookings.length !== 1 ? 's' : ''}`}
              action={
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<Icon icon='tabler:search' />}
                  onClick={() => router.push('/home')}
                  sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#229954' } }}
                >
                  Explore Properties
                </Button>
              }
            />
          </Card>
        </Grid>

        {/* Filter chips */}
        {!loading && bookings.length > 0 && (
          <Grid item xs={12}>
            <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
              {filterTabs.map(tab => (
                <Chip
                  key={tab}
                  label={tab === 'ALL' ? `All (${bookings.length})` : tab}
                  onClick={() => setFilter(tab)}
                  variant={filter === tab ? 'filled' : 'outlined'}
                  color={
                    tab === 'CONFIRMED'
                      ? 'success'
                      : tab === 'CANCELLED'
                      ? 'error'
                      : tab === 'PENDING'
                      ? 'warning'
                      : 'primary'
                  }
                  sx={{ fontWeight: filter === tab ? 700 : 400, cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Grid>
        )}

        {/* Loading */}
        {loading && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#27ae60' }} />
              <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
                Loading your bookings…
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Icon icon='tabler:calendar-off' style={{ fontSize: 64, color: '#ccc' }} />
              <Typography variant='h6' fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                No bookings yet
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Your confirmed hotel and rental bookings will appear here.
              </Typography>
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:search' />}
                onClick={() => router.push('/home')}
                sx={{ backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#229954' } }}
              >
                Explore Properties
              </Button>
            </Card>
          </Grid>
        )}

        {/* No results for active filter */}
        {!loading && bookings.length > 0 && displayed.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant='body2' color='text.secondary'>
                No {filter.toLowerCase()} bookings found.
              </Typography>
            </Card>
          </Grid>
        )}

        {/* Booking cards */}
        {!loading &&
          displayed.map((b, i) => (
            <Grid item xs={12} key={b.BOOKING_NO || i}>
              <BookingCard
                booking={b}
                onView={row => router.push(`${bookingRouteBase(row)}/${row.BOOKING_NO}`)}
                onCancel={setCancelTarget}
              />
            </Grid>
          ))}
      </Grid>

      {/* Cancel confirmation dialog */}
      <Dialog open={Boolean(cancelTarget)} onClose={() => !cancelling && setCancelTarget(null)} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon='tabler:alert-triangle' style={{ color: '#e53935', fontSize: 22 }} />
          Cancel Booking
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText>
            Are you sure you want to cancel booking{' '}
            <strong style={{ color: '#27ae60' }}>#{cancelTarget?.BOOKING_NO}</strong> at{' '}
            <strong>{cancelTarget?.PROPERTY_NAME}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 1.5, color: '#e53935', fontSize: '0.85rem' }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelTarget(null)} disabled={cancelling}>
            Keep Booking
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleConfirmCancel}
            disabled={cancelling}
            startIcon={cancelling ? null : <Icon icon='tabler:x-circle' />}
          >
            {cancelling ? 'Cancelling…' : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyBookings
