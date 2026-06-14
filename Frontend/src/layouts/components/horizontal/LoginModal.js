import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Slide,
  TextField,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { forwardRef, useEffect, useState } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

import { defaultPageFont } from 'src/@core/utils'

const SlideDown = forwardRef((props, ref) => <Slide direction='down' ref={ref} {...props} />)

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  email: '',
  password: ''
}

const LoginModal = ({ fullWidth = false, isDirectOpen = false, callBack = () => {} }) => {
  const auth = useAuth()
  const [isOpen, setIsOpen] = useState(isDirectOpen)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (!isOpen) return
    if (!auth?.user?.usercode) return

    setIsLoading(false)
    setIsOpen(false)
    reset(defaultValues)
  }, [auth?.user?.usercode, isOpen, reset])

  useEffect(() => {
    if (isDirectOpen) setIsOpen(true)
  }, [isDirectOpen])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsLoading(false)
    reset(defaultValues)
    callBack()
  }

  const onSubmit = data => {
    setIsLoading(true)

    // Fallback to avoid a stuck loading state if the request never resolves.
    const safetyTimer = setTimeout(() => {
      setIsLoading(false)
    }, 12000)

    auth.login({ username: data.email, password: data.password, rememberMe: true, noRedirect: true }, error => {
      clearTimeout(safetyTimer)
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error, {
          position: 'top-center',
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
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        fullWidth={fullWidth}
        sx={{
          justifyContent: fullWidth ? 'space-between' : 'center',
          textTransform: 'none',
          borderRadius: 999,
          px: 2.2,
          py: 0.8,
          fontWeight: 700,
          fontFamily: defaultPageFont,
          color: '#0b1730',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(17,185,129,0.08)'
          }
        }}
      >
        Login
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        TransitionComponent={SlideDown}
        transitionDuration={{ enter: 500, exit: 300 }}
        PaperProps={{
          sx: {
            width: { xs: 'calc(100% - 24px)', sm: 520 },
            borderRadius: 3,
            overflow: 'hidden',
            minHeight: 350
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box p={5} display='flex' justifyContent='space-between' alignItems='center'>
            <Typography color='primary.main' sx={{ fontWeight: 800, fontSize: '1.8rem', fontFamily: defaultPageFont }}>
              Log in
            </Typography>
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'rgba(92,82,123,0.12)'
              }}
            >
              <IconifyIcon icon='tabler:x' fontSize='1rem' />
            </IconButton>
          </Box>

          <Divider />

          <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ px: 3, py: 2.8 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  size='medium'
                  placeholder='E-mail'
                  type='email'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  sx={{
                    mb: 1.6,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#fff',
                      borderRadius: 6,
                      minHeight: 48
                    }
                  }}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  size='medium'
                  placeholder='Password'
                  type={showPassword ? 'text' : 'password'}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={() => setShowPassword(prev => !prev)}>
                          <IconifyIcon icon={showPassword ? 'tabler:eye-off' : 'tabler:eye'} fontSize='1rem' />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 1.4,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#fff',
                      borderRadius: 6,
                      minHeight: 48
                    }
                  }}
                />
              )}
            />

            <Box textAlign='center' mb={2}>
              <MuiLink
                component={Link}
                href='/forgot-password'
                underline='hover'
                sx={{ fontSize: 15, fontWeight: 600, fontFamily: defaultPageFont }}
              >
                Forgot your password?
              </MuiLink>
            </Box>

            <Button
              size='large'
              loading={isLoading}
              loadingIndicator='Signing in...'
              loadingPosition='center'
              fullWidth
              type='submit'
              variant='contained'
              sx={{
                mb: 2.4,
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.6rem',
                py: 1.25
              }}
            >
              {isLoading ? <CircularProgress color='inherit' /> : 'Login'}
            </Button>

            <Box textAlign='center'>
              <Typography component='span' sx={{ fontSize: 15, fontFamily: defaultPageFont }}>
                Don&apos;t have an account?
              </Typography>
              <MuiLink
                component={Link}
                href='/register'
                underline='hover'
                sx={{ ml: 0.5, fontSize: 15, fontWeight: 700 }}
              >
                Sign up
              </MuiLink>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginModal
