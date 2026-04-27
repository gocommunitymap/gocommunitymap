// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { CircularProgress, FormControl, TextField } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'
import { useState } from 'react'
import { countryISO, jsonToQueryString } from 'src/@core/utils'
import { CustomTab } from '../tab/custom-tab'

const placesLibrary = ['places']

// Styled Grid component
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

export const SearchHousePriceCard = ({ title, subtitle, filterState, setFilterState, setIsFiltered }) => {
  // ** Hook
  const theme = useTheme()
  const { replace } = useRouter()
  const [tabValue, setTabValue] = useState('1')

  const defaultValues = {
    keywords: null
  }

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

    let params = {}
    if (tabValue === '1') {
      params = data.FULLPOSTCODE !== null ? { ...params, postalcode: data.FULLPOSTCODE } : params
    } else {
      params = location !== null ? { ...params, location } : params
    }

    const _params = jsonToQueryString(params)

    replace(`/houseprice/properties${_params}`)
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
                        {title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} textAlign='left'>
                      <CustomTab
                        setTabValue={setTabValue}
                        data={[
                          {
                            value: '1',
                            label: 'Property search',
                            children: (
                              <Grid container spacing={3}>
                                <Grid item xs={12} textAlign='left'>
                                  <Typography variant='subtitle2'>
                                    See how much it last sold for and what it’s worth today.
                                  </Typography>

                                  <Typography variant='subtitle2'>Enter a full UK postcode</Typography>
                                  <FormControl fullWidth size='small'>
                                    <Controller
                                      name='FULLPOSTCODE'
                                      control={control}
                                      render={({ field: { value, onChange } }) => {
                                        return (
                                          <TextField
                                            value={value}
                                            onChange={onChange}
                                            placeholder='e.g. ABC 000'
                                            variant='outlined'
                                          />
                                        )
                                      }}
                                    />
                                  </FormControl>
                                </Grid>

                                <Grid item xs={12} textAlign='left'>
                                  <Button variant='contained' size='medium' fullWidth type='submit'>
                                    <IconifyIcon width='16' style={{ padding: 0 }} icon='tabler:search' />
                                    Search
                                  </Button>
                                </Grid>
                              </Grid>
                            )
                          },
                          {
                            value: '2',
                            label: 'Area Search',
                            children: (
                              <Grid container spacing={3}>
                                <Grid item xs={12} textAlign='left'>
                                  <Typography variant='subtitle2'>
                                    Check sold prices in a city, town or street.
                                  </Typography>
                                  <Typography variant='subtitle2'>Search area</Typography>
                                  {isLoaded ? (
                                    <GAutocomplete
                                      options={{
                                        componentRestrictions: { country: countryISO }
                                      }}
                                      onPlaceChanged={onPlaceChanged}
                                      onLoad={onLoad}
                                    >
                                      <TextField
                                        id='icons-start-adornment'
                                        size='medium'
                                        placeholder='Find Location'
                                        fullWidth
                                      />
                                    </GAutocomplete>
                                  ) : (
                                    <CircularProgress color='secondary' />
                                  )}
                                </Grid>
                                <Grid item xs={12} textAlign='left'>
                                  <Button variant='contained' size='medium' fullWidth type='submit'>
                                    <IconifyIcon width='16' style={{ padding: 0 }} icon='tabler:search' />
                                    Search
                                  </Button>
                                </Grid>
                              </Grid>
                            )
                          }
                        ]}
                      />
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
