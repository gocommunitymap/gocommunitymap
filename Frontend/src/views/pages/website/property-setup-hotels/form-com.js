import {
  Grid,
  FormControl,
  TextField,
  Autocomplete,
  InputLabel,
  FormControlLabel,
  Switch,
  Card,
  CardHeader,
  CardContent,
  FormLabel,
  IconButton,
  CircularProgress
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'

import { useEffect, useState } from 'react'
import {
  businessHotelsOptions,
  countryISO,
  getGlobalParametersLOV,
  getGlobalParametersLOV_W2P,
  getGlobalParametersLOV_W4P,
  getPostCode,
  GLOBAL_PARAMETER_TYPES,
  PROPERTY_MAIN_TYPES
} from 'src/@core/utils'
import { Box } from '@mui/system'
import { useTheme } from '@mui/material/styles'
import { Icon } from '@iconify/react'
import FileUploaderMultiple from './fileUploaderMultiple'
import FileUploaderSingle from './fileUploaderSingle'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'
import Map from 'src/views/components/map'

const placesLibrary = ['places']

export const ModalForm = ({
  control,
  states,
  setValue,
  onSubmit,
  handleSubmit,
  errors,
  file,
  setFile,
  CONTENT_TYPE_PICTURE_LINKS,
  setCONTENT_TYPE_PICTURE_LINKS,
  CUSTOM_FEATURES,
  setCUSTOM_FEATURES,
  watch,
  files,
  setFiles,
  PICTURE_LINKS,
  setPICTURE_LINKS,
  PLACE,
  setPLACE
}) => {
  const [siteStatusOptions, setSiteStatusOptions] = useState([])
  const [listingStatusOptions, setListingStatusOptions] = useState([])
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])
  const [priceModifierOptions, setPriceModifierOptions] = useState([])
  const [floorsOptions, setFloorsOptions] = useState([])
  const [unitsOptions, setUnitsOptions] = useState([])
  const [contentTypeOptions, setContentTypeOptions] = useState([])
  const [summaryCount, setSummaryCount] = useState(0)
  const [searchResult, setSearchResult] = useState('Result: none')

  const [mapParams, setMapParams] = useState({})

  const setSiteStatus = async () => {
    const data = await getGlobalParametersLOV('SITESTS')

    //Bind Site Status List
    if (data?.length > 0) {
      setSiteStatusOptions(data)
    }
  }

  const setListingStatus = async () => {
    const data = await getGlobalParametersLOV_W2P('LSTSTS', 1)

    //Bind Listing Status List
    if (data?.length > 0) {
      setListingStatusOptions(data)
    }
  }

  const setPropertyType = async () => {
    const data = await getGlobalParametersLOV_W4P(GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE, PROPERTY_MAIN_TYPES.COMMERCIAL)

    //Bind Property Type List
    if (data?.length > 0) {
      setPropertyTypeOptions(data)
    }
  }

  const setFloors = async () => {
    const data = await getGlobalParametersLOV('FLOORS')

    //Bind Floors List
    if (data?.length > 0) {
      setFloorsOptions(data)
    }
  }

  const setUnits = async () => {
    const data = await getGlobalParametersLOV('UNITS')

    //Bind Units List
    if (data?.length > 0) {
      setUnitsOptions(data)
    }
  }

  const setContentType = async () => {
    const data = await getGlobalParametersLOV('CONTTYPE')

    //Bind Units List
    if (data?.length > 0) {
      setContentTypeOptions(data)
    }
  }

  const setPriceModifier = async () => {
    const data = await getGlobalParametersLOV('PRICEMDFR')

    //Bind Price Modifier List
    if (data?.length > 0) {
      setPriceModifierOptions(data)
    }
  }

  const initialized = async () => {
    setSiteStatus()
    setListingStatus()
    setPropertyType()
    setPriceModifier()
    setFloors()
    setUnits()
    setContentType()
    setMapParams({
      LATITUDE: parseFloat(watch('LATITUDE')),
      LONGITUDE: parseFloat(watch('LONGITUDE')),
      MAP_URL: watch('MAP_URL')
    })
  }

  useEffect(() => {
    initialized()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states, PLACE])

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
      const postcode = getPostCode(place)

      const name = place.name
      const status = place.business_status
      const formattedAddress = place.formatted_address
      const location = place.geometry?.location

      const mapUrl = place.url
      const lat = location?.lat()
      const lng = location?.lng()
      setValue('LATITUDE', lat)
      setValue('LONGITUDE', lng)
      setValue('PLACE', formattedAddress)
      setValue('FULLPOSTCODE', postcode)
      setPLACE(formattedAddress)
      setValue('MAP_URL', mapUrl)
      setMapParams({
        LATITUDE: lat,
        LONGITUDE: lng,
        MAP_URL: mapUrl
      })
    } else {
      alert('Please enter text')
    }
  }

  const handleAdditionalFeatures = (e, item) => {
    const _CUSTOM_FEATURES = CUSTOM_FEATURES.map(i => {
      if (i.value === item.value) {
        return { ...i, DESCRIPTION: e.target.value }
      } else {
        return i
      }
    })
    setCUSTOM_FEATURES(_CUSTOM_FEATURES)
  }

  const addAdditionalFeatures = () => {
    setCUSTOM_FEATURES([...CUSTOM_FEATURES, { value: CUSTOM_FEATURES?.length + 1, DESCRIPTION: '' }])
  }

  const removeAdditionalFeatures = item => {
    const _CUSTOM_FEATURES = CUSTOM_FEATURES.filter(i => i.CUSTOM_FEATURES_ID !== item.CUSTOM_FEATURES_ID)
    if (_CUSTOM_FEATURES?.length === 0) {
      setCUSTOM_FEATURES([{ value: CUSTOM_FEATURES?.length + 1, DESCRIPTION: '' }])
    } else {
      setCUSTOM_FEATURES(_CUSTOM_FEATURES)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <Grid container spacing={3} mt={0}>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Status' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='SITE_STATUS_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={siteStatusOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='SITE STATUS*'
                                variant='outlined'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='LISTING_STATUS_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={listingStatusOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='LISTING STATUS*'
                                variant='outlined'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} display='flex' justifyContent='end'>
                  <InputLabel style={{ marginTop: 9, marginRight: 5 }}>ACTIVE</InputLabel>
                  <FormControl>
                    <Controller
                      name='ACTIVE'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          value={value}
                          onChange={onChange}
                          control={<Switch color='secondary' defaultChecked checked={value} />}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Address' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='FULLPOSTCODE'
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 20 }}
                          label='FULL POSTCODE*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER FULL POSTCODE'
                          size='small'
                          error={Boolean(errors.FULLPOSTCODE)}
                          helperText={Boolean(errors.FULLPOSTCODE) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='PROPERTY_NUM_NAME'
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          multiline
                          inputProps={{ maxLength: 250 }}
                          label='PROPERTY NAME*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER PROPERTY NAME'
                          size='small'
                          error={Boolean(errors.PROPERTY_NUM_NAME)}
                          helperText={Boolean(errors.PROPERTY_NUM_NAME) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='STREET_NAME'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          multiline
                          inputProps={{ maxLength: 250 }}
                          label='STREET NAME'
                          onChange={onChange}
                          placeholder='PLEASE ENTER PROPERTY STREET NAME'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='AREA_TOWN_CITY'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 50 }}
                          label='AREA,TOWN OR CITY'
                          onChange={onChange}
                          placeholder='PLEASE ENTER AREA,TOWN OR CITY'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='OWN_REF'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 150 }}
                          label='OWN REFERENCE'
                          onChange={onChange}
                          placeholder='PLEASE ENTER OWN REFERENCE'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Card variant='outlined'>
                    <CardHeader title='PLACE' sx={{ textDecoration: 'underline' }} />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          {isLoaded ? (
                            <>
                              <Controller
                                name='PLACE'
                                control={control}
                                render={({ field: { value, onChange } }) => (
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
                                      onChange={e => setPLACE(e.target.value)}
                                      value={PLACE}
                                    />
                                  </GAutocomplete>
                                )}
                              />
                              {mapParams?.LATITUDE > 0 ? (
                                <Card
                                  sx={{
                                    mt: 5,
                                    bgcolor: 'action.hover',
                                    width: 300,
                                    height: 200,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                  variant='outlined'
                                >
                                  <Map height={200} width={300} data={mapParams} />
                                </Card>
                              ) : (
                                <Card
                                  sx={{
                                    mt: 5,
                                    bgcolor: 'action.hover',
                                    width: 300,
                                    height: 200,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                  variant='outlined'
                                >
                                  <Icon icon='tabler:map-off' fontSize={40} />
                                </Card>
                              )}
                            </>
                          ) : (
                            <CircularProgress color='secondary' />
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Property Details' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='PROPERTY_TYPE_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={propertyTypeOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='PROPERTY TYPE*'
                                variant='outlined'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='BUSINESS_HOTELS'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            disableClearable
                            options={businessHotelsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => <TextField {...params} label='BUSINESS HOTELS' variant='outlined' />}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Price' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='PRICE_MODIFIER_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            disableClearable
                            options={priceModifierOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='PRICE MODIFIER'
                                variant='outlined'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='PRICE'
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 20 }}
                          label='PRICE*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER PRICE'
                          size='small'
                          type='number'
                          error={Boolean(errors.PRICE)}
                          helperText={Boolean(errors.PRICE) && 'Required'}
                          InputProps={{
                            startAdornment: '$'
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='PRICE_PER_UNIT'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 20 }}
                          label='PRICE PER UNIT'
                          onChange={onChange}
                          placeholder='PLEASE ENTER PRICE'
                          size='small'
                          type='number'
                          InputProps={{
                            startAdornment: '$'
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='MINIMUM_SIZE'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 20 }}
                          label='MINIMUM SIZE*'
                          onChange={onChange}
                          placeholder='PLEASE MINIMUM SIZE'
                          size='small'
                          type='number'
                          error={Boolean(errors.MINIMUM_SIZE)}
                          helperText={Boolean(errors.MINIMUM_SIZE) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='MAXIMUM_SIZE'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 20 }}
                          label='MAXIMUM SIZE'
                          onChange={onChange}
                          placeholder='PLEASE MAXIMUM SIZE'
                          size='small'
                          type='number'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='UNITS_ID'
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={unitsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='UNITS*'
                                variant='outlined'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Photos' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FileUploaderMultiple
                    files={files}
                    setFiles={setFiles}
                    PICTURE_LINKS={PICTURE_LINKS}
                    setPICTURE_LINKS={setPICTURE_LINKS}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Video/Virtual Tours' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='VIDEO_VIRTUALS_LINK'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 300 }}
                          label='VIDEO VIRTUAL LINK'
                          onChange={onChange}
                          placeholder='http://'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Description' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='FLOORS_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={floorsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => <TextField {...params} label='FLOORS' variant='outlined' />}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='SUMMARY'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          multiline
                          minRows={3}
                          inputProps={{ maxLength: 255 }}
                          label='SUMMARY'
                          onChange={onChange}
                          onKeyUp={e => setSummaryCount(255 - e.target.value.length)}
                          placeholder='PLEASE ENTER SUMMARY'
                          size='small'
                        />
                      )}
                    />
                    <FormLabel sx={{ fontSize: 12 }}>Characters remaining {summaryCount}</FormLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mt: 3 }}>
                    <Controller
                      name='FULLDESCRIPTION'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          multiline
                          minRows={5}
                          inputProps={{ maxLength: 2000 }}
                          label='FULL DESCRIPTION*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER FULL DESCRIPTION'
                          size='small'
                          error={Boolean(errors.FULLDESCRIPTION)}
                          helperText={Boolean(errors.FULLDESCRIPTION) && 'Required'}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='FEATURES' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <FormLabel>
                Add Additional Features <small>(max 10)</small>
              </FormLabel>
              {CUSTOM_FEATURES?.length &&
                CUSTOM_FEATURES?.map((item, index) => (
                  <Box key={index} mb={2} display='flex' justifyContent='left' alignItems='center'>
                    <TextField
                      fullWidth
                      size='small'
                      value={item.DESCRIPTION}
                      onChange={e => handleAdditionalFeatures(e, item)}
                    />
                    {CUSTOM_FEATURES?.length > 1 && (
                      <IconButton color='error' onClick={() => removeAdditionalFeatures(item)}>
                        <Icon icon='tabler:square-rounded-x-filled' />
                      </IconButton>
                    )}
                    {CUSTOM_FEATURES?.length === index + 1 && CUSTOM_FEATURES?.length < 10 && (
                      <IconButton
                        color='primary'
                        onClick={addAdditionalFeatures}
                        disabled={CUSTOM_FEATURES.find(i => i.DESCRIPTION.trim()?.length === 0)}
                      >
                        <Icon icon='tabler:square-rounded-plus-filled' />
                      </IconButton>
                    )}
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Content - Upload floor plan, EPC report etc.' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='CONTENT_TYPE_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={contentTypeOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => <TextField {...params} label='CONTENT TYPE' variant='outlined' />}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FileUploaderSingle
                    file={file}
                    setFile={setFile}
                    CONTENT_TYPE_PICTURE_LINKS={CONTENT_TYPE_PICTURE_LINKS}
                    setCONTENT_TYPE_PICTURE_LINKS={setCONTENT_TYPE_PICTURE_LINKS}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} display='flex' justifyContent='center'>
          <LoadingButton loading={states.isSubmit} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            {watch('PROPERTY_ID') !== null ? 'Update' : 'Save'}
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  )
}
