import { Card, CardContent, Chip, Container, Grid, Typography, useTheme } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
import Link from 'next/link'

const Privacy = () => {
  const theme = useTheme()

  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h3' color='primary.main'>
              Privacy Policy
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ px: 10 }}>
                <Typography variant='body2' lineHeight={2} letterSpacing={2}>
                  At{' '}
                  <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {themeConfig.templateName2}
                  </span>
                  , we respect your privacy. We collect personal information including your name, email, phone number,
                  and booking details solely to process reservations and improve your experience. Your data is protected
                  with SSL encryption and will never be sold or rented to third parties. We use cookies to improve
                  browsing experience and remember your preferences. You may request access, correction, or deletion of
                  your data at any time by contacting{' '}
                  <Link target='_blank' href='mailto:support@gocommunitymap.com'>
                    support@gocommunitymap.com
                  </Link>
                  . By using{' '}
                  <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {themeConfig.templateName2}
                  </span>
                  , you agree to our data practices.
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

Privacy.guestGuard = true

export default Privacy
