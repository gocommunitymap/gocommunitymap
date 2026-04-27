// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CompanyLogo from '../company-logo'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <CompanyLogo width={90} style={{ paddingBottom: 2 }} />
      <CircularProgress color='secondary' size={50} disableShrink />
    </Box>
  )
}

export default FallbackSpinner
