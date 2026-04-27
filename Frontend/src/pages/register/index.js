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
import 'cleave.js/dist/addons/cleave-phone.us'

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
import { Badge, Card, FormHelperText, FormLabel, Grid, Radio, RadioGroup, Slide } from '@mui/material'
import Cleave from 'cleave.js/react'
import { green, grey, red } from '@mui/material/colors'
import { updateUser } from 'src/store'
import { registerUserAPI, updateUserAPI } from 'src/configs'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'

const userTypeOptions = [
  { value: 2, label: 'Landlord', icon: 'mdi:home' },
  { value: 3, label: 'Agent', icon: 'mdi:face-agent' }
]

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

function MaskedTextField(props) {
  const { inputRef, ...other } = props

  //+44 00 0000 0000
  return <Cleave {...other} ref={inputRef} options={{ numericOnly: true, delimiters: [' ', ' '], blocks: [2, 4, 4] }} />
}

const PasswordValidationLabel = ({ label, isError }) => {
  return (
    <Box
      bgcolor={isError ? 'error.light' : 'secondary.main'}
      color={isError ? 'white' : 'secondary.light'}
      borderRadius={1}
      display='flex'
      justifyContent='center'
      alignItems='center'
      mt={2}
      p={1}
    >
      <Typography mr={2} variant='caption' color={isError ? 'white' : 'secondary.light'}>
        {label}
      </Typography>
      <Icon fontSize={12} icon={isError ? 'tabler:x' : 'tabler:check'} />
    </Box>
  )
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const defaultValues = {
  USER_TYPE: null,
  USER_CODE: null,
  ROLE_CODE: 2,
  USER_NAME: '',
  EMAIL: '',
  PASSWORD: '',
  CONTACT_NO: '',
  STATUS: true,
  CREATED_BY: 0
}

const Register = () => {
  // ** States
  const [states, setStates] = useState({
    isSubmit: false
  })
  const [showPassword, setShowPassword] = useState(false)

  const [passwordValidations, setPasswordValidations] = useState({
    lowercase: true,
    uppercase: true,
    number: true,
    spacialCharacter: true,
    length: true
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
      USER_CODE: data.USER_CODE,
      ROLE_CODE: null,
      USER_NAME: data.USER_NAME,
      EMAIL: data.EMAIL,
      PASSWORD: data.PASSWORD,
      CONTACT_NO: data.CONTACT_NO,
      STATUS: 1,
      USER_TYPE: data.USER_TYPE,
      USER: 0
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
        setPasswordValidations({
          lowercase: true,
          uppercase: true,
          number: true,
          spacialCharacter: true,
          length: true
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

    const _passwordValidations = {
      lowercase: !Boolean(value.match(lowerCaseLetters)),
      uppercase: !Boolean(value.match(upperCaseLetters)),
      number: !Boolean(value.match(numbers)),
      spacialCharacter: !Boolean(value.match(spacialCharacters)),
      length: value.length < 8
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
              p: 5,
              height: '100%',
              display: 'flex',
              alignItems: 'top',
              justifyContent: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <BoxWrapper>
              <Box
                sx={{
                  top: 30,
                  left: { xs: 0, md: 40 },
                  display: 'flex',
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CompanyLogo width='60' />
                {/* <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography> */}
              </Box>
              <Box sx={{ mb: 6 }}>
                <TypographyStyled variant='h5' pt={5}>
                  Registration
                </TypographyStyled>
                <TypographyStyled variant='body2'>Register to save properties and much more</TypographyStyled>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={errors.USER_TYPE} sx={{ width: '100%', textAlign: 'center' }}>
                      <RadioGroup row>
                        <Grid container>
                          {userTypeOptions.map(item => (
                            <Grid
                              key={item.value}
                              item
                              xs={Boolean(watch('USER_TYPE')) ? 2 : 12}
                              display='flex'
                              justifyContent='center'
                            >
                              <Controller
                                name='USER_TYPE'
                                control={control}
                                rules={{
                                  required: true
                                }}
                                render={({ field: { value, onChange } }) => (
                                  <label style={{ cursor: 'pointer' }}>
                                    <Badge
                                      badgeContent={
                                        item.value == value ? <IconifyIcon fontSize={9} icon='mdi:check' /> : null
                                      }
                                      color='info'
                                    >
                                      <Card
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          '&:hover': { backgroundColor: 'primary.light' },
                                          backgroundColor: item.value == value ? 'primary.main' : 'inherit',
                                          color: item.value == value ? 'common.white' : 'inherit',
                                          width: Boolean(watch('USER_TYPE')) ? 50 : 250,
                                          height: Boolean(watch('USER_TYPE')) ? 50 : 250,
                                          mx: 1,
                                          mb: 3
                                        }}
                                      >
                                        <Box sx={{ textAlign: 'center' }}>
                                          <IconifyIcon
                                            fontSize={Boolean(watch('USER_TYPE')) ? 16 : 70}
                                            icon={item.icon}
                                          />
                                          <Typography
                                            variant={Boolean(watch('USER_TYPE')) ? 'body2' : 'h6'}
                                            sx={{
                                              fontSize: Boolean(watch('USER_TYPE')) ? 9 : 18,
                                              color: item.value == value ? 'common.white' : 'inherit'
                                            }}
                                          >
                                            {item.label}
                                          </Typography>
                                        </Box>
                                        <FormControlLabel
                                          sx={{ p: 0, m: 0 }}
                                          onChange={onChange}
                                          value={item.value}
                                          control={
                                            <Radio
                                              sx={{ display: 'none' }}
                                              id={`user-type-${item.value}`}
                                              checked={item.value == value}
                                            />
                                          }
                                        />
                                      </Card>
                                    </Badge>
                                  </label>
                                )}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                      <FormLabel sx={{ fontSize: 12 }}>{errors.USER_TYPE && 'Please Select'}</FormLabel>
                    </FormControl>
                  </Grid>
                </Grid>
                {Boolean(watch('USER_TYPE')) && (
                  <Slide direction='up' in={Boolean(watch('USER_TYPE'))} mountOnEnter unmountOnExit>
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
                              rules={{ required: true, minLength: 10, maxLength: 15 }}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  {/* <Cleave placeholder='+44 00 0000 0000' options={{ phone: true, phoneRegionCode: 'US' }} /> */}
                                  <InputLabel htmlFor='contact_no'>CONTACT NO</InputLabel>

                                  <OutlinedInput
                                    size='small'
                                    value={value}
                                    inputProps={{ maxLength: 15 }}
                                    label='CONTACT No'
                                    onChange={onChange}
                                    placeholder='00 0000 0000'
                                    error={Boolean(errors.CONTACT_NO)}
                                    startAdornment={
                                      <InputAdornment position='start'>
                                        <Typography>+44</Typography>
                                      </InputAdornment>
                                    }
                                    inputComponent={MaskedTextField}
                                  />
                                  {errors.CONTACT_NO && (
                                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                                      Enter Valid Contact No
                                    </FormHelperText>
                                  )}
                                </>
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

                                  <Box
                                    p={3}
                                    borderRadius={1}
                                    mt={2}
                                    border='solid'
                                    borderColor={
                                      passwordValidations.length ||
                                      passwordValidations.lowercase ||
                                      passwordValidations.uppercase ||
                                      passwordValidations.spacialCharacter ||
                                      passwordValidations.number
                                        ? 'error.main'
                                        : 'secondary.main'
                                    }
                                    bgcolor={
                                      !passwordValidations.length &&
                                      !passwordValidations.lowercase &&
                                      !passwordValidations.uppercase &&
                                      !passwordValidations.spacialCharacter &&
                                      !passwordValidations.number &&
                                      'secondary.light'
                                    }
                                  >
                                    <Typography variant='subtitle1'>Password must contain the following:</Typography>
                                    <PasswordValidationLabel
                                      label='A lowercase letter'
                                      isError={passwordValidations.lowercase}
                                    />
                                    <PasswordValidationLabel
                                      label='A capital (uppercase)'
                                      isError={passwordValidations.uppercase}
                                    />
                                    <PasswordValidationLabel label='A number' isError={passwordValidations.number} />
                                    <PasswordValidationLabel
                                      label='A Spacial character'
                                      isError={passwordValidations.spacialCharacter}
                                    />
                                    <PasswordValidationLabel
                                      label='Minimum 8 characters'
                                      isError={passwordValidations.length}
                                    />
                                  </Box>
                                </>
                              )}
                            />
                          </FormControl>
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
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
                          >
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
                  </Slide>
                )}
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
