import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import IconifyIcon from 'src/@core/components/icon'
import SeoHead from 'src/components/SeoHead'

import { defaultPageFont } from 'src/@core/utils'

const FurnitureMarketplace = () => {
  const router = useRouter()

  return (
    <>
      <SeoHead
        title='Furniture Marketplace - Coming Soon'
        description='Discover amazing furniture deals in our upcoming marketplace. Buy and sell furniture easily.'
        canonical='https://gocommunitymap.com/furniture-marketplace'
      />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fafbfc',
          py: 8
        }}
      >
        <Container maxWidth='md'>
          <Box sx={{ textAlign: 'center' }}>
            {/* Icon */}
            <Box
              sx={{
                fontSize: '6rem',
                mb: 3
              }}
            >
              ðŸ›‹ï¸
            </Box>

            {/* Title */}
            <Typography
              variant='h1'
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                color: '#0b1730',
                fontFamily: defaultPageFont,
                mb: 2
              }}
            >
              Furniture <span style={{ color: '#10B981' }}>Marketplace</span>
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: '#6f7f98',
                fontFamily: defaultPageFont,
                mb: 6
              }}
            >
              Coming Soon
            </Typography>

            {/* Back Button */}
            <Button
              variant='contained'
              onClick={() => router.push('/home')}
              startIcon={<IconifyIcon icon='tabler:arrow-left' />}
              sx={{
                bgcolor: '#10B981',
                color: 'white',
                fontFamily: defaultPageFont,
                fontWeight: 600,
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#059669',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}

FurnitureMarketplace.guestGuard = true

// FurnitureMarketplace.getLayout = page => <GuestBlankLayout>{page}</GuestBlankLayout>

export default FurnitureMarketplace
