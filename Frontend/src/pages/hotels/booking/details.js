import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import { useAuth } from 'src/hooks/useAuth'
import SeoHead from 'src/components/SeoHead'
import BookingStepperHeader from 'src/views/pages/hotels/booking/BookingStepperHeader'
import BookingSummaryCard from 'src/views/pages/hotels/booking/BookingSummaryCard'

import { arrivalTimeOptions, defaultPageFont, phonePrefixes } from 'src/@core/utils'

const HotelBookingDetails = () => {
  const router = useRouter()
  const { user } = useAuth()
  const q = router.query

  const pricePerNight = Number(q.pricePerNight) || 0
  const nights = Number(q.nights) || 1

  const selectedRooms = (() => {
    try {
      return JSON.parse(q.selectedRooms || '[]')
    } catch {
      return []
    }
  })()

  const rawSubtotal = Number(q.subtotal) || 0

  const roomsSubtotal =
    selectedRooms.length > 0 ? selectedRooms.reduce((sum, s) => sum + (s.price || 0) * (s.qty || 1) * nights, 0) : 0
  const computedSubtotal = roomsSubtotal > 0 ? roomsSubtotal : rawSubtotal > 0 ? rawSubtotal : pricePerNight * nights
  const computedServiceFee = Number(q.serviceFee) > 0 ? Number(q.serviceFee) : Math.round(computedSubtotal * 0.1)
  const computedTotal = Number(q.total) > 0 ? Number(q.total) : computedSubtotal + computedServiceFee

  const bookingData = {
    propertyId: q.propertyId || '',
    propertyName: q.propertyName || 'Hotel Property',
    propertyImage: q.propertyImage || '',
    place: q.place || '',
    pricePerNight,
    checkIn: q.checkIn || '',
    checkOut: q.checkOut || '',
    nights,
    adults: Number(q.adults) || 2,
    children: Number(q.children) || 0,
    rooms: Number(q.rooms) || 1,
    subtotal: computedSubtotal,
    serviceFee: computedServiceFee,
    total: computedTotal
  }

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'United States',
    phonePrefix: '+1',
    phone: '',
    bookingFor: 'self',
    travelForWork: 'no',
    specialRequests: '',
    arrivalTime: ''
  })
  const [rentCar, setRentCar] = useState(false)
  const [bookTaxi, setBookTaxi] = useState(false)

  // Pre-fill with logged-in user data
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ')[1] || '',
        email: user?.email || ''
      }))
    }
  }, [user])

  const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = () => {
    const params = new URLSearchParams({
      ...Object.fromEntries(Object.entries(bookingData).map(([k, v]) => [k, String(v)])),
      guestFirstName: form.firstName,
      guestLastName: form.lastName,
      guestEmail: form.email,
      guestCountry: form.country,
      guestPhone: `${form.phonePrefix}${form.phone}`,
      bookingFor: form.bookingFor,
      travelForWork: form.travelForWork,
      specialRequests: form.specialRequests,
      arrivalTime: form.arrivalTime,
      selectedRooms: JSON.stringify(selectedRooms)
    })
    router.push(`/hotels/booking/payment?${params.toString()}`)
  }

  return (
    <>
      <SeoHead title='Your Details – GoCommunityMap' description='Complete your hotel booking details.' />
      <BookingStepperHeader currentStep={2} />

      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 }, pt: 4 }}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={7}>
              {/* Signed In Banner */}
              {user && (
                <Card sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
                  <Avatar sx={{ backgroundColor: '#27ae60', width: 40, height: 40, fontWeight: 700 }}>
                    {(user?.firstName || user?.name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                      You are signed in
                    </Typography>
                    <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Card>
              )}

              {/* Review Selection */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
                  <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont}>
                    Review your selection
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ color: '#27ae60', fontWeight: 600, cursor: 'pointer', fontFamily: defaultPageFont }}
                    onClick={() => router.back()}
                  >
                    Change your selection
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack direction='row' spacing={1} alignItems='flex-start'>
                      <Icon icon='tabler:calendar' style={{ color: '#666', marginTop: 2 }} />
                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Dates
                        </Typography>
                        <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                          {bookingData.checkIn && bookingData.checkOut
                            ? `${bookingData.checkIn} – ${bookingData.checkOut}`
                            : 'Select dates'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction='row' spacing={1} alignItems='flex-start'>
                      <Icon icon='tabler:users' style={{ color: '#666', marginTop: 2 }} />
                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Travelers
                        </Typography>
                        <Typography variant='body2' fontWeight={600} fontFamily={defaultPageFont}>
                          {bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}, {bookingData.adults} adult
                          {bookingData.adults !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Per-room breakdown */}
                {selectedRooms.length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                    <Typography variant='caption' color='text.secondary' sx={{ mb: 1, display: 'block' }}>
                      Selected rooms
                    </Typography>
                    {selectedRooms.map((s, i) => (
                      <Stack key={i} direction='row' justifyContent='space-between' sx={{ mb: 0.5 }}>
                        <Stack direction='row' spacing={0.75} alignItems='center'>
                          <Icon icon='tabler:door' style={{ fontSize: 14, color: '#888' }} />
                          <Typography variant='caption' fontFamily={defaultPageFont}>
                            {s.name} &times; {s.qty}
                          </Typography>
                        </Stack>
                        <Typography variant='caption' fontWeight={600} fontFamily={defaultPageFont}>
                          ${' '}
                          {((s.price || 0) * (s.qty || 1) * nights).toLocaleString('en-US', {
                            minimumFractionDigits: 2
                          })}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                )}
              </Card>

              {/* Add to your stay */}
              {/* <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2 }}>
                  Add to your stay
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rentCar}
                      onChange={e => setRentCar(e.target.checked)}
                      sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }}
                    />
                  }
                  label={
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <Icon icon='tabler:car' style={{ fontSize: 20, color: '#555' }} />
                      <Typography variant='body2' fontFamily={defaultPageFont}>
                        I&apos;m interested in renting a car
                      </Typography>
                    </Stack>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bookTaxi}
                      onChange={e => setBookTaxi(e.target.checked)}
                      sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }}
                    />
                  }
                  label={
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <Icon icon='tabler:taxi' style={{ fontSize: 20, color: '#555' }} />
                      <Typography variant='body2' fontFamily={defaultPageFont}>
                        Want to book a taxi or private shuttle in advance?
                      </Typography>
                    </Stack>
                  }
                />
              </Card> */}

              {/* Enter your details */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 0.5 }}>
                  Enter your details
                </Typography>
                <Stack direction='row' spacing={0.5} alignItems='center' sx={{ mb: 2.5 }}>
                  <Icon icon='tabler:clock' style={{ fontSize: 14, color: '#888' }} />
                  <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
                    Almost done! Just fill in the * required info
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      First Name*
                    </Typography>
                    <TextField
                      fullWidth
                      size='small'
                      id='firstName'
                      placeholder='John'
                      value={form.firstName}
                      onChange={handleChange('firstName')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Last Name*
                    </Typography>
                    <TextField
                      fullWidth
                      size='small'
                      id='lastName'
                      placeholder='Doe'
                      value={form.lastName}
                      onChange={handleChange('lastName')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Email address*
                    </Typography>
                    <TextField
                      fullWidth
                      size='small'
                      type='email'
                      id='email'
                      placeholder='john.doe@example.com'
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                    />
                    <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                      Confirmation email sent to this address
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Country/Region *
                    </Typography>
                    <Select fullWidth size='small' value={form.country} onChange={handleChange('country')}>
                      {[
                        'United States',
                        'United Kingdom',
                        'Canada',
                        'Australia',
                        'Japan',
                        'Germany',
                        'France',
                        'India',
                        'United Arab Emirates',
                        'Singapore'
                      ].map(c => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Phone number *
                    </Typography>
                    <Stack direction='row' spacing={1}>
                      <Select
                        size='small'
                        value={form.phonePrefix}
                        onChange={handleChange('phonePrefix')}
                        sx={{ minWidth: 100 }}
                      >
                        {phonePrefixes.map(p => (
                          <MenuItem key={p.code} value={p.prefix}>
                            {p.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        fullWidth
                        size='small'
                        placeholder='123.456.7890'
                        value={form.phone}
                        onChange={handleChange('phone')}
                      />
                    </Stack>
                    <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                      Needed by the property to validate your booking
                    </Typography>
                  </Grid>
                </Grid>

                {/* Who are you booking for */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }} fontFamily={defaultPageFont}>
                    Who are you booking for?
                  </Typography>
                  <RadioGroup value={form.bookingFor} onChange={handleChange('bookingFor')}>
                    <FormControlLabel
                      value='self'
                      control={<Radio size='small' sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }} />}
                      label={<Typography variant='body2'>I am the main guest</Typography>}
                    />
                    <FormControlLabel
                      value='other'
                      control={<Radio size='small' sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }} />}
                      label={<Typography variant='body2'>Booking for someone else</Typography>}
                    />
                  </RadioGroup>
                </Box>

                {/* Travel for work */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }} fontFamily={defaultPageFont}>
                    Are you travelling for work?
                  </Typography>
                  <RadioGroup row value={form.travelForWork} onChange={handleChange('travelForWork')}>
                    <FormControlLabel
                      value='yes'
                      control={<Radio size='small' sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }} />}
                      label={<Typography variant='body2'>Yes</Typography>}
                    />
                    <FormControlLabel
                      value='no'
                      control={<Radio size='small' sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }} />}
                      label={<Typography variant='body2'>No</Typography>}
                    />
                  </RadioGroup>
                </Box>
              </Card>

              {/* Special Requests */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 0.5 }}>
                  Special requests
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
                  Special requests cannot be guaranteed – but the property will do its best to meet your needs.
                </Typography>
                <Typography variant='caption' fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                  Please write your requests in English or Japanese (optional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size='small'
                  value={form.specialRequests}
                  onChange={handleChange('specialRequests')}
                  placeholder='e.g. Quiet room, high floor, early check-in…'
                />
              </Card>

              {/* Arrival Time */}
              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 0.5 }}>
                  Your arrival time
                </Typography>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 0.5 }}>
                  <Icon icon='tabler:circle-check' style={{ color: '#27ae60', fontSize: 18 }} />
                  <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont}>
                    Your room will be ready for check-in at 3:00 PM
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 2 }}>
                  <Icon icon='tabler:circle-check' style={{ color: '#27ae60', fontSize: 18 }} />
                  <Typography variant='body2' color='text.secondary' fontFamily={defaultPageFont}>
                    24-hour front desk – help whenever you need it!
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Typography variant='body2' fontFamily={defaultPageFont}>
                    Add your estimated arrival time (optional)
                  </Typography>
                  <Select
                    size='small'
                    displayEmpty
                    value={form.arrivalTime}
                    onChange={handleChange('arrivalTime')}
                    sx={{ minWidth: 160 }}
                    renderValue={v => v || 'Please select'}
                  >
                    <MenuItem value=''>Please select</MenuItem>
                    {arrivalTimeOptions.map(opt => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Card>

              {/* CTA */}
              <Button
                fullWidth
                variant='contained'
                size='large'
                sx={{
                  backgroundColor: '#27ae60',
                  '&:hover': { backgroundColor: '#229954' },
                  py: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  fontFamily: defaultPageFont
                }}
                onClick={handleSubmit}
                disabled={!form.firstName || !form.lastName || !form.email}
              >
                Next: Final details →
              </Button>
            </Grid>

            {/* Right Column – Summary */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'sticky', top: 140 }}>
                <BookingSummaryCard
                  propertyName={bookingData.propertyName}
                  place={bookingData.place}
                  image={bookingData.propertyImage}
                  checkIn={bookingData.checkIn}
                  checkOut={bookingData.checkOut}
                  nights={bookingData.nights}
                  pricePerNight={bookingData.pricePerNight}
                  subtotal={bookingData.subtotal}
                  serviceFee={bookingData.serviceFee}
                  total={bookingData.total}
                  selectedRooms={selectedRooms}
                  showPriceSummary={true}
                  showCancellation={true}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

HotelBookingDetails.guestGuard = true
HotelBookingDetails.getLayout = page => page

export default HotelBookingDetails
