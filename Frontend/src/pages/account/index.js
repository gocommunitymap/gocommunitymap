// ** MUI Imports
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  TextField,
  InputLabel,
  Box,
  Typography,
  Chip,
  Divider,
  Alert,
  AlertTitle,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import { useTheme } from '@mui/material/styles'
import Spinner from 'src/@core/components/spinner-with-logo'

import { blue, green, grey, red } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { dateConvert, decUserData } from 'src/@core/utils'
import { changePasswordAPI, getPropertiesByUserAPI, getSavedLinksAPI, getUserAPI } from 'src/configs'
import { getBookingAPI } from 'src/configs/services/api-methods/guest'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import { statusOptions } from 'src/views/pages/admin/user/static-data'
import { NoRecordCard, PropertySmallCard } from 'src/views/components'
import { useDispatch } from 'react-redux'
import { getPropertiesByUser } from 'src/store/guest/property/savedproperties'
import IconifyIcon from 'src/@core/components/icon'
import Link from 'next/link'

const pageTitle = 'Account'

const defaultValues = {
  existingPassword: null,
  newPassword: null,
  confirmPassword: null
}

const PasswordValidationLabel = ({ label, isError }) => {
  return (
    isError && (
      <Typography mr={2} variant='subtitle1' color={red[400]}>
        {label}
      </Typography>
    )
  )
}

const Account = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })
  const dispatch = useDispatch()
  const theme = useTheme()

  const [passwordValidations, setPasswordValidations] = useState({
    lowercase: true,
    uppercase: true,
    number: true,
    spacialCharacter: true,
    length: true,
    matched: true
  })

  const [states, setStates] = useState({
    showExistingPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    isPasswordMatched: false,
    isSubmit: false
  })

  const [savedProperties, setSavedProperties] = useState({ data: [], isLoading: false })
  const [savedPropertiesSearch, setSavedPropertiesSearch] = useState({ data: [], isLoading: false })
  const [bookings, setBookings] = useState({ data: [], isLoading: false })
  const { user, logout } = useAuth()

  const initialized = async () => {
    if (user?.usercode) {
      const response = await getUserAPI({ USER_CODE: user?.usercode })
      if (response?.error) {
        toast.error(response.error.message)

        return
      }

      setStates(response.data[0])

      // ----------------------------- //
      setSavedProperties({ ...savedProperties, isLoading: true })
      getPropertiesByUserAPI().then(response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }

        setSavedProperties({ data: response?.data, isLoading: false })
      })

      // ----------------------------- //
      // ----------------------------- //
      setBookings({ data: [], isLoading: true })
      getBookingAPI().then(response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }
        setBookings({ data: response?.data || [], isLoading: false })
      })

      // ----------------------------- //
      setSavedPropertiesSearch({ ...savedPropertiesSearch, isLoading: true })
      getSavedLinksAPI({ TYPE: 'L' }).then(response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }

        setSavedPropertiesSearch({ data: response?.data, isLoading: false })
      })
    }
  }

  const handlePasswordValidation = event => {
    const value = event.target.value
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g
    var spacialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

    const _passwordValidations = {
      lowercase: !Boolean(value.match(lowerCaseLetters)),

      // uppercase: !Boolean(value.match(upperCaseLetters)),
      number: !Boolean(value.match(numbers)),

      // spacialCharacter: !Boolean(value.match(spacialCharacters)),
      length: value.length < 8,
      matched: !Boolean(watch('confirmPassword') === value)
    }

    if (
      !Boolean(value.match(lowerCaseLetters)) ||
      !Boolean(value.match(numbers)) ||
      value.length < 8 ||
      !Boolean(watch('confirmPassword') === value)
    ) {
      setError('PASSWORD')
    } else {
      clearErrors('PASSWORD')
    }
    setPasswordValidations(_passwordValidations)
  }

  const onSubmit = async data => {
    reset()

    const response = await changePasswordAPI({
      data: { USER_CODE: user.id, PASSWORD: data.existingPassword, NEW_PASSWORD: data.newPassword },
      customMessage: 'Password Successfully Changed!,  Please Re-Login with New Password'
    })

    if (response === false) {
      return
    }
    logout()
  }

  useEffect(() => {
    initialized()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item md={3} xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box display='flex' alignItems='center'>
                <Icon icon='tabler:user-circle' style={{ fontSize: 30 }} />
                Profile
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                mb={5}
                textAlign='center'
                display='flex'
                alignItems='center'
                flexDirection='column'
                justifyItems='center'
              >
                <Box
                  boxShadow={10}
                  bgcolor={blue[100]}
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    textAlign: 'center',
                    width: 100,
                    height: 100
                  }}
                >
                  <img src='/images/avatars/1.png' alt='image' width='100%' height='auto' />
                </Box>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  {states?.user_full_name}
                </Typography>
                <Chip
                  size='small'
                  sx={{
                    width: 80,
                    backgroundColor: blue[100],
                    color: blue[500]
                  }}
                  label={states?.USER_NAME}
                  variant='filled'
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputLabel>
                  <strong>CONTACT:</strong> {states.CONTACT_NO}
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <InputLabel>
                  <strong>EMAIL:</strong> {states.EMAIL}
                </InputLabel>
              </Grid>
              {/* <Grid item xs={12}>
                <InputLabel>
                  <strong>ROLE:</strong> {states.ROLE_NAME}
                </InputLabel>
              </Grid> */}
              <Grid item xs={12}>
                <InputLabel>
                  <strong>STATUS:</strong>
                  <Chip
                    size='small'
                    sx={{
                      marginLeft: 1,
                      width: 80,
                      backgroundColor: states.STATUS === 1 ? green[100] : red[100],
                      color: states.STATUS === 1 ? green[500] : red[500]
                    }}
                    label={statusOptions.find(i => i.value == states.STATUS)?.label}
                    variant='filled'
                  />
                </InputLabel>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={9} xs={12}>
        <Card sx={{ height: '100%' }}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <CardHeader
              title={
                <Box display='flex' alignItems='center'>
                  <Icon icon='tabler:circle-key' style={{ fontSize: 30 }} />
                  Change Password
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='existingPassword'>Existing Password</InputLabel>
                    <Controller
                      name='existingPassword'
                      control={control}
                      rules={{ required: true, minLength: 5 }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          label='Existing Password'
                          value={value}
                          id='existingPassword-input'
                          onChange={onChange}
                          autoComplete='off'
                          type={states.showExistingPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() =>
                                  setStates({ ...states, showExistingPassword: !states.showExistingPassword })
                                }
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon icon={states.showExistingPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          }
                          error={Boolean(errors.existingPassword)}
                          helperText={Boolean(errors.existingPassword) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='newPassword'>New Password</InputLabel>
                    <Controller
                      name='newPassword'
                      control={control}
                      rules={{ required: true, minLength: 5 }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          label='New Password'
                          value={value}
                          id='newPassword-input'
                          onChange={e => {
                            handlePasswordValidation(e)
                            onChange(e)
                          }}
                          type={states.showNewPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() => setStates({ ...states, showNewPassword: !states.showNewPassword })}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon icon={states.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          }
                          error={Boolean(errors.newPassword)}
                          helperText={Boolean(errors.newPassword) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
                    <Controller
                      name='confirmPassword'
                      control={control}
                      rules={{ required: true, minLength: 5 }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          label='Confirm Password'
                          value={value}
                          id='confirmPassword-input'
                          onChange={e => {
                            onChange(e)
                            setPasswordValidations({
                              ...passwordValidations,
                              matched: !Boolean(watch('newPassword') === e.target.value)
                            })
                            if (!Boolean(watch('newPassword') === e.target.value)) {
                              setError('PASSWORD')
                            } else {
                              clearErrors('PASSWORD')
                            }
                          }}
                          type={states.showConfirmPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() =>
                                  setStates({
                                    ...states,
                                    showConfirmPassword: !states.showConfirmPassword
                                  })
                                }
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon icon={states.showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          }
                          error={Boolean(errors.confirmPassword)}
                          helperText={Boolean(errors.confirmPassword) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} mt={5}>
                  {!passwordValidations.lowercase &&
                  !passwordValidations.number &&
                  !passwordValidations.matched &&
                  !passwordValidations.length ? (
                    <Alert
                      icon={<Icon icon='tabler:thumb-up-filled' style={{ fontSize: 30 }} />}
                      variant='filled'
                      color='success'
                      sx={{
                        mb: 4
                      }}
                    >
                      <Typography variant='h5' color='white'>
                        Good!
                      </Typography>
                    </Alert>
                  ) : (
                    <Alert
                      icon={<Icon icon='tabler:info-triangle-filled' />}
                      variant='outlined'
                      color='warning'
                      sx={{
                        mb: 4
                      }}
                    >
                      New Password must contain the following:
                      <PasswordValidationLabel label='A lowercase letter' isError={passwordValidations.lowercase} />
                      {/* <PasswordValidationLabel label='A capital (uppercase)' isError={passwordValidations.uppercase} /> */}
                      <PasswordValidationLabel label='A number' isError={passwordValidations.number} />
                      {/* <PasswordValidationLabel
                        label='A Spacial character'
                        isError={passwordValidations.spacialCharacter}
                      /> */}
                      <PasswordValidationLabel label='Minimum 8 characters' isError={passwordValidations.length} />
                      <PasswordValidationLabel
                        label='A new password and the confirm password match'
                        isError={passwordValidations.matched}
                      />
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} textAlign='end' mt={5}>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={
                      passwordValidations.lowercase ||
                      passwordValidations.number ||
                      passwordValidations.matched ||
                      passwordValidations.length
                    }
                  >
                    <Icon icon='tabler:device-floppy' style={{ paddingRight: 5, fontSize: 25 }} /> Change Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
      {/* My Bookings */}
      <Grid item xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box display='flex' alignItems='center' gap={1}>
                <Icon icon='tabler:building-hotel' style={{ fontSize: 24 }} />
                My Bookings
              </Box>
            }
            subheader={`${bookings.data.length} total booking${bookings.data.length !== 1 ? 's' : ''}`}
            action={
              <Button
                size='small'
                variant='outlined'
                startIcon={<Icon icon='tabler:building-hotel' />}
                onClick={() => {}}
                component={Link}
                href='/hotels'
              >
                Find Hotels
              </Button>
            }
          />
          <CardContent>
            {bookings.isLoading ? (
              <Spinner />
            ) : bookings.data.length > 0 ? (
              <>
                <Grid container spacing={2} mb={3}>
                  {bookings.data.slice(0, 3).map((booking, index) => {
                    const isCancelled = (booking.STATUS || '').toUpperCase() === 'CANCELLED'
                    const isPending = (booking.STATUS || '').toUpperCase() === 'PENDING'
                    const statusColor = isCancelled ? red[500] : isPending ? '#f59e0b' : green[600]
                    const statusBg = isCancelled ? red[50] : isPending ? '#fff8e1' : green[50]
                    const statusLabel = isCancelled ? 'Cancelled' : isPending ? 'Pending' : 'Confirmed'

                    return (
                      <Grid item xs={12} md={4} key={booking.BOOKING_NO || index}>
                        <Box
                          sx={{
                            border: `1px solid ${statusBg}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 1
                          }}
                        >
                          <Box
                            sx={{
                              background: isCancelled
                                ? 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)'
                                : isPending
                                ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                                : 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                              px: 2,
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Typography variant='subtitle2' fontWeight={700} color='#fff' noWrap>
                              {booking.PROPERTY_NAME || 'Hotel Booking'}
                            </Typography>
                            <Chip
                              label={statusLabel.toUpperCase()}
                              size='small'
                              sx={{ backgroundColor: '#fff', color: statusColor, fontWeight: 800, fontSize: '0.65rem' }}
                            />
                          </Box>
                          <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant='caption' color='text.secondary' display='block'>
                              Booking Ref: <strong style={{ color: statusColor }}>#{booking.BOOKING_NO}</strong>
                            </Typography>
                            <Typography variant='caption' color='text.secondary' display='block'>
                              Check-in: <strong>{dateConvert(booking.CHECK_IN) || '—'}</strong>
                            </Typography>
                            <Typography variant='caption' color='text.secondary' display='block'>
                              Check-out: <strong>{dateConvert(booking.CHECK_OUT) || '—'}</strong>
                            </Typography>
                            <Typography variant='caption' color='text.secondary' display='block'>
                              Total:{' '}
                              <strong style={{ color: statusColor }}>
                                $ {Number(booking.TOTAL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
                <Link
                  href='/account/bookings'
                  style={{ display: 'flex', justifyContent: 'center', color: theme.palette.primary.dark }}
                >
                  See all bookings
                </Link>
              </>
            ) : (
              <NoRecordCard
                title='No bookings yet'
                subtitle='When you book a hotel, your reservations will appear here.'
                variant='outlined'
                borderLess={true}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box display='flex' alignItems='center'>
                Saved listings
              </Box>
            }
          />
          <CardContent>
            {savedProperties?.data?.length > 0 ? (
              <>
                <Grid container spacing={3} mb={5}>
                  {savedProperties?.data
                    ?.filter((row, index) => index < 3)
                    ?.map((row, index) => (
                      <Grid item md={4} xs={12} key={row.PROPERTY_ID}>
                        <PropertySmallCard data={row} />
                      </Grid>
                    ))}
                </Grid>
                <Link
                  href='/saved'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: theme.palette.primary.dark
                  }}
                >
                  See all
                </Link>
              </>
            ) : (
              <NoRecordCard
                title='No listings saved'
                subtitle='Hit the ❤︎︎ to save your favorite properties and find them faster next time.'
                variant='outlined'
                borderLess={true}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item md={3} xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box display='flex' alignItems='center'>
                Saved searches
              </Box>
            }
          />
          <CardContent>
            {savedPropertiesSearch?.data?.length > 0 ? (
              <>
                {savedPropertiesSearch?.data
                  ?.filter((row, index) => index < 5)
                  ?.map((row, index) => (
                    <Link key={row.PROPERTY_ID} href={row.LINK}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant='h6'>{row.DESCRIPTION}</Typography>
                        </Grid>
                        <Grid item xs={12} textAlign='end'>
                          <Typography variant='subtitle1'>
                            <IconifyIcon icon='tabler:arrow-right' />
                          </Typography>
                          <Divider />
                        </Grid>
                      </Grid>
                    </Link>
                  ))}
                <Link
                  href='/savedsearch'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: theme.palette.primary.dark
                  }}
                >
                  See all
                </Link>
              </>
            ) : savedPropertiesSearch.isLoading ? (
              <Spinner />
            ) : (
              <NoRecordCard
                title='No searches saved'
                subtitle='Save your location, budget and filters so you can just tap and go.'
                variant='outlined'
                borderLess={true}
              />
            )}
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default Account
