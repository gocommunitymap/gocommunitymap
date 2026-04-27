import { Box, Typography, CircularProgress, Container } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const UnderDevelopment = () => {
  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
        flexDirection: 'column',
        textAlign: 'center'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <IconifyIcon icon='tabler:barrier-block' fontSize='100' color='#ffcc00' />
      </Box>
      <Typography variant='h4' sx={{ mb: 2 }}>
        This Page is Under Development
      </Typography>
      <Typography variant='body1'>We're working hard to bring you something great! Please check back soon.</Typography>
    </Container>
  )
}

export default UnderDevelopment
