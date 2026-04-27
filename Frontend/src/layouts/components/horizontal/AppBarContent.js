// ** MUI Imports
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { topNavBar } from 'src/configs'
import { useAuth } from 'src/hooks/useAuth'

const AppBarContent = props => {
  // ** Props
  const { settings, saveSettings } = props
  const { asPath } = useRouter()
  const { user } = useAuth()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {topNavBar.navRight
        .filter(i => !user?.usercode || i.NAV_ID !== 9)
        .map((item, index) => (
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
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {user?.usercode && <UserDropdown settings={settings} />}
    </Box>
  )
}

export default AppBarContent
