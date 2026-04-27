import { styled } from '@mui/material/styles'
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CompanyLogo from 'src/@core/components/company-logo'
import IconifyIcon from 'src/@core/components/icon'
import GuestFooterContent from './components/shared-components/footer/GuestFooterContent'
import { defaultPageFont } from 'src/@core/utils'
import themeConfig from 'src/configs/themeConfig'

const BlankLayoutWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  backgroundColor: '#fafbfc',
  display: 'flex',
  flexDirection: 'column'
}))

const CommunityMapLayout = ({ children }) => {
  const router = useRouter()

  return (
    <BlankLayoutWrapper className='layout-wrapper'>
      {/* Custom AppBar with Back Button and Auth */}
      <AppBar
        position='sticky'
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e3ece8',
          zIndex: 1100
        }}
      >
        <Toolbar
          sx={{
            height: 80,
            px: { xs: 2, sm: 4, md: 8 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Left: Back Button */}
          <IconButton
            onClick={() => router.push('/home')}
            sx={{
              color: '#0b1730',
              border: '2px solid #e0e7ed',
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: '#f0f4f8',
                borderColor: '#10B981'
              }
            }}
          >
            <IconifyIcon icon='tabler:arrow-left' fontSize='1.3rem' />
            <Typography
              sx={{
                ml: 1,
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: defaultPageFont,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Back
            </Typography>
          </IconButton>

          {/* Center: Logo (optional, can be removed) */}
          <Link href='/home' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Stack direction='row' spacing={1.2} alignItems='center' sx={{ display: { xs: 'none', md: 'flex' } }}>
              <CompanyLogo width='36' />
              <Typography sx={{ color: '#0b1730', fontSize: '1.4rem', fontWeight: 800, fontFamily: defaultPageFont }}>
                {themeConfig.templateName}
              </Typography>
            </Stack>
          </Link>

          {/* Right: Auth Buttons */}
          <Stack direction='row' spacing={1.5}>
            <Link href='/login' style={{ textDecoration: 'none' }}>
              <Button
                variant='text'
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.9,
                  fontWeight: 600,
                  fontFamily: defaultPageFont,
                  color: '#0b1730',
                  border: '2px solid #10B981',
                  '&:hover': {
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderColor: '#059669'
                  }
                }}
              >
                Sign In
              </Button>
            </Link>
            <Link href='/register' style={{ textDecoration: 'none' }}>
              <Button
                variant='contained'
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.9,
                  fontWeight: 600,
                  fontFamily: defaultPageFont,
                  backgroundColor: '#10B981',
                  '&:hover': {
                    backgroundColor: '#059669'
                  }
                }}
              >
                Sign Up
              </Button>
            </Link>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box className='app-content'>{children}</Box>

      {/* Footer */}
      <GuestFooterContent />
    </BlankLayoutWrapper>
  )
}

export default CommunityMapLayout
