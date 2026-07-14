// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'
import Head from 'next/head'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import CompanyLogo from 'src/@core/components/company-logo'
import { useForm, Controller } from 'react-hook-form'
import { Card, FormHelperText, FormLabel, Grid } from '@mui/material'
import { green, grey, red } from '@mui/material/colors'
import { registerUserAPI } from 'src/configs'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  color: 'secondary',
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

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
  const { passwordsMatch: _, ...strengthValidations } = validations
  const passed = Object.values(strengthValidations).filter(v => !v).length
  if (passed === 5) return { score: 100, label: 'Strong', color: 'primary.main' }
  if (passed === 4) return { score: 80, label: 'Good', color: 'info.main' }
  if (passed === 3) return { score: 60, label: 'Fair', color: 'warning.main' }
  if (passed >= 1) return { score: 30, label: 'Weak', color: 'error.main' }

  return { score: 0, label: '', color: 'divider' }
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const defaultValues = {
  USER_CODE: null,
  ROLE_CODE: 2,
  USER_NAME: '',
  EMAIL: '',
  PASSWORD: '',
  CONFIRM_PASSWORD: '',
  CONTACT_NO: '+',
  STATUS: true,
  CREATED_BY: 0
}

const Register = () => {
  // ** States
  const [states, setStates] = useState({
    isSubmit: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordValidations, setPasswordValidations] = useState({
    lowercase: true,
    uppercase: true,
    number: true,
    spacialCharacter: true,
    length: true,
    passwordsMatch: true
  })

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur'
  })

  const onSubmit = data => {
    setStates({ ...states, isSubmit: true })
    registerUserAPI({
      data: {
        USER_CODE: data.USER_CODE,
        ROLE_CODE: null,
        USER_NAME: data.USER_NAME,
        EMAIL: data.EMAIL,
        PASSWORD: data.PASSWORD,
        CONTACT_NO: data.CONTACT_NO,
        STATUS: 1,
        USER: 0
      },
      config: { toast: false, isGuest: true, returnErrorResponse: false }
    }).then(response => {
      if (response !== false) {
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
        reset()
        setShowPassword(false)
        setShowConfirmPassword(false)
        setPasswordValidations({
          lowercase: true,
          uppercase: true,
          number: true,
          spacialCharacter: true,
          length: true,
          passwordsMatch: true
        })
      }

      setStates({ ...states, isSubmit: false })
    })
  }

  const handlePasswordValidation = event => {
    const value = event.target.value
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g
    var spacialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

    const confirmValue = watch('CONFIRM_PASSWORD')

    const _passwordValidations = {
      lowercase: !Boolean(value.match(lowerCaseLetters)),
      uppercase: !Boolean(value.match(upperCaseLetters)),
      number: !Boolean(value.match(numbers)),
      spacialCharacter: !Boolean(value.match(spacialCharacters)),
      length: value.length < 8,
      passwordsMatch: !confirmValue || value !== confirmValue
    }
    if (
      !Boolean(value.match(lowerCaseLetters)) ||
      !Boolean(value.match(upperCaseLetters)) ||
      !Boolean(value.match(numbers)) ||
      !Boolean(value.match(spacialCharacters)) ||
      value.length < 8
    ) {
      setError('PASSWORD')
    } else {
      clearErrors('PASSWORD')
    }
    setPasswordValidations(_passwordValidations)
  }

  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <Box className='content-right'>
        {!hidden ? (
          <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <RegisterIllustrationWrapper>
              <RegisterIllustration alt='register-illustration' src={`/images/login-background.png`} />
            </RegisterIllustrationWrapper>
            <FooterIllustrationsV2 image={`/images/pages/auth-v2-register-mask-${theme.palette.mode}.png`} />
          </Box>
        ) : null}
        <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
          <Box
            sx={{
              px: 7,
              pt: { xs: 0, md: 10 },
              height: { xs: 'auto', sm: '100%' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <BoxWrapper>
              {hidden && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CompanyLogo width='40' />
                  <Typography
                    variant='h6'
                    sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}
                  >
                    {themeConfig.templateName}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mb: 6 }}>
                <TypographyStyled variant='h5' sx={{ m: 0, p: 0, lineHeight: 1 }}>
                  <p style={{ padding: 0, margin: 0, lineHeight: 1 }}>Registration</p>
                  <p style={{ padding: 0, margin: '5px 0 0 0', lineHeight: 1, fontWeight: 'normal', fontSize: 14 }}>
                    Register to save properties and much more
                  </p>
                </TypographyStyled>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='USER_NAME'
                          control={control}
                          rules={{
                            required: true,
                            minLength: 5,
                            maxLength: 30,
                            pattern: {
                              value: /^[a-zA-Z ]*$/
                            }
                          }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              size='small'
                              inputProps={{ maxLength: 30 }}
                              label='NAME'
                              onChange={onChange}
                              placeholder='Minimum 5 & Maximum 30'
                              error={Boolean(errors.USER_NAME)}
                              helperText={Boolean(errors.USER_NAME) && 'Enter Name (Minimum 5 & Maximum 30) A to Z'}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='EMAIL'
                          control={control}
                          rules={{
                            required: true,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid Email Address'
                            }
                          }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              size='small'
                              type='email'
                              value={value}
                              inputProps={{ maxLength: 50 }}
                              label='EMAIL ADDRESS'
                              onChange={onChange}
                              placeholder='EMAIL ADDRESS'
                              error={Boolean(errors.EMAIL)}
                              helperText={Boolean(errors.EMAIL) && 'Enter Valid Email Address'}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='CONTACT_NO'
                          control={control}
                          rules={{
                            required: true,
                            minLength: 7,
                            maxLength: 16,
                            pattern: { value: /^\+\d+$/, message: 'Must start with + followed by numbers' }
                          }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              size='small'
                              value={value}
                              label='CONTACT NO'
                              onChange={e => {
                                const raw = e.target.value

                                // Always keep leading '+', strip any non-digit after it, max 15 digits after '+'
                                const digits = raw.replace(/^\+/, '').replace(/\D/g, '').slice(0, 15)
                                onChange('+' + digits)
                              }}
                              placeholder='+12025550123'
                              inputProps={{ maxLength: 16, inputMode: 'tel' }}
                              error={Boolean(errors.CONTACT_NO)}
                              helperText={'Enter a valid contact number'}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor='auth-login-v2-password'>PASSWORD</InputLabel>
                        <Controller
                          name='PASSWORD'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <OutlinedInput
                                label='PASSWORD'
                                value={value}
                                onChange={e => {
                                  onChange(e)
                                  handlePasswordValidation(e)
                                }}
                                id='auth-login-v2-password'
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                  <InputAdornment position='end'>
                                    <IconButton
                                      edge='end'
                                      onMouseDown={e => e.preventDefault()}
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                                    </IconButton>
                                  </InputAdornment>
                                }
                                error={Boolean(errors.PASSWORD)}
                                helperText={Boolean(errors.PASSWORD) && 'Required'}
                              />
                            </>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor='auth-register-confirm-password'>CONFIRM PASSWORD</InputLabel>
                        <Controller
                          name='CONFIRM_PASSWORD'
                          control={control}
                          rules={{
                            required: true,
                            validate: value => value === watch('PASSWORD') || 'Passwords do not match'
                          }}
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              label='CONFIRM PASSWORD'
                              value={value}
                              onChange={e => {
                                onChange(e)
                                setPasswordValidations(prev => ({
                                  ...prev,
                                  passwordsMatch: !e.target.value || e.target.value !== watch('PASSWORD')
                                }))
                              }}
                              id='auth-register-confirm-password'
                              type={showConfirmPassword ? 'text' : 'password'}
                              endAdornment={
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    <Icon icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                                  </IconButton>
                                </InputAdornment>
                              }
                              error={Boolean(errors.CONFIRM_PASSWORD)}
                            />
                          )}
                        />
                        {errors.CONFIRM_PASSWORD && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.CONFIRM_PASSWORD.message || 'Confirm password is required'}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      {(() => {
                        const strength = getPasswordStrength(passwordValidations)
                        const hasInput = Object.values(passwordValidations).some(v => !v)

                        return hasInput ? (
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: 'background.paper'
                            }}
                          >
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
                                mb: 2
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
                                <PasswordValidationRow
                                  label='Passwords match'
                                  passed={!passwordValidations.passwordsMatch}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        ) : null
                      })()}
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingButton
                        loading={states.isSubmit}
                        fullWidth
                        size='large'
                        type='submit'
                        variant='contained'
                        sx={{ my: 3 }}
                      >
                        Sign up
                      </LoadingButton>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
                        <Typography
                          href='/login'
                          component={Link}
                          sx={{ color: 'primary.main', textDecoration: 'none' }}
                        >
                          Sign in instead
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </form>
            </BoxWrapper>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
