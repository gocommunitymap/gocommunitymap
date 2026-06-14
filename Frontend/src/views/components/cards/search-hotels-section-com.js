// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { Autocomplete, Checkbox, CircularProgress, FormControl, FormControlLabel, TextField } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { priceOptions } from 'src/configs'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'
import { useState } from 'react'
import { countryISO, jsonToQueryString } from 'src/@core/utils'
import { height } from '@mui/system'

const placesLibrary = ['places']

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
  zIndex: -1,
  height: '100%' /* Sets the image height to 100% of the container's height */,
  width: '100%',
  position: 'absolute' /* Allows positioning relative to the container */,
  objectFit: 'cover' /* Ensures the image covers the entire container */
}))

const defaultValues = {
  minPrice: priceOptions[0],
  maxPrice: priceOptions[0],
  newBuildHomesOnly: false,
  keywords: null
}

export const SearchHotelsSectionComCard = () => {
  // ** Hook
  const theme = useTheme()
  const { replace } = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const [searchResult, setSearchResult] = useState('Result: none')
  const [searchState, setSearchState] = useState()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries: placesLibrary
  })

  function onLoad(autocomplete) {
    setSearchResult(autocomplete)
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace()
      const name = place.name
      const status = place.business_status
      const formattedAddress = place.formatted_address

      setSearchState({ name, status, formattedAddress })
    } else {
      alert('Please enter text')
    }
  }

  const onSubmit = data => {
    const location = searchState?.formattedAddress ?? null
    const minPrice = data.minPrice.value
    const maxPrice = data.maxPrice.value
    let params = {}
    params = location !== null ? { ...params, location } : params
    params = minPrice !== '0' ? { ...params, minPrice } : params
    params = maxPrice !== '0' ? { ...params, maxPrice } : params

    const _params = jsonToQueryString(params)

    replace(`/com-hotels/properties${_params}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'transparent',
          minHeight: 350
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
                        Commercial Properties hotels
                      </Typography>
                      <Typography variant='subtitle2'>Search Commercial hotels in the UK.</Typography>
                    </Grid>
                    <Grid item xs={12} textAlign='left'>
                      <Typography variant='subtitle2'>Search area</Typography>
                      {isLoaded ? (
                        <GAutocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                          <TextField id='icons-start-adornment' size='medium' placeholder='Find Location' fullWidth />
                        </GAutocomplete>
                      ) : (
                        <CircularProgress color='secondary' />
                      )}
                    </Grid>
                    <Grid item xs={12} textAlign='left'>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <FormControl fullWidth size='small'>
                            <Controller
                              name='minPrice'
                              control={control}
                              render={({ field }) => {
                                return (
                                  <Autocomplete
                                    size='small'
                                    options={priceOptions}
                                    disableClearable
                                    value={field.value?.value ? field.value : null}
                                    getOptionLabel={option => option.label}
                                    onChange={(_, data) => field.onChange(data)}
                                    renderInput={params => (
                                      <TextField {...params} label='Min Price' variant='outlined' />
                                    )}
                                  />
                                )
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <FormControl fullWidth size='small'>
                            <Controller
                              name='maxPrice'
                              control={control}
                              render={({ field }) => {
                                return (
                                  <Autocomplete
                                    size='small'
                                    options={priceOptions}
                                    disableClearable
                                    value={field.value?.value ? field.value : null}
                                    getOptionLabel={option => option.label}
                                    onChange={(_, data) => field.onChange(data)}
                                    renderInput={params => (
                                      <TextField {...params} label='Max Price' variant='outlined' />
                                    )}
                                  />
                                )
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} textAlign='left'>
                      <Button variant='contained' size='medium' fullWidth type='submit'>
                        <IconifyIcon width='16' style={{ padding: 0 }} icon='tabler:search' />
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <StyledGrid item xs={12} md={6}>
                <Img alt='' src={`/images/Background.jpg`} />
              </StyledGrid>
            </Grid>
          </Box>
        </CardContent>
      </Box>
    </form>
  )
}
