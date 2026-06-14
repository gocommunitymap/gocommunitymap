import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
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
import LoginModal from 'src/layouts/components/horizontal/LoginModal'
import SeoHead from 'src/components/SeoHead'
import BookingStepperHeader from 'src/views/pages/hotels/booking/BookingStepperHeader'
import BookingSummaryCard from 'src/views/pages/hotels/booking/BookingSummaryCard'

import { arrivalTimeOptions, defaultPageFont, phonePrefixes, POPULAR_COUNTRIES } from 'src/@core/utils'
import { registerUserAPI } from 'src/configs'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import themeConfig from 'src/configs/themeConfig'

const PasswordValidationRow = ({ label, passed }) => (
  <Box display='flex' alignItems='center' gap={1} mt={0.75}>
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: passed ? 'primary.main' : 'action.disabledBackground',
        flexShrink: 0,
        transition: 'background-color 0.2s'
      }}
    >
      <Icon fontSize={11} icon={passed ? 'tabler:check' : 'tabler:minus'} color={passed ? 'white' : ''} />
    </Box>
    <Typography variant='caption' color={passed ? 'primary.main' : 'text.secondary'} sx={{ transition: 'color 0.2s' }}>
      {label}
    </Typography>
  </Box>
)

const getPasswordStrength = validations => {
  const passed = Object.values(validations).filter(v => !v).length
  if (passed === 5) return { score: 100, label: 'Strong', color: 'primary.main' }
  if (passed === 4) return { score: 80, label: 'Good', color: 'info.main' }
  if (passed === 3) return { score: 60, label: 'Fair', color: 'warning.main' }
  if (passed >= 1) return { score: 30, label: 'Weak', color: 'error.main' }

  return { score: 0, label: '', color: 'divider' }
}

const HotelBookingDetails = () => {
  const router = useRouter()
  const { user, login } = useAuth()
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
  const rawServiceFee = Number(q.serviceFee) || 0
  const rawTotal = Number(q.total) || 0

  const roomsSubtotal =
    selectedRooms.length > 0
      ? selectedRooms.reduce((sum, s) => sum + (Number(s.price) || 0) * (Number(s.qty) || 1) * nights, 0)
      : 0
  const computedSubtotal = roomsSubtotal > 0 ? roomsSubtotal : rawSubtotal > 0 ? rawSubtotal : pricePerNight * nights
  const feeFromTotal = rawTotal > computedSubtotal ? rawTotal - computedSubtotal : 0

  const computedServiceFee =
    rawServiceFee > 0 ? rawServiceFee : feeFromTotal > 0 ? feeFromTotal : Math.round(computedSubtotal * 0.1)

  const computedTotal =
    rawTotal > 0 && (rawServiceFee > 0 || rawTotal > computedSubtotal)
      ? rawTotal
      : computedSubtotal + computedServiceFee

  const bookingData = {
    propertyId: q.propertyId || '',
    propertyName: q.propertyName || 'Hotel Property',
    propertyImage: q.propertyImage || '',
    place: q.place || '',
    checkInTime: q.checkInTime || '',
    checkOutTime: q.checkOutTime || '',
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
    password: '',
    isExistingUser: 'no',
    country: POPULAR_COUNTRIES.find(c => c.default)?.value || '',
    phone: '+',
    bookingFor: 'self',
    travelForWork: 'no',
    specialRequests: '',
    arrivalTime: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [passwordValidations, setPasswordValidations] = useState({
    lowercase: true,
    uppercase: true,
    number: true,
    spacialCharacter: true,
    length: true
  })

  const handlePasswordValidation = value => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g
    const spacialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    setPasswordValidations({
      lowercase: !value.match(lowerCaseLetters),
      uppercase: !value.match(upperCaseLetters),
      number: !value.match(numbers),
      spacialCharacter: !value.match(spacialCharacters),
      length: value.length < 8
    })
  }

  // Pre-fill with logged-in user data
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || '',
        lastName: user?.fullName?.split(' ')[1] || user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: user?.contactNo || ''
      }))
    }
  }, [user])

  const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    let registeredSuccessfully = user ? true : false
    let loginSuccessfully = false
    if (!user) {
      await registerUserAPI({
        data: {
          USER_CODE: null,
          ROLE_CODE: null,
          USER_NAME: form.firstName + ' ' + form.lastName,
          EMAIL: form.email,
          PASSWORD: form.password,
          CONTACT_NO: form.phone,
          STATUS: 1,
          USER_TYPE: 4,
          USER: 0
        },
        config: { toast: false, isGuest: true, returnErrorResponse: true }
      })
        .then(response => {
          if (response !== false && response?.code !== -1) {
            registeredSuccessfully = true
            toast.success(
              <Box textAlign='center'>
                <Typography variant='h6' color='green'>
                  Congratulations! You have successfully registered!
                </Typography>
                <Typography variant='subtitle2'>Now You Can Login with Your Email and Password!</Typography>
              </Box>,
              {
                position: 'top-center',
                duration: 10000,
                style: { maxWidth: 500 }
              }
            )
          } else {
            toast.error('User already exists. Please select “Yes” for “Are you an existing user?”', {
              position: 'top-center',
              duration: 5000,
              style: { border: 'solid red 1px' }
            })
            setTimeout(() => {
              setShowLoginModal(true)
              setForm(prev => ({ ...prev, isExistingUser: 'yes' }))
            }, 2000)

            setIsSubmitting(false)
          }
        })
        .catch(err => {
          toast.error(err?.response?.data?.error || 'Registration failed. Please try again.')
          setIsSubmitting(false)
        })
    }
    if (registeredSuccessfully) {
      if (!user) {
        await login({ username: form.email, password: form.password }, error => {
          if (error?.response?.data?.error) {
            toast.error(error.response.data.error, {
              position: 'top-right',
              duration: 5000,
              style: { border: 'solid red 1px' }
            })
          }
          setError('email', {
            type: 'manual',
            message: 'Email or Password is invalid'
          })
        })
      }

      setIsSubmitting(false)

      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(bookingData).map(([k, v]) => [k, String(v)])),
        guestFirstName: form.firstName,
        guestLastName: form.lastName,
        guestEmail: form.email,
        guestCountry: form.country,
        guestPhone: form.phone,
        bookingFor: form.bookingFor,
        travelForWork: form.travelForWork,
        specialRequests: form.specialRequests,
        arrivalTime: form.arrivalTime,
        selectedRooms: JSON.stringify(selectedRooms)
      })
      router.push(`/hotels/booking/payment?${params.toString()}`)
    }
  }

  return (
    <>
      <SeoHead
        title={`Your Details – ${themeConfig.templateName}`}
        description='Complete your hotel booking details.'
      />
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
                  {!user && (
                    <>
                      <Grid item xs={12}>
                        <Card sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2 }}>
                          <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                            Are you an existing user?
                          </Typography>
                          <RadioGroup
                            row
                            value={form.isExistingUser}
                            onChange={e => {
                              handleChange('isExistingUser')(e)
                              if (e.target.value === 'yes') setShowLoginModal(true)
                            }}
                          >
                            <FormControlLabel
                              value='yes'
                              control={<Radio size='small' />}
                              label={<Typography variant='body2'>Yes, I have an account</Typography>}
                            />
                            <FormControlLabel
                              value='no'
                              control={<Radio size='small' />}
                              label={<Typography variant='body2'>No, I am new</Typography>}
                            />
                          </RadioGroup>
                        </Card>
                      </Grid>

                      <LoginModal
                        fullWidth
                        isDirectOpen={showLoginModal}
                        callBack={() => {
                          setShowLoginModal(false)
                        }}
                      />

                      {form.isExistingUser === 'no' && (
                        <>
                          <Grid item xs={12}>
                            <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                              Password*
                            </Typography>
                            <TextField
                              fullWidth
                              size='small'
                              type={showPassword ? 'text' : 'password'}
                              value={form.password}
                              onChange={e => {
                                handleChange('password')(e)
                                handlePasswordValidation(e.target.value)
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton edge='end' size='small' onClick={() => setShowPassword(v => !v)}>
                                      <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            {(() => {
                              const strength = getPasswordStrength(passwordValidations)
                              const hasInput = Object.values(passwordValidations).some(v => !v)
                              if (!hasInput) return null

                              return (
                                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                  <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                                    <Typography variant='caption' color='text.secondary' fontWeight={500}>
                                      Password strength
                                    </Typography>
                                    <Typography variant='caption' fontWeight={600} color={strength.color}>
                                      {strength.label}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      bgcolor: 'action.disabledBackground',
                                      overflow: 'hidden',
                                      mb: 1.5
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        height: '100%',
                                        width: `${strength.score}%`,
                                        borderRadius: 3,
                                        bgcolor: strength.color,
                                        transition: 'width 0.3s ease, background-color 0.3s ease'
                                      }}
                                    />
                                  </Box>
                                  <Grid container spacing={0}>
                                    <Grid item xs={6}>
                                      <PasswordValidationRow
                                        label='Lowercase letter'
                                        passed={!passwordValidations.lowercase}
                                      />
                                      <PasswordValidationRow
                                        label='Uppercase letter'
                                        passed={!passwordValidations.uppercase}
                                      />
                                      <PasswordValidationRow label='Number' passed={!passwordValidations.number} />
                                    </Grid>
                                    <Grid item xs={6}>
                                      <PasswordValidationRow
                                        label='Special character'
                                        passed={!passwordValidations.spacialCharacter}
                                      />
                                      <PasswordValidationRow
                                        label='Minimum 8 characters'
                                        passed={!passwordValidations.length}
                                      />
                                    </Grid>
                                  </Grid>
                                </Box>
                              )
                            })()}
                          </Grid>
                        </>
                      )}
                    </>
                  )}
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
                      Country/Region *
                    </Typography>
                    <Select fullWidth size='small' value={form.country} onChange={handleChange('country')}>
                      {POPULAR_COUNTRIES.map(c => (
                        <MenuItem key={c.value} value={c.value}>
                          {c.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Phone number *
                    </Typography>
                    <TextField
                      fullWidth
                      size='small'
                      placeholder='+12025550123'
                      value={form.phone}
                      onChange={e => {
                        const digits = e.target.value.replace(/^\+/, '').replace(/\D/g, '').slice(0, 15)
                        setForm(prev => ({ ...prev, phone: '+' + digits }))
                      }}
                      inputProps={{ maxLength: 16, inputMode: 'tel' }}
                    />
                    <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                      Include country code, e.g. +1, +44, +92
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
                    {`Your room will be ready for check-in at ${bookingData.checkInTime || '—'}`}
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
              <LoadingButton
                loading={isSubmitting}
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
              </LoadingButton>
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
