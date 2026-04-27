// ** Next Import
import Link from 'next/link'
import Head from 'next/head'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { clientConfig } from 'src/configs/clientConfig'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import CompanyLogo from 'src/@core/components/company-logo'
import { forgotPasswordAPI } from 'src/configs'
import toast from 'react-hot-toast'
import { Alert } from '@mui/material'
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

const ForgotPassword = () => {
  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ email: null })

  const [isSubmit, setIsSubmit] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const theme = useTheme()

  const onSubmit = async data => {
    setIsSubmit(true)
    await forgotPasswordAPI({ data })
      .then(response => {
        setIsSubmit(false)
        if (response === false) {
          toast.error(response.error)

          return
        }
        setIsSuccess(true)
        setValue('email', '')
        setTimeout(() => {
          setIsSuccess(false)
        }, 10000)
      })
      .catch(error => {
        setIsSubmit(false)
        toast.error(error)
      })
  }

  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <Box className='content-center'>
        <AuthIllustrationV1Wrapper>
          <Card>
            <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <CompanyLogo width='60' />
                {/* <Typography sx={{ color: '#7367f0', mb: 1.5, fontWeight: 500, fontSize: '12' }}>
                {themeConfig.templateName}
              </Typography> */}
              </Box>
              <Box sx={{ mb: 6 }} textAlign='center'>
                <Typography variant='h6' sx={{ mb: 1.5 }}>
                  Forgot Password? 🔒
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Enter your "Registered Email Address" and we&prime;ll send you instructions to reset your password
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='email'
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
                      autoFocus
                      sx={{ display: 'flex', mb: 4 }}
                      type='email'
                      value={value}
                      inputProps={{ maxLength: 50 }}
                      label='EMAIL ADDRESS'
                      onChange={onChange}
                      placeholder='EMAIL ADDRESS'
                      error={Boolean(errors.email)}
                      helperText={Boolean(errors.email) && 'Required'}
                    />
                  )}
                />{' '}
                <LoadingButton
                  loading={isSubmit}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ mb: 4 }}
                >
                  Send reset link
                </LoadingButton>
                {isSuccess && <Alert severity='success'>Email Successfully Send, Please Check Your Email.</Alert>}
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                >
                  <LinkStyled href='/login'>
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
  )
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
