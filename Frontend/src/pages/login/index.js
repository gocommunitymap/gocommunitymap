// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import Head from 'next/head'

// ** MUI Components
import Alert from '@mui/material/Alert'
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
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { LoadingButton } from '@mui/lab'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'
import CompanyLogo from 'src/@core/components/company-logo'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Fade, Grid, Grow, Slide, Zoom } from '@mui/material'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
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
  color: theme.palette.secondary.main,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'Admin@123',
  email: 'admin@tst.com'
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    setIsLoading(true)
    const { email, password } = data
    auth
      .login({ username: email, password, rememberMe }, error => {
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
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <Box className='content-right'>
        {!hidden ? (
          <Box
            sx={{
              maxHeight: '85vh',
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'flex-start',
              p: 10,
              justifyContent: 'left'
            }}
          >
            <video
              autoPlay={true}
              muted={true}
              loop={true}
              style={{
                opacity: 0.1,
                zIndex: -2,
                position: 'fixed',
                right: 0,
                bottom: 0,
                minWidth: '100%',
                minHeight: '100%'
              }}
            >
              <source src='/images/background.mp4' type='video/mp4'></source>
            </video>
            {/* <LoginIllustrationWrapper>
            <LoginIllustration alt='login-illustration' src={`/images/login-background.png`} />
          </LoginIllustrationWrapper> */}
            <Box display='flex' alignItems='center' justifyContent='center' width='100%' height='100%'>
              <Grid container textAlign='center'>
                <Grid item xs={12}>
                  <Zoom in={true} style={{ transitionDelay: '1000ms' }}>
                    <div>
                      <CompanyLogo width='300' />
                    </div>
                  </Zoom>
                </Grid>
                <Grid item xs={12}>
                  <Fade direction='up' in={true} style={{ transitionDelay: '1500ms' }} mountOnEnter unmountOnExit>
                    <div>
                      <Typography variant='h5'>Go Community Map Slogan</Typography>
                    </div>
                  </Fade>
                </Grid>
              </Grid>
            </Box>
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
              <Box textAlign='center'>{hidden && <CompanyLogo width='60' />}</Box>
              <Box mb={5}>
                <Box textAlign='center' mb={10}>
                  <Link href='/' style={{ textDecoration: 'none' }}>
                    <TypographyStyled
                      variant='h5'
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon fontSize={30} icon='tabler:arrow-left' />
                      Goto Home
                    </TypographyStyled>
                  </Link>
                </Box>
                <Typography variant='subtitle2'>Sign in to save properties and much more</Typography>
              </Box>

              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.email)}
                        placeholder='Email'
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                    Password
                  </InputLabel>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='Password'
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <Box
                  sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}
                >
                  <FormControlLabel
                    label='Remember Me'
                    control={
                      <Checkbox
                        color='secondary'
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                      />
                    }
                  />
                  <Typography
                    variant='body2'
                    component={Link}
                    href='/forgot-password'
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
                <LoadingButton
                  loading={isLoading}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ mb: 7 }}
                >
                  Login
                </LoadingButton>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography sx={{ mr: 2, color: 'text.secondary' }}>New on our platform?</Typography>
                  <Typography href='/register' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Create an account
                  </Typography>
                </Box>
              </form>
            </BoxWrapper>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
