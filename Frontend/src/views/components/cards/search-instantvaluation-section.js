// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import {
  Autocomplete,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomRadioWithImages from '../radio/custom-radio'
import { Controller, useForm } from 'react-hook-form'
import { bedsOptions, priceOptions } from 'src/configs'
import { styled, useTheme } from '@mui/material/styles'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: '100%',
  position: 'absolute',
  zIndex: -1,
  height: '100%'
}))

export const SearchForInstantValuationCard = ({
  fieldState,
  onPostCodeChange,
  handleLookupPostCode,
  postalCodeLoading
}) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Card
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        minHeight: 350,
        mb: 3
      }}
    >
      <CardContent
        sx={{ p: theme => `${theme.spacing(7, 7.5)} !important`, height: '100%' }}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{ width: '100%', height: '100%', m: { md: 5, xs: 1 } }}
        >
          <Grid container spacing={6} textAlign='center'>
            <Grid item md={4} xs={12} display='flex' justifyContent='center'>
              <Card sx={{ p: 5 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} textAlign='left'>
                    <Typography variant='h6' fontWeight='bold'>
                      How much is my home worth?
                    </Typography>
                    <Typography variant='subtitle2'>
                      Unlock the UK's largest property database and get a free online house valuation in seconds.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} textAlign='left'>
                    <Typography variant='subtitle2'>Enter a full UK postcode</Typography>
                    <FormControl fullWidth size='small'>
                      <>
                        <TextField
                          fullWidth
                          value={fieldState?.postalCode}
                          inputProps={{ maxLength: 100 }}
                          onChange={onPostCodeChange}
                          placeholder='e.g. SE1 2LH'
                          size='small'
                          error={Boolean(fieldState?.postalCode != null && fieldState?.error != null)}
                          helperText={fieldState?.error}
                          disabled={postalCodeLoading}
                          InputProps={{
                            endAdornment: postalCodeLoading ? (
                              <InputAdornment>
                                <CircularProgress size={15} />
                              </InputAdornment>
                            ) : null
                          }}
                        />
                        <Button
                          sx={{ mt: 2 }}
                          size='medium'
                          fullWidth
                          variant='contained'
                          disabled={fieldState?.postalCode == null || fieldState?.error != null}
                          color='primary'
                          onClick={handleLookupPostCode}
                        >
                          <IconifyIcon width='16' style={{ padding: 0 }} icon='tabler:search' />
                          Look up postcode
                        </Button>
                      </>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} textAlign='left'></Grid>
                </Grid>
              </Card>
            </Grid>

            <StyledGrid item xs={12} md={6}>
              <Img alt='' src={`/images/banners/banner-12.jpg`} />
            </StyledGrid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}
