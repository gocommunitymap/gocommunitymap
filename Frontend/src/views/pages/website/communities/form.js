import {
  Grid,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  InputLabel,
  FormControlLabel,
  Switch,
  Card,
  FormHelperText,
  Typography
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { getGlobalParametersAPI } from 'src/configs'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { grey } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { GLOBAL_PARAMETER_TYPES, POPULAR_COUNTRIES, validateFileFormat } from 'src/@core/utils'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'
import { toast } from 'react-hot-toast'

const placesLibrary = ['places']

export const ModalForm = ({
  control,
  states,
  setValue,
  handleDiscard,
  onSubmit,
  handleSubmit,
  errors,
  setError,
  clearErrors,
  pageTitle,
  setFile
}) => {
  const theme = useTheme()
  const [picture, setPicture] = useState('')
  const [locationAutocomplete, setLocationAutocomplete] = useState(null)
  const [regionOptions, setRegionOptions] = useState([])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries: placesLibrary
  })

  useEffect(() => {
    setPicture('')
    setLocationAutocomplete(null)
    getGlobalParametersAPI({ TYPE_CODE: GLOBAL_PARAMETER_TYPES.POPULAR_REGION, ALLOWED: true, ACTIVE: true }).then(
      response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }

        setRegionOptions(
          Array.isArray(response?.data)
            ? response.data.map(item => ({
                value: item.PARAMETER_CODE_3,
                label: item.PARAMETER_DESCRIPTION_3
              }))
            : []
        )
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.isOpenModal])

  const handleImageChange = event => {
    const reader = new FileReader()
    const files = event.target.files
    const selectedFile = files?.[0]

    if (!selectedFile) return

    const isValidFileFormat = validateFileFormat(selectedFile, 'image')
    if (!isValidFileFormat) {
      setError('PICTURE_LINK')

      return
    }

    setFile(selectedFile)
    reader.onload = () => setPicture(reader.result)
    reader.readAsDataURL(selectedFile)

    setValue('PICTURE_LINK', 'newFile')
    clearErrors('PICTURE_LINK')
  }

  const handleLocationLoad = autocomplete => {
    setLocationAutocomplete(autocomplete)
  }

  const handleLocationPlaceChanged = () => {
    if (!locationAutocomplete) return

    const place = locationAutocomplete.getPlace()
    const location = place?.formatted_address || place?.name || ''
    if (!location) return

    setValue('LOCATION', location)
    clearErrors('LOCATION')
  }

  return (
    <Modal
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
      modelMaxWidth={900}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} mt={0}>
          <Grid item xs={12} textAlign='center'>
            <Grid container spacing={3} mt={0}>
              <Grid item xs={12} textAlign='center'>
                <FormControl>
                  <Controller
                    name='PICTURE_LINK'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <Card
                        style={{
                          textAlign: 'center',
                          cursor: 'pointer',
                          width: 150,
                          height: 150,
                          zIndex: 5,
                          borderWidth: 1,
                          borderRightStyle: 'solid',
                          borderColor: errors.PICTURE_LINK && theme.palette.error.main
                        }}
                        variant='outlined'
                      >
                        <label htmlFor='communityImageButton'>
                          <Box>
                            <img
                              src={
                                picture?.length > 0
                                  ? picture
                                  : value?.length
                                  ? value
                                  : '/images/default/default-picture.png'
                              }
                              alt='community'
                              style={{ cursor: 'pointer' }}
                              width='100%'
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                zIndex: 10,
                                bottom: 1,
                                width: 148,
                                fontSize: 16,
                                py: 1,
                                borderRadius: 1,
                                backgroundColor: grey[100],
                                color: grey[500],
                                cursor: 'pointer'
                              }}
                            >
                              UPLOAD
                            </Box>
                          </Box>
                        </label>
                        <input
                          id='communityImageButton'
                          onChange={handleImageChange}
                          type='file'
                          hidden
                          accept='image/*'
                        />
                      </Card>
                    )}
                  />
                </FormControl>
                {errors.PICTURE_LINK && (
                  <FormHelperText error sx={{ textAlign: 'center' }}>
                    Required
                  </FormHelperText>
                )}
                <Typography variant='body2' fontSize={10} fontWeight='bold'>
                  Formats [.jpg, .jpeg, .png, .gif]
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='COMMUNITY_ID'
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value}
                        disabled
                        variant='outlined'
                        label='COMMUNITY ID (AUTO)'
                        placeholder='COMMUNITY ID'
                        size='small'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='COMMUNITY_NAME'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        multiline
                        inputProps={{ maxLength: 100 }}
                        label='NAME'
                        onChange={onChange}
                        placeholder='PLEASE ENTER COMMUNITY NAME'
                        size='small'
                        error={Boolean(errors.COMMUNITY_NAME)}
                        helperText={Boolean(errors.COMMUNITY_NAME) && 'Required'}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='LOCATION'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      const locationField = (
                        <TextField
                          value={value ?? ''}
                          inputProps={{ maxLength: 200 }}
                          label='LOCATION'
                          fullWidth
                          onChange={onChange}
                          placeholder='SEARCH LOCATION'
                          size='small'
                          error={Boolean(errors.LOCATION)}
                          helperText={Boolean(errors.LOCATION) && 'Required'}
                        />
                      )

                      return isLoaded ? (
                        <GAutocomplete onLoad={handleLocationLoad} onPlaceChanged={handleLocationPlaceChanged}>
                          {locationField}
                        </GAutocomplete>
                      ) : (
                        locationField
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='REGION'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        size='small'
                        options={regionOptions}
                        value={
                          regionOptions.find(item => item.label === field.value || item.value === field.value) || null
                        }
                        isOptionEqualToValue={(option, selected) => option.value === selected.value}
                        getOptionLabel={option => option.label}
                        onChange={(_, option) => field.onChange(option?.label || '')}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='REGION'
                            placeholder='SELECT REGION'
                            error={Boolean(errors.REGION)}
                            helperText={Boolean(errors.REGION) && 'Required'}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='COUNTRY_CODE'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        size='small'
                        options={POPULAR_COUNTRIES}
                        value={POPULAR_COUNTRIES.find(item => item.value === field.value) || null}
                        isOptionEqualToValue={(option, selected) => option.value === selected.value}
                        getOptionLabel={option => `${option.value} - ${option.label}`}
                        onChange={(_, option) => field.onChange(option?.value || '')}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='COUNTRY CODE'
                            placeholder='SELECT COUNTRY'
                            error={Boolean(errors.COUNTRY_CODE)}
                            helperText={Boolean(errors.COUNTRY_CODE) && 'Required'}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='MEMBERS'
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value ?? '0'}
                        inputProps={{ maxLength: 20 }}
                        label='MEMBERS'
                        disabled
                        fullWidth
                        size='small'
                        helperText='Display only'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3} mt={0}>
              <Grid item xs={12} display='flex' justifyContent='right'>
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

              <Grid item xs={12} display='flex' justifyContent='center'>
                <LoadingButton loading={states.isSubmit} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  {states.isEdit ? 'Update' : 'Save'}
                </LoadingButton>
                <Button type='reset' size='large' color='secondary' variant='outlined' onClick={handleDiscard}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
