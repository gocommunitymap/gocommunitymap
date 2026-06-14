import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MenuIcon from '@mui/icons-material/Menu'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import CompanyLogo from 'src/@core/components/company-logo'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
import LoginModal from './LoginModal'

const drawerWidth = 240
import { defaultPageFont } from 'src/@core/utils'
import themeConfig from 'src/configs/themeConfig'

const landingNav = [
  { label: 'Discover', href: '/home' },
  { label: 'Communities', href: '/hotels/properties' },
  { label: 'Pricing', href: '/newhome/properties' }
]

const authNav = [{ label: 'Get Started', href: '/register', variant: 'contained' }]

function GuestAppBar(props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const { asPath } = useRouter()
  const { settings } = useSettings()
  const { user } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }

  const drawer = (
    <Box sx={{ textAlign: 'left', p: 2 }}>
      <Link href='/home' style={{ textDecoration: 'none' }}>
        <Stack direction='row' spacing={1.2} alignItems='center'>
          <CompanyLogo width='36' />
          <Typography sx={{ color: '#0b1730', fontSize: '1.05rem', fontWeight: 800, fontFamily: defaultPageFont }}>
            {themeConfig.templateName}
          </Typography>
        </Stack>
      </Link>
      <List sx={{ p: 0 }}>
        {landingNav.map(item => {
          const active =
            item?.href ===
            (asPath?.lastIndexOf('/') == asPath?.length - 1 ? asPath.substring(0, asPath?.lastIndexOf('/')) : asPath)

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <Button
                onClick={handleDrawerToggle}
                fullWidth
                variant='text'
                sx={{
                  justifyContent: 'flex-start',
                  mb: 1,
                  borderRadius: 2,
                  color: active ? 'white' : 'primary.main',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontFamily: defaultPageFont,
                  '& .MuiButton-text:hover': { bgcolor: 'primary.light' }
                }}
              >
                {item.label}
              </Button>
            </Link>
          )
        })}
        {user?.usercode ? null : (
          <Box sx={{ mt: 1, mb: 1 }}>
            <LoginModal fullWidth />
          </Box>
        )}
        {user?.usercode
          ? null
          : authNav.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  onClick={handleDrawerToggle}
                  fullWidth
                  variant={item.variant === 'contained' ? 'contained' : 'text'}
                  sx={{
                    justifyContent: 'center',
                    mb: 1,
                    borderRadius: 2,
                    color: item.variant === 'contained' ? '#fff' : '#0b1730',
                    backgroundColor: item.variant === 'contained' ? '#111827' : 'transparent',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontFamily: defaultPageFont,
                    '&:hover': {
                      backgroundColor: item.variant === 'contained' ? '#000' : 'rgba(17,185,129,0.08)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box>
      <CssBaseline />
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
                      fontFamily: defaultPageFont,
                      '& .MuiButton-text:hover': { bgcolor: 'primary.light' }
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            })}
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  )
}

export default GuestAppBar
