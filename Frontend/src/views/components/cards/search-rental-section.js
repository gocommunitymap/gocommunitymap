// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { priceOptions } from 'src/configs'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import {
  countryISO,
  getGlobalParametersGroupsLOV,
  getOptionsByTypeCode,
  jsonToQueryString,
  GLOBAL_PARAMETER_TYPES
} from 'src/@core/utils'

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

export const SearchRentalSectionCard = ({ title, subtitle, filterState, setFilterState, setIsFiltered }) => {
  // ** Hook
  const theme = useTheme()
  const { replace } = useRouter()
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])
  const [bedroomsOptions, setBedroomsOptions] = useState([])

  const defaultValues = {
    minBeds: null,
    maxPrice: null,
    propertyType: 0,
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

  const loadSearchOptions = async () => {
    const globalParametersLOVData = await getGlobalParametersGroupsLOV(
      `${GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE},${GLOBAL_PARAMETER_TYPES.BEDROOMS}`
    )

    const propertyTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE)
    const bedrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BEDROOMS)

    //Bind Property Type List
    if (propertyTypes?.length > 0) {
      const propertyTypeData = propertyTypes.filter((v, i) => i < 5)
      propertyTypeData.push({ value: 0, label: 'Show all' })
      setPropertyTypeOptions(propertyTypeData.sort((a, b) => a.value - b.value).filter((v, i) => i < 5))
    }

    //Bind Bedrooms List
    if (bedrooms?.length > 0) {
      const bedroomsData = [...bedrooms, { value: '0', label: 'No Limit' }]
      setBedroomsOptions(bedroomsData.sort((a, b) => a.value - b.value))
    }
  }

  useEffect(() => {
    loadSearchOptions()
    setValue('minBeds', { value: '0', label: 'No Limit' })
    setValue('maxPrice', { value: '0', label: 'No Limit' })
    setValue('propertyType', propertyTypeOptions[0])
  }, [])

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
    const minBeds = data.minBeds.value
    const maxPrice = data.maxPrice.value
    const propertyType = data.propertyType

    let params = {}
    params = location !== null ? { ...params, location } : params
    params = minBeds !== '0' ? { ...params, minBeds } : params
    params = maxPrice !== '0' ? { ...params, maxPrice } : params
    params = { ...params, propertyType }
    const _params = jsonToQueryString(params)

    replace(`/rentals/properties${_params}`)
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
                      <Typography variant='subtitle2'>{subtitle}</Typography>
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
                              name='minBeds'
                              control={control}
                              render={({ field }) => {
                                return (
                                  <Autocomplete
                                    size='small'
                                    options={bedroomsOptions}
                                    disableClearable
                                    defaultValue={bedroomsOptions[0]}
                                    value={field.value?.value ? field.value : null}
                                    getOptionLabel={option => option.label}
                                    onChange={(_, data) => field.onChange(data)}
                                    renderInput={params => (
                                      <TextField {...params} label='Min Beds' variant='outlined' />
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
                        <Grid item xs={12} sm={12}>
                          <InputLabel id='propertyType-label'>Property Type</InputLabel>
                          <FormControl fullWidth size='small' variant='filled'>
                            <RadioGroup row aria-label='propertyType' name='propertyTypeG'>
                              {propertyTypeOptions.map(item => (
                                <Controller
                                  key={item.value}
                                  name='propertyType'
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field: { value, onChange } }) => (
                                    <FormControlLabel
                                      value={item.value}
                                      onChange={onChange}
                                      control={<Radio color='secondary' checked={item.value == value} />}
                                      label={item.label}
                                    />
                                  )}
                                />
                              ))}
                            </RadioGroup>
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
