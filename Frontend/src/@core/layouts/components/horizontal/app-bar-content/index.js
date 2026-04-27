// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'

import ServerSideNavItems from 'src/layouts/components/horizontal/ServerSideNavItems'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'
import CompanyLogo from 'src/@core/components/company-logo'
import { Button, Divider, Drawer, Grid, IconButton, List, ListItem, Menu, MenuItem } from '@mui/material'
import { topNavBar } from 'src/configs'
import { blue, grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import Link from 'next/link'
import IconifyIcon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import UserDropdown from '../../shared-components/UserDropdown'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = props => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props
  const { asPath } = useRouter()

  // ** Hooks
  const theme = useTheme()
  const drawerWidth = 240
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navbar1, setNavbar1] = useState([])
  const [navbar2, setNavbar2] = useState([])
  const auth = useAuth()
  const { settings } = useSettings()
  const { menuItems } = ServerSideNavItems()

  const initialize = () => {
    setNavbar1(topNavBar.navLeft)
    setNavbar2(
      topNavBar.navRight.filter(i => {
        if (auth.user?.usercode && i.NAV_ID === 9) {
          return null
        }

        return i
      })
    )
  }

  useEffect(() => {
    initialize()
  }, [auth])

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Link href='/' style={{ textDecoration: 'none' }}>
        <CompanyLogo width='60' />
      </Link>
      <Divider />
      <List>
        <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
          {auth?.user?.usercode && <UserDropdown settings={settings} />}
        </ListItem>
        <ListItem
          sx={{
            p: 0,
            m: 0
          }}
        >
          <Grid container>
            {navbar2.map((item, index) => (
              <Grid
                key={index}
                item
                xs={12 / (item?.length ?? 1)}
                sx={{ bgcolor: asPath === item.LINK ? theme.palette.primary.main : 'inherit' }}
              >
                <Link
                  onClick={handleDrawerToggle}
                  href={item.LINK}
                  style={{
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                >
                  <Typography
                    sx={{ py: 1, px: 6, color: asPath === item.LINK ? 'common.white' : 'secondary.dark' }}
                    variant='body2'
                  >
                    {item.NAV_DESCRIPTION}
                  </Typography>
                </Link>
              </Grid>
            ))}
          </Grid>
        </ListItem>

        <Divider sx={{ mb: 1 }} />
        {navbar1.map((item, index) => (
          <ListItem
            sx={{
              p: 0,
              m: 0
            }}
            key={index}
          >
            <Link
              onClick={handleDrawerToggle}
              href={item.LINK}
              style={{
                textAlign: 'left',
                width: '100%',
                paddingTop: asPath === item.LINK ? 5 : 1,
                paddingBottom: asPath === item.LINK ? 5 : 1,
                backgroundColor: asPath === item.LINK ? theme.palette.primary.main : 'inherit',
                textDecoration: 'none'
              }}
            >
              <Typography
                sx={{ py: 0.5, px: 6, fontSize: 12, color: asPath === item.LINK ? 'common.white' : 'secondary.dark' }}
                variant='body2'
              >
                {item.NAV_DESCRIPTION?.toUpperCase()}
              </Typography>
            </Link>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        {menuItems?.map((item, index) => (
          <div key={index}>
            <ListItem
              sx={{
                p: 0,
                m: 0
              }}
            >
              <Link
                onClick={() => item.path && handleDrawerToggle()}
                href={item.path ?? asPath}
                style={{
                  textAlign: 'left',
                  width: '100%',
                  paddingTop: asPath === item.LINK ? 5 : 1,
                  paddingBottom: asPath === item.LINK ? 5 : 1,
                  backgroundColor: asPath === item.LINK ? theme.palette.primary.main : 'inherit',
                  textDecoration: 'none'
                }}
              ></Link>
            </ListItem>
            {item.children ? (
              <ListItem>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        p: 0,
                        m: 0,
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: asPath === item.LINK ? 'common.white' : 'secondary.dark'
                      }}
                      variant='body2'
                    >
                      {item.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <List sx={{ p: 0, m: 0 }}>
                      {item.children.map(subItem => (
                        <ListItem sx={{ p: 0, m: 0 }} key={subItem?.form_id}>
                          <Link
                            onClick={handleDrawerToggle}
                            style={{
                              textAlign: 'left',
                              width: '100%',
                              backgroundColor: asPath.startsWith(subItem.path) ? theme.palette.primary.main : 'inherit',
                              textDecoration: 'none',
                              paddingTop: asPath.startsWith(subItem.path) ? 5 : 1,
                              paddingBottom: asPath.startsWith(subItem.path) ? 5 : 1,
                              textDecoration: 'none'
                            }}
                            href={subItem.path ?? asPath}
                          >
                            <Typography
                              sx={{
                                py: 0.5,
                                px: 3,
                                fontSize: 12,
                                color: asPath.startsWith(subItem.path) ? 'common.white' : 'secondary.dark'
                              }}
                              variant='body2'
                            >
                              {subItem.title}
                            </Typography>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </ListItem>
            ) : (
              <Typography
                sx={{
                  py: 0.5,
                  px: item.children ? 6 : 10,
                  color: asPath.startsWith(subItem.path) ? 'common.white' : 'secondary.dark'
                }}
                variant='body2'
              >
                {item.title}
              </Typography>
            )}
          </div>
        ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon color='primary.light' />
            </IconButton>
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
          </Box>
          <LinkStyled href='/'>
            <CompanyLogo width='60' />
            {/* <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
            {themeConfig.templateName}
          </Typography> */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {topNavBar.navLeft.map((item, index) => (
                <Link key={index} href={item.LINK} style={{ textDecoration: 'none' }}>
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                        boxShadow: 0
                      },
                      mx: 1,
                      boxShadow: 0,
                      bgcolor: asPath.startsWith(item.LINK) ? 'action.active' : 'inherit',

                      color: '#fff',
                      fontSize: { lg: 12, md: 9, xs: 7 },
                      p: 2.2
                    }}
                  >
                    {item.NAV_DESCRIPTION}
                  </Button>
                </Link>
              ))}
            </Box>
          </LinkStyled>
        </>
      )}
      {userAppBarContent ? (
        userAppBarContent(props)
      ) : (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {topNavBar.navRight.map((item, index) => (
            <Link
              key={index}
              href={item.NAV_ID !== 9 ? `/login/?returnUrl=${item.LINK}` : item.LINK}
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant='contained'
                size='small'
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                    boxShadow: 0
                  },
                  mx: 1,
                  boxShadow: 0,
                  bgcolor: asPath === item.LINK ? 'action.active' : 'inherit',

                  color: '#fff',
                  fontSize: { lg: 12, md: 9, xs: 7 },
                  p: 2.2
                }}
              >
                {item.NAV_DESCRIPTION}
              </Button>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default AppBarContent
