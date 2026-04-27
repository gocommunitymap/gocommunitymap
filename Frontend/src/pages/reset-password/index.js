// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import Head from 'next/head'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { clientConfig } from 'src/configs/clientConfig'
import CompanyLogo from 'src/@core/components/company-logo'
import { getResetRequestAPI, resetPasswordAPI } from 'src/configs'
import { useRouter } from 'next/router'
import Error401 from '../401'
import Error404 from '../404'
import { Alert, Grid } from '@mui/material'
import { red } from '@mui/material/colors'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '1rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const PasswordValidationLabel = ({ label, isError }) => {
  return (
    isError && (
      <Typography fontSize={12} mr={2} variant='subtitle1' color={red[400]}>
        *{label}
      </Typography>
    )
  )
}

const defaultValues = {
  newPassword: null,
  confirmPassword: null
}

const ResetPassword = () => {
  // ** States
  const { query, replace } = useRouter()
  const [loading, setLoading] = useState(false)

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

  const [values, setValues] = useState({
    key: null,
    email: null,
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false
  })

  // ** Hook
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

  const initialize = async () => {
    const key = query.a
    await getResetRequestAPI({ key }).then(response => {
      if (response?.data?.email) {
        setValues({ ...values, email: response.data.email })
      }
    })
  }
  useEffect(() => {
    if (query?.a) {
      initialize()
    }
  }, [query])

  const onSubmit = async data => {
    setLoading(true)

    await resetPasswordAPI({
      data: { key: query.a, Password: data.newPassword }
    })
      .then(response => {
        if (response === false) {
          return
        }
        reset()
        setLoading(false)
        toast.success('Password Successfully Changed!', { position: 'top-center' })
        setTimeout(() => {
          replace('/login')
        }, 2000)
      })
      .catch(error => {
        toast.error(error, { position: 'top-center' })
      })
  }

  return values.email ? (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <Box className='content-center'>
        <AuthIllustrationV1Wrapper>
          <Card>
            <CardContent sx={{ p: theme => `${theme.spacing(5, 8, 3)} !important` }}>
              <Box sx={{ textAlign: 'center' }}>
                <CompanyLogo width='60' />
                {/* <Typography sx={{ color: '#7367f0', fontWeight: 500, fontSize: '12' }}>
                {themeConfig.templateName}
              </Typography> */}
              </Box>
              <Box textAlign='center' mb={2}>
                <Typography variant='body1'>Reset Password for</Typography>
                <Typography variant='body2'>{values.email}</Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12} sm={4} mb={2}>
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
                      icon={<Icon fontSize={20} icon='tabler:info-triangle-filled' />}
                      variant='outlined'
                      color='warning'
                      sx={{
                        mb: 4,
                        fontSize: 12
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
                <Grid item xs={12} textAlign='center' my={5}>
                  <LoadingButton
                    loading={loading}
                    type='submit'
                    variant='contained'
                    disabled={
                      passwordValidations.lowercase ||
                      passwordValidations.number ||
                      passwordValidations.matched ||
                      passwordValidations.length
                    }
                  >
                    Change Password
                  </LoadingButton>
                </Grid>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                >
                  <LinkStyled href='/pages/login'>
                    <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                    <span>Back to login</span>
                  </LinkStyled>
                </Typography>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationV1Wrapper>
      </Box>
    </>
  ) : (
    <Error401 />
  )
}
ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword
