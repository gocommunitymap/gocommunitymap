import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CompanyLogo from 'src/@core/components/company-logo'

import { defaultPageFont } from 'src/@core/utils'
import themeConfig from 'src/configs/themeConfig'

const footerColumns = [
  {
    title: 'Discover',
    links: [
      { label: 'Luxury Villas', href: '/hotels/properties' },
      { label: 'Urban Apartments', href: '/newhome/properties' },
      { label: 'Mountain Retreats', href: '/rentals/properties' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '/home' },
      { label: 'How it Works', href: '/home' },
      { label: 'Market Trends', href: '/houseprice' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/home' },
      { label: 'Contact Us', href: '/home' },
      { label: 'Safety Info', href: '/home' }
    ]
  }
]

const GuestFooterContent = () => {
  return (
    <Box sx={{ px: '18%', backgroundColor: '#f8fbfa', borderTop: '1px solid #e1e9e6', mt: 4 }}>
      <Container maxWidth='xl' sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 3, md: 10 }}>
          <Grid item xs={12} md={3}>
            <Stack direction='row' spacing={1.2} alignItems='center'>
              <CompanyLogo width='36' />
              <Typography
                variant='h6'
                sx={{ fontSize: '16px !important', color: '#0b1730', fontWeight: 800, fontFamily: defaultPageFont }}
              >
                {themeConfig.templateName}
              </Typography>
            </Stack>
            <Typography
              variant='body2'
              sx={{ mt: 2, color: '#62718a', fontFamily: defaultPageFont, fontSize: 12, fontWeight: 500 }}
            >
              Redefining premium living with authentic localized neighborhood data and high-end rentals worldwide.
            </Typography>
          </Grid>

          {footerColumns.map(column => (
            <Grid item xs={12} sm={4} md={3} key={column.title}>
              <Typography
                variant='body2'
                sx={{
                  color: '#0b1730',
                  textTransform: 'uppercase',
                  fontFamily: defaultPageFont,
                  fontSize: 12,
                  fontWeight: 700,
                  mb: 5,
                  letterSpacing: 2
                }}
              >
                {column.title}
              </Typography>
              <Stack spacing={1}>
                {column.links.map(link => (
                  <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                    <Typography
                      sx={{ color: '#6f7f98', fontWeight: 600, fontSize: '0.9rem', fontFamily: defaultPageFont }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 10,
            pt: 2.5,
            borderTop: '1px solid #e4ebe8',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 1.2
          }}
        >
          <Typography
            sx={{
              color: '#8a98af',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: 2.2,
              fontWeight: 700,
              fontFamily: defaultPageFont
            }}
          >
            © {new Date().getFullYear()} {themeConfig.templateName}. Premium global stays.
          </Typography>
          <Stack direction='row' spacing={2.5}>
            <Link href='/privacy' style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#8a98af',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: 1.4,
                  fontWeight: 700,
                  fontFamily: defaultPageFont
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Link href='/terms' style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#8a98af',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: 1.4,
                  fontWeight: 700,
                  fontFamily: defaultPageFont
                }}
              >
                Terms of Service
              </Typography>
            </Link>
            <Link href='/cookie-policy' style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#8a98af',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: 1.4,
                  fontWeight: 700,
                  fontFamily: defaultPageFont
                }}
              >
                Cookie Policy
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default GuestFooterContent
