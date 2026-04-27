// ** MUI Imports
import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiToolbar from '@mui/material/Toolbar'
import Autocomplete from 'src/layouts/components/Autocomplete'
import MenuIcon from '@mui/icons-material/Menu'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Components
import Customizer from 'src/@core/components/customizer'
import Footer from './components/shared-components/footer'
import Navigation from './components/horizontal/navigation'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAuth } from 'src/hooks/useAuth'
import GuestFooterContent from './components/shared-components/footer/GuestFooterContent'
import UserDropdown from './components/shared-components/UserDropdown'
import { Stack } from '@mui/system'
import LoginModal from 'src/layouts/components/horizontal/LoginModal'
import Link from 'next/link'
import { Button, IconButton, Typography } from '@mui/material'
import CompanyLogo from '../components/company-logo'
import { useRouter } from 'next/router'
import { useState } from 'react'

const HorizontalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
  ...(themeConfig.horizontalMenuAnimation && { overflow: 'clip' })
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const landingNav = [
  { label: 'Discover', href: '/discover' },
  { label: 'Communities', href: '/communities' },
  { label: 'Pricing', href: '/pricing' }
]

const authNav = [{ label: 'Get Started', href: '/register', variant: 'contained' }]
const drawerWidth = 240
import { defaultPageFont } from 'src/@core/utils'

const HorizontalLayout = props => {
  // ** Props
  const {
    hidden,
    children,
    settings,
    scrollToTop,
    footerProps,
    saveSettings,
    contentHeightFixed,
    horizontalLayoutProps
  } = props
  const isGuest = children.type?.guestGuard || false

  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  const { user } = useAuth()
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content
  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  const { window } = props
  const { asPath } = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}>
        {/* Navbar (or AppBar) and Navigation Menu Wrapper */}
        <AppBar
          component='nav'
          elevation={0}
          sx={{ px: '16%', backgroundColor: '#fff', borderBottom: '1px solid #e3ece8' }}
        >
          <Toolbar sx={{ height: 80, display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: 'none' } }}
            >
              <MenuIcon sx={{ color: '#0b1730' }} />
            </IconButton>
            <Link href='/home' style={{ textDecoration: 'none' }}>
              <Stack direction='row' spacing={1.2} alignItems='center'>
                <CompanyLogo width='36' />
                <Typography sx={{ color: '#0b1730', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'inter' }}>
                  {themeConfig.templateName}
                </Typography>
              </Stack>
            </Link>

            <Stack direction='row' spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {landingNav.map(item => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <Button
                    variant='text'
                    sx={{
                      px: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: asPath === item.href ? 800 : 700,
                      color: asPath === item.href ? '#0b1730' : '#5e6b82',
                      fontFamily: defaultPageFont
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Stack>

            <Stack direction='row' spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {user?.usercode ? (
                <Box display='flex' alignItems='center'>
                  <UserDropdown settings={settings} />
                </Box>
              ) : (
                <>
                  <LoginModal />
                  {authNav.map(item => (
                    <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                      <Button
                        variant={item.variant === 'contained' ? 'contained' : 'text'}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 999,
                          px: 2.2,
                          py: 0.8,
                          fontWeight: 700,
                          fontFamily: defaultPageFont,
                          color: item.variant === 'contained' ? '#fff' : '#0b1730',
                          backgroundColor: item.variant === 'contained' ? '#111827' : 'transparent',
                          '&:hover': {
                            backgroundColor: item.variant === 'contained' ? '#000' : 'rgba(17,185,129,0.08)'
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        {!navHidden && user ? (
          <AppBar component='nav' elevation={0} sx={{ mt: 20 }}>
            <Box
              className='layout-horizontal-nav'
              sx={{
                display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                bgcolor: 'primary.main',
                width: '100%',
                ...horizontalLayoutProps?.navMenu?.sx
              }}
            >
              {user && (
                <Toolbar
                  className='horizontal-nav-content-container'
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    maxWidth: 1200,
                    minHeight: theme => `${theme.mixins.toolbar.minHeight - (skin === 'bordered' ? 1 : 0)}px !important`
                  }}
                >
                  {(userNavMenuContent && userNavMenuContent(props)) || (
                    <Navigation {...props} horizontalNavItems={horizontalLayoutProps?.navMenu?.navItems} />
                  )}
                  <Autocomplete hidden={hidden} settings={settings} />
                </Toolbar>
              )}
            </Box>
          </AppBar>
        ) : null}

        {/* Content */}
        <ContentWrapper
          className='layout-page-content'
          sx={{
            px: isGuest ? '16%' : 0,
            ...(contentHeightFixed && { display: 'flex', overflow: 'hidden' }),
            ...(contentWidth === 'boxed' && {
              mx: 'auto',
              '@media (min-width:1440px)': { maxWidth: 1440 },
              '@media (min-width:1200px)': { maxWidth: '100%' }
            }),
            '@media (min-width:880px)': { mt: 40 }
          }}
        >
          {children}
        </ContentWrapper>

        {/* Footer */}
        <GuestFooterContent />
        {/* <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} /> */}

        {/* Customizer */}
        {themeConfig.disableCustomizer || hidden ? null : <Customizer />}

        {/* Scroll to top button */}
        {scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className='mui-fixed'>
            <Fab color='primary' size='small' aria-label='scroll back to top'>
              <Icon icon='mdi:arrow-up' />
            </Fab>
          </ScrollToTop>
        )}
      </MainContentWrapper>
    </HorizontalLayoutWrapper>
  )
}

export default HorizontalLayout
