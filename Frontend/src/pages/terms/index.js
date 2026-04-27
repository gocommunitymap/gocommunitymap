import PropTypes from 'prop-types'
import { Card, CardContent, Container, Divider, Grid, Typography } from '@mui/material'

import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import themeConfig from 'src/configs/themeConfig'
import { Box } from '@mui/system'
import UnderDevelopment from 'src/views/components/under-development'

const Terms = props => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h3'>Website Terms of Use</Typography>
          <UnderDevelopment />
        </Grid>
      </Grid>
    </Container>
  )
}

Terms.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
}

Terms.guestGuard = true

export default Terms
