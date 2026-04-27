import PropTypes from 'prop-types'
import { Card, CardContent, Container, Divider, Grid, Typography } from '@mui/material'

import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import themeConfig from 'src/configs/themeConfig'
import { Box } from '@mui/system'

const Privacy = props => {
  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h3'>Privacy Policy</Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h4'>Terms and conditions</Typography>
                <Typography variant='body1'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

Privacy.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
}

Privacy.guestGuard = true

export default Privacy
