// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import GuestAppBar from 'src/layouts/components/horizontal/GuestAppBar'
import GuestFooterContent from './components/shared-components/footer/GuestFooterContent'
import { useAuth } from 'src/hooks/useAuth'

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  backgroundColor: '#F8FAFC',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5)
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative'
  }
}))

const GuestBlankLayout = ({ children }) => {
  return (
    <BlankLayoutWrapper className='layout-wrapper'>
      <GuestAppBar props={children.props} />

      <Box
        className='app-content'
        sx={{
          maxWidth: 1300,
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          pt: { xs: 10, md: 25 },
          pb: 2,
          minHeight: '100vh',
          overflowX: 'hidden',
          position: 'relative'
        }}
      >
        {children}
      </Box>
      <GuestFooterContent />
    </BlankLayoutWrapper>
  )
}

export default GuestBlankLayout
