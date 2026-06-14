import {
  Avatar,
  Box,
  Card,
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
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import { defaultPageFont, arrivalTimeOptions, POPULAR_COUNTRIES } from 'src/@core/utils'
import SeoHead from 'src/components/SeoHead'
import BookingStepperHeader from 'src/views/pages/hotels/booking/BookingStepperHeader'
import BookingSummaryCard from 'src/views/pages/hotels/booking/BookingSummaryCard'
import { registerUserAPI } from 'src/configs'
import LoginModal from 'src/layouts/components/horizontal/LoginModal'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import themeConfig from 'src/configs/themeConfig'

const getPasswordStrength = validations => {
  const passed = Object.values(validations).filter(v => !v).length
  if (passed === 5) return { score: 100, label: 'Strong', color: 'primary.main' }
  if (passed === 4) return { score: 80, label: 'Good', color: 'info.main' }
  if (passed === 3) return { score: 60, label: 'Fair', color: 'warning.main' }
  if (passed >= 1) return { score: 30, label: 'Weak', color: 'error.main' }

  return { score: 0, label: '', color: 'divider' }
}

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

const parseSelectedRooms = value => {
  try {
    const parsed = JSON.parse(value || '[]')

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const RentalBookingDetails = () => {
  const router = useRouter()
  const { user, login } = useAuth()
  const q = router.query

  const selectedRooms = useMemo(() => parseSelectedRooms(q.selectedRooms), [q.selectedRooms])

  const pricePerNight = Number(q.pricePerNight) || 0
  const nights = Number(q.nights) || 1
  const rawSubtotal = Number(q.subtotal) || 0

  const roomsSubtotal =
    selectedRooms.length > 0
      ? selectedRooms.reduce((sum, s) => sum + (Number(s.price) || 0) * (Number(s.qty) || 1) * nights, 0)
      : 0
  const computedSubtotal = roomsSubtotal > 0 ? roomsSubtotal : rawSubtotal > 0 ? rawSubtotal : pricePerNight * nights
  const computedServiceFee = Number(q.serviceFee) > 0 ? Number(q.serviceFee) : Math.round(computedSubtotal * 0.1)
  const computedTotal = Number(q.total) > 0 ? Number(q.total) : computedSubtotal + computedServiceFee

  const bookingData = {
    propertyId: q.propertyId || '',
    propertyName: q.propertyName || 'Rental Property',
    propertyImage: q.propertyImage || '',
    place: q.place || '',
    checkInTime: q.checkInTime || '',
    checkOutTime: q.checkOutTime || '',
    pricePerNight,
    checkIn: q.checkIn || '',
    checkOut: q.checkOut || '',
    nights,
    adults: Number(q.adults) || 1,
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

  useEffect(() => {
    if (!user) return
    setForm(prev => ({
      ...prev,
      firstName: user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || '',
      lastName: user?.fullName?.split(' ')[1] || user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: user?.contactNo || ''
    }))
  }, [user])

  const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handlePasswordValidation = value => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g
    const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~]/

    setPasswordValidations({
      lowercase: !value.match(lowerCaseLetters),
      uppercase: !value.match(upperCaseLetters),
      number: !value.match(numbers),
      spacialCharacter: !value.match(specialCharacters),
      length: value.length < 8
    })
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) return

    setIsSubmitting(true)
    let canProceed = Boolean(user)

    try {
      if (!user && form.isExistingUser === 'no') {
        const response = await registerUserAPI({
          data: {
            USER_CODE: null,
            ROLE_CODE: null,
            USER_NAME: `${form.firstName} ${form.lastName}`,
            EMAIL: form.email,
            PASSWORD: form.password,
            CONTACT_NO: form.phone,
            STATUS: 1,
            USER_TYPE: 4,
            USER: 0
          },
          config: { toast: false, isGuest: true, returnErrorResponse: true }
        })

        if (response !== false && response?.code !== -1) {
          canProceed = true
          toast.success('Registered successfully. Continuing with your booking...')
        } else {
          toast.error('User already exists. Please choose existing user and login.')
          setForm(prev => ({ ...prev, isExistingUser: 'yes' }))
          setShowLoginModal(true)
          setIsSubmitting(false)

          return
        }
      }

      if (!user && form.isExistingUser === 'yes') {
        toast('Please login to continue your booking.')
        setShowLoginModal(true)
        setIsSubmitting(false)

        return
      }

      if (!user && canProceed) {
        await login({ username: form.email, password: form.password }, error => {
          if (error?.response?.data?.error) {
            toast.error(error.response.data.error)
          }
        })
      }

      if (!canProceed && !user) {
        setIsSubmitting(false)

        return
      }

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
        selectedRooms: JSON.stringify(selectedRooms),
        listingTypeId: '2'
      })

      router.push(`/rentals/booking/payment?${params.toString()}`)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Unable to continue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SeoHead
        title={`Your Details – ${themeConfig.templateName}`}
        description='Complete your rental booking details.'
      />
      <BookingStepperHeader currentStep={2} />

      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 }, pt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
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
                    Change selection
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='caption' color='text.secondary'>
                      Dates
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                      {bookingData.checkIn && bookingData.checkOut
                        ? `${bookingData.checkIn} - ${bookingData.checkOut}`
                        : 'Select dates'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption' color='text.secondary'>
                      Duration
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                      {bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} sx={{ mb: 0.5 }}>
                  Enter your details
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 2.5, display: 'block' }}>
                  Almost done. Please fill all required fields.
                </Typography>

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
                      value={form.lastName}
                      onChange={handleChange('lastName')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Email Address*
                    </Typography>
                    <TextField
                      fullWidth
                      size='small'
                      type='email'
                      placeholder='john.doe@example.com'
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                      Country/Region*
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
                      Phone Number*
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
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
                    Who are you booking for?
                  </Typography>
                  <RadioGroup value={form.bookingFor} onChange={handleChange('bookingFor')}>
                    <FormControlLabel value='self' control={<Radio size='small' />} label='I am the main guest' />
                    <FormControlLabel value='other' control={<Radio size='small' />} label='Booking for someone else' />
                  </RadioGroup>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
                    Are you travelling for work?
                  </Typography>
                  <RadioGroup row value={form.travelForWork} onChange={handleChange('travelForWork')}>
                    <FormControlLabel value='yes' control={<Radio size='small' />} label='Yes' />
                    <FormControlLabel value='no' control={<Radio size='small' />} label='No' />
                  </RadioGroup>
                </Box>
              </Card>

              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} sx={{ mb: 0.5 }}>
                  Special requests
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
                  Requests are optional and based on availability.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size='small'
                  value={form.specialRequests}
                  onChange={handleChange('specialRequests')}
                  placeholder='e.g. Quiet unit, early check-in...'
                />
              </Card>

              <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} sx={{ mb: 0.5 }}>
                  Your arrival time
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
                  Add your estimated arrival time (optional)
                </Typography>
                <Select
                  size='small'
                  fullWidth
                  displayEmpty
                  value={form.arrivalTime}
                  onChange={handleChange('arrivalTime')}
                  renderValue={v => v || 'Please select'}
                >
                  <MenuItem value=''>Please select</MenuItem>
                  {arrivalTimeOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Card>

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
                Next: Payment
              </LoadingButton>
            </Grid>

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

RentalBookingDetails.guestGuard = true
RentalBookingDetails.getLayout = page => page

export default RentalBookingDetails
