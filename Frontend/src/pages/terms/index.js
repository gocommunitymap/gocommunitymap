import { Card, CardContent, Chip, Container, Grid, Typography, useTheme } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
import Link from 'next/link'

const Terms = props => {
  const theme = useTheme()

  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h3' color='primary.main'>
              Terms of Service
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ px: 10 }}>
                <Typography variant='body2' lineHeight={2} letterSpacing={2}>
                  Welcome to{' '}
                  <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {themeConfig.templateName2}
                  </span>
                  . By using our platform you agree to these terms. Users must be 18 years or older. You agree to
                  provide accurate and truthful information during registration and booking. All bookings are subject to
                  availability and property confirmation. Cancellation and refund policies vary by property and are
                  clearly shown before booking.{' '}
                  <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {themeConfig.templateName2}
                  </span>{' '}
                  acts as an intermediary booking platform and is not liable for disputes, damages, or actions of
                  property owners or guests. We reserve the right to suspend accounts that violate our terms. Governing
                  law: Canada.
                </Typography>
                <Chip sx={{ mt: 2 }} label='Last updated: May 2026' variant='filled' color='primary' />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

Terms.guestGuard = true

export default Terms
