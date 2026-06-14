// ** MUI Imports
import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiToolbar from '@mui/material/Toolbar'
import Autocomplete from 'src/layouts/components/Autocomplete'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

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
import { Button, Collapse, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import CompanyLogo from '../components/company-logo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
  { label: 'Home', href: '/home' },
  { label: 'Discover', href: '/discover' },
  { label: 'Communities', href: '/community-map' }
]

const authNav = [{ label: 'Get Started', href: '/register', variant: 'contained' }]
const drawerWidth = 280
import { defaultPageFont } from 'src/@core/utils'
import ServerSideNavItems from 'src/layouts/components/horizontal/ServerSideNavItems'
import { useTheme } from '@emotion/react'
import { topNavBar } from 'src/configs'

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
  const [navbar1, setNavbar1] = useState([])
  const [openItem, setOpenItem] = useState(null)
  const { menuItems } = ServerSideNavItems()
  const theme = useTheme()

  const initialize = () => {
    setNavbar1(topNavBar.navLeft)
  }

  useEffect(() => {
    initialize()
  }, [user])

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }

  const handleItemToggle = index => {
    setOpenItem(prev => (prev === index ? null : index))
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Link href='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CompanyLogo width='32' />
          <Typography sx={{ color: '#0b1730', fontSize: '1rem', fontWeight: 800, fontFamily: defaultPageFont }}>
            {themeConfig.templateName}
          </Typography>
        </Link>
        <IconButton onClick={handleDrawerToggle} size='small' sx={{ color: '#6b7280' }}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      {/* User greeting */}
      {user?.usercode && (
        <Box
          sx={{
            mx: 2,
            mt: 2,
            mb: 1,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: '#f8fafc',
            border: '1px solid #e8f0fe',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
              {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0b1730', fontFamily: defaultPageFont }}>
              {user?.fullName}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Scrollable nav area */}
      <Box sx={{ overflowY: 'auto', flex: 1, pb: 2 }}>
        {/* Public nav */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              letterSpacing: 1,
              px: 1,
              mb: 1,
              textTransform: 'uppercase'
            }}
          >
            Explore
          </Typography>
          {landingNav.map((item, index) => {
            const active =
              item?.href ===
              (asPath?.lastIndexOf('/') == asPath?.length - 1 ? asPath.substring(0, asPath?.lastIndexOf('/')) : asPath)

            return (
              <Link key={index} onClick={handleDrawerToggle} href={item.href} style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    color: active ? 'white' : 'primary.main',
                    bgcolor: active ? 'primary.main' : 'transparent',
                    transition: 'background 0.2s',
                    '& .MuiButton-text:hover': { bgcolor: 'primary.light' }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      fontFamily: defaultPageFont
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            )
          })}
        </Box>

        {/* Authenticated menu */}
        {menuItems?.length > 0 && (
          <Box sx={{ px: 2, pt: 2 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: '#9ca3af',
                letterSpacing: 1,
                px: 1,
                mb: 1,
                textTransform: 'uppercase'
              }}
            >
              Menu
            </Typography>
            {menuItems.map((item, index) => {
              const isChildActive = item.children?.some(sub => asPath.startsWith(sub.path))
              const isOpen = openItem === index

              return (
                <div key={index}>
                  {item.children ? (
                    <>
                      <ListItemButton
                        onClick={() => handleItemToggle(index)}
                        sx={{
                          px: 2,
                          py: 1,
                          mb: 0.5,
                          borderRadius: 2,
                          borderLeft: isChildActive
                            ? `3px solid ${theme.palette.primary.main}`
                            : '3px solid transparent',
                          bgcolor: isChildActive ? `${theme.palette.primary.main}12` : 'transparent',
                          '&:hover': { bgcolor: isChildActive ? `${theme.palette.primary.main}20` : '#f3f4f6' }
                        }}
                      >
                        <Typography
                          sx={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: 600,
                            color: isChildActive ? theme.palette.primary.main : '#374151',
                            fontFamily: defaultPageFont
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Icon
                          icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          fontSize={16}
                          color={isChildActive ? theme.palette.primary.main : '#9ca3af'}
                        />
                      </ListItemButton>
                      <Collapse in={isOpen} timeout='auto' unmountOnExit>
                        <List disablePadding sx={{ pl: 1.5, mb: 0.5 }}>
                          {item.children.map(subItem => {
                            const subActive = asPath.startsWith(subItem.path)

                            return (
                              <ListItem disablePadding key={subItem?.form_id}>
                                <Link
                                  onClick={handleDrawerToggle}
                                  href={subItem.path ?? asPath}
                                  style={{ textDecoration: 'none', width: '100%' }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      px: 2,
                                      py: 0.8,
                                      borderRadius: 1.5,
                                      mb: 0.3,
                                      bgcolor: subActive ? theme.palette.primary.main : 'transparent',
                                      '&:hover': { bgcolor: subActive ? theme.palette.primary.main : '#f3f4f6' }
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        bgcolor: subActive ? '#fff' : '#d1d5db',
                                        flexShrink: 0
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: 12,
                                        fontWeight: subActive ? 600 : 400,
                                        color: subActive ? '#fff' : '#6b7280',
                                        fontFamily: defaultPageFont
                                      }}
                                    >
                                      {subItem.title}
                                    </Typography>
                                  </Box>
                                </Link>
                              </ListItem>
                            )
                          })}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <Link onClick={handleDrawerToggle} href={item.path ?? asPath} style={{ textDecoration: 'none' }}>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          mb: 0.5,
                          borderRadius: 2,
                          bgcolor: asPath === item.path ? theme.palette.primary.main : 'transparent',
                          '&:hover': { bgcolor: asPath === item.path ? theme.palette.primary.main : '#f3f4f6' }
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: asPath === item.path ? 700 : 500,
                            color: asPath === item.path ? '#fff' : '#374151',
                            fontFamily: defaultPageFont
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Link>
                  )}
                </div>
              )
            })}
          </Box>
        )}
      </Box>

      {/* Footer CTA for guests */}
      {!user?.usercode && (
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <LoginModal />
          <Link href='/register' style={{ textDecoration: 'none' }}>
            <Button
              fullWidth
              variant='contained'
              sx={{
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                fontFamily: defaultPageFont,
                bgcolor: '#111827',
                '&:hover': { bgcolor: '#000' }
              }}
            >
              Get Started
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  )
  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}>
        {/* Navbar (or AppBar) and Navigation Menu Wrapper */}
        <AppBar
          component='nav'
          elevation={0}
          sx={{ px: { xs: 2, md: '16%' }, backgroundColor: '#fff', borderBottom: '1px solid #e3ece8' }}
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
                <Typography
                  sx={{ color: '#0b1730', fontSize: { xs: 12, md: 16 }, fontWeight: 800, fontFamily: 'inter' }}
                >
                  {themeConfig.templateName}
                </Typography>
              </Stack>
            </Link>
            <Stack direction='row' spacing={1} sx={{ display: { xs: 'flex', sm: 'none' } }}>
              {user && <UserDropdown settings={settings} />}
            </Stack>
            <Stack direction='row' spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {landingNav.map(item => {
                const active =
                  item?.href ===
                  (asPath?.lastIndexOf('/') == asPath?.length - 1
                    ? asPath.substring(0, asPath?.lastIndexOf('/'))
                    : asPath)

                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <Button
                      variant='text'
                      sx={{
                        px: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: active ? 800 : 700,
                        color: active ? 'white' : 'primary.main',
                        bgcolor: active ? 'primary.main' : 'transparent',
                        fontFamily: defaultPageFont
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </Stack>

            <Stack direction='row' spacing={1.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
              {horizontalLayoutProps?.navMenu?.navItems?.length > 0 && user && (
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
        <nav>
          <Drawer
            container={container}
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
            }}
          >
            {drawer}
          </Drawer>
        </nav>
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
            '@media (min-width:880px)': { mt: 40 },
            '@media (max-width:879px)': { mt: 18 }
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
