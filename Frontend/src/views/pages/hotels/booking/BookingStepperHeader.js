import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import CompanyLogo from 'src/@core/components/company-logo'
import { defaultPageFont, BOOKING_STEPS } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'
import themeConfig from 'src/configs/themeConfig'

const BookingStepperHeader = ({ currentStep = 1 }) => {
  const { user, logoutNoRedirect } = useAuth()

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* Top Nav */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link href='/home' style={{ textDecoration: 'none' }}>
          <Stack direction='row' spacing={1.2} alignItems='center'>
            <CompanyLogo width='32' />
            <Typography sx={{ color: '#0b1730', fontSize: '1rem', fontWeight: 800, fontFamily: defaultPageFont }}>
              {themeConfig.templateName}
            </Typography>
          </Stack>
        </Link>
        <Stack direction='row' spacing={0.5} alignItems='center'>
          <Icon icon='tabler:lock' style={{ color: '#27ae60', fontSize: 16 }} />
          <Typography variant='caption' sx={{ color: '#666', fontWeight: 500 }}>
            Secure
          </Typography>
          {user && (
            <Typography variant='caption' sx={{ color: '#666', fontWeight: 500 }}>
              <IconButton onClick={() => logoutNoRedirect()}>
                <Icon icon='tabler:logout' style={{ fontSize: 16 }} />
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: '9px !important',
                    ml: 0.5
                  }}
                >
                  Logout
                </Typography>
              </IconButton>
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Stepper */}
      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2, pb: 2 }}>
        <Stack direction='row' alignItems='center' justifyContent='center' spacing={0}>
          {BOOKING_STEPS.map((step, idx) => {
            const done = currentStep > step.step
            const active = currentStep === step.step

            return (
              <Stack key={step.step} direction='row' alignItems='center'>
                <Stack alignItems='center' spacing={0.5}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: done || active ? '#27ae60' : '#e0e0e0',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      fontFamily: defaultPageFont
                    }}
                  >
                    {done ? <Icon icon='tabler:check' style={{ fontSize: 14 }} /> : step.step}
                  </Box>
                  <Typography
                    variant='caption'
                    sx={{
                      fontWeight: active || done ? 700 : 400,
                      color: active || done ? '#0d1831' : '#aaa',
                      fontFamily: defaultPageFont,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {step.label}
                  </Typography>
                </Stack>
                {idx < BOOKING_STEPS.length - 1 && (
                  <Box
                    sx={{
                      width: { xs: 40, md: 80 },
                      height: 2,
                      mx: 1,
                      mb: 2.5,
                      backgroundColor: currentStep > step.step ? '#27ae60' : '#e0e0e0'
                    }}
                  />
                )}
              </Stack>
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

export default BookingStepperHeader
