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
  CardHeader,
  Typography,
  FormHelperText,
  Divider,
  CardContent,
  FormGroup,
  Checkbox,
  FormLabel,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import {
  getFeaturesAPI,
  getUtilitiesAPI,
  getFileAPI,
  getGlobalParametersAPI,
  getRoleMasterAPI,
  getUsingAndPlanningAPI
} from 'src/configs'
import { useEffect, useRef, useState } from 'react'
import { statusOptions, setStatusOptions } from './static-data'
import {
  countryISO,
  dateConvert,
  getGlobalParametersLOV,
  getGlobalParametersLOV_W2P,
  validateFileFormat
} from 'src/@core/utils'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import Image from 'next/image'
import { Box, height } from '@mui/system'
import { grey, red } from '@mui/material/colors'
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
  handleDiscard,
  onSubmit,
  handleSubmit,
  errors,
  setError,
  clearErrors,
  pageTitle,
  file,
  setFile,
  CONTENT_TYPE_PICTURE_LINKS,
  setCONTENT_TYPE_PICTURE_LINKS,
  features,
  setFeatures,
  CUSTOM_FEATURES,
  setCUSTOM_FEATURES,
  utilities,
  setUtilities,
  usingPlanning,
  setUsingPlanning,
  watch,
  files,
  setFiles,
  PICTURE_LINKS,
  setPICTURE_LINKS,
  PLACE,
  setPLACE
}) => {
  const theme = useTheme()

  const [siteStatusOptions, setSiteStatusOptions] = useState([])
  const [listingStatusOptions, setListingStatusOptions] = useState([])
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])
  const [tenureOptions, setTenureOptions] = useState([])
  const [councilTaxBandOptions, setCouncilTaxBandOptions] = useState([])
  const [rentalFrequencyOptions, setRentalFrequencyOptions] = useState([])
  const [feeApplyOptions, setFeeApplyOptions] = useState([])
  const [bedroomsOptions, setBedroomsOptions] = useState([])
  const [bathroomsOptions, setBathroomsOptions] = useState([])
  const [receptionsOptions, setReceptionsOptions] = useState([])
  const [floorsOptions, setFloorsOptions] = useState([])
  const [unitsOptions, setUnitsOptions] = useState([])
  const [furnishedOptions, setFurnishedOptions] = useState([])
  const [contentTypeOptions, setContentTypeOptions] = useState([])
  const [featuresOptions, setFeaturesOptions] = useState([])
  const [featuresList, setFeaturesList] = useState([])
  const [utilitiesOptions, setUtilitiesOptions] = useState([])
  const [utilitiesList, setUtilitiesList] = useState([])
  const [usingPlanningOptions, setUsingPlanningOptions] = useState([])
  const [usingPlanningList, setUsingPlanningList] = useState([])
  const [summaryCount, setSummaryCount] = useState(255)
  const [lettingArrangementsCount, setLettingArrangementsCount] = useState(500)
  const [searchResult, setSearchResult] = useState('Result: none')
  const [searchState, setSearchState] = useState()
  const [mapParams, setMapParams] = useState({})

  const setSiteStatus = async () => {
    const data = await getGlobalParametersLOV('SITESTS')

    //Bind Site Status List
    if (data?.length > 0) {
      setSiteStatusOptions(data)
    }
  }

  const setListingStatus = async () => {
    const data = await getGlobalParametersLOV_W2P('LSTSTS', 2)

    //Bind Listing Status List
    if (data?.length > 0) {
      setListingStatusOptions(data)
    }
  }

  const setPropertyType = async () => {
    const data = await getGlobalParametersLOV('PROPTYPE')

    //Bind Property Type List
    if (data?.length > 0) {
      setPropertyTypeOptions(data)
    }
  }

  const setTenure = async () => {
    const data = await getGlobalParametersLOV('TENURE')

    //Bind Tenure List
    if (data?.length > 0) {
      setTenureOptions(data)
    }
  }

  const setCouncilTaxBand = async () => {
    const data = await getGlobalParametersLOV('CTB')

    //Bind Council Tax Band List
    if (data?.length > 0) {
      setCouncilTaxBandOptions(data)
    }
  }

  const setBedrooms = async () => {
    const data = await getGlobalParametersLOV('BEDROOMS')

    //Bind Bedrooms List
    if (data?.length > 0) {
      setBedroomsOptions(data)
    }
  }

  const setFeeApply = async () => {
    const data = await getGlobalParametersLOV('FEEAPLY')

    //Bind Fee Apply List
    if (data?.length > 0) {
      setFeeApplyOptions(data)
    }
  }

  const setBathrooms = async () => {
    const data = await getGlobalParametersLOV('BATHROOMS')

    //Bind Bathrooms List
    if (data?.length > 0) {
      setBathroomsOptions(data)
    }
  }

  const setReceptions = async () => {
    const data = await getGlobalParametersLOV('RECEP')

    //Bind Receptions List
    if (data?.length > 0) {
      setReceptionsOptions(data)
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

  const setFurnished = async () => {
    const data = await getGlobalParametersLOV('FURNISH')

    //Bind Furnished List
    if (data?.length > 0) {
      setFurnishedOptions(data)
    }
  }

  const setContentType = async () => {
    const data = await getGlobalParametersLOV('CONTTYPE')

    //Bind Units List
    if (data?.length > 0) {
      setContentTypeOptions(data)
    }
  }

  const bindFeatures = async () => {
    const response = await getFeaturesAPI({ ACTIVE: true, TYPE: 2 })

    const _featuresList = response?.data.map(i => ({
      ...i,
      checked: features?.length && Boolean(features?.find(x => x.FEATURES_ID === i.FEATURES_ID))
    }))
    setFeaturesList(_featuresList)

    //Bind Features List
    if (response?.data?.length > 0) {
      const data = response?.data.map(row => ({
        ...row,
        checked: features?.length && Boolean(features?.find(i => i.FEATURES_ID === row.FEATURES_ID))
      }))

      const _data = data.reduce((prev, curr) => {
        const rowPrev = prev.filter(a => a.FEATURES_TYPE_ID === curr.FEATURES_TYPE_ID)

        if (curr.FEATURES_TYPE_ID === null) {
          prev = [
            ...prev,
            {
              FEATURES_ID: curr.FEATURES_ID,
              FEATURES: curr.FEATURES,
              checked: curr.checked
            }
          ]
        } else {
          if (rowPrev?.length > 0 && rowPrev[0].FEATURES_TYPE_ID === curr.FEATURES_TYPE_ID) {
            rowPrev[0].detail = [
              ...rowPrev[0].detail,
              { FEATURES_ID: curr.FEATURES_ID, FEATURES: curr.FEATURES, checked: curr.checked }
            ]
          } else {
            prev = [
              ...prev,
              {
                FEATURES_TYPE_ID: curr.FEATURES_TYPE_ID,
                DESCRIPTION: curr.FEATURES_TYPE,
                detail: [{ FEATURES_ID: curr.FEATURES_ID, FEATURES: curr.FEATURES, checked: curr.checked }]
              }
            ]
          }
        }

        return prev
      }, [])
      setFeaturesOptions(_data)
    }
  }

  const bindUtilities = async () => {
    const response = await getUtilitiesAPI({ ACTIVE: true })

    const _utilitiesList = response?.data.map(i => ({
      ...i,
      checked: utilities?.length && Boolean(utilities?.find(x => x.UTILITY_ID === i.UTILITY_ID))
    }))
    setUtilitiesList(_utilitiesList)

    //Bind Utilities List
    if (response?.data?.length > 0) {
      const data = response?.data.map(row => ({
        ...row,
        checked: utilities?.length && Boolean(utilities?.find(i => i.UTILITY_ID === row.UTILITY_ID))
      }))

      const _data = data.reduce((prev, curr) => {
        const rowPrev = prev.filter(a => a.UTILITY_TYPE_ID === curr.UTILITY_TYPE_ID)

        if (curr.UTILITY_TYPE_ID === null) {
          prev = [
            ...prev,
            {
              UTILITY_ID: curr.UTILITY_ID,
              UTILITIES: curr.UTILITIES,
              checked: curr.checked
            }
          ]
        } else {
          if (rowPrev?.length > 0 && rowPrev[0].UTILITY_TYPE_ID === curr.UTILITY_TYPE_ID) {
            rowPrev[0].detail = [
              ...rowPrev[0].detail,
              { UTILITY_ID: curr.UTILITY_ID, UTILITIES: curr.UTILITIES, checked: curr.checked }
            ]
          } else {
            prev = [
              ...prev,
              {
                UTILITY_TYPE_ID: curr.UTILITY_TYPE_ID,
                DESCRIPTION: curr.UTILITY_TYPE,
                detail: [{ UTILITY_ID: curr.UTILITY_ID, UTILITIES: curr.UTILITIES, checked: curr.checked }]
              }
            ]
          }
        }

        return prev
      }, [])
      setUtilitiesOptions(_data)
    }
  }

  const bindUsingPlanning = async () => {
    const response = await getUsingAndPlanningAPI({ ACTIVE: true })

    const _usingPlanningList = response?.data.map(i => ({
      ...i,
      SELECT_VALUE: '0',
      checked: Boolean(usingPlanning?.find(x => x.UAP_ID === i.UAP_ID))
    }))
    setUsingPlanningList(_usingPlanningList)

    //Bind Using Planning List
    if (response?.data?.length > 0) {
      const data = response?.data.map(row => ({
        ...row,
        SELECT_VALUE: usingPlanning?.length ? usingPlanning?.find(i => i.UAP_ID === row.UAP_ID)?.SELECT_VALUE : '0',
        checked: usingPlanning?.length && Boolean(usingPlanning?.find(i => i.UAP_ID === row.UAP_ID))
      }))

      const _data = data.reduce((prev, curr) => {
        const rowPrev = prev.filter(a => a.UAP_TYPE_ID === curr.UAP_TYPE_ID)

        if (curr.UAP_TYPE_ID === null) {
          prev = [
            ...prev,
            {
              UAP_ID: curr.UAP_ID,
              DESCRIPTION: curr.DESCRIPTION,
              TOOLTIP_TEXT: curr.TOOLTIP_TEXT,
              FIELD_TYPE: curr.FIELD_TYPE,
              SELECT_VALUE: curr.SELECT_VALUE,
              checked: curr.checked
            }
          ]
        } else {
          if (rowPrev?.length > 0 && rowPrev[0].UAP_TYPE_ID === curr.UAP_TYPE_ID) {
            rowPrev[0].detail = [
              ...rowPrev[0].detail,
              {
                UAP_ID: curr.UAP_ID,
                DESCRIPTION: curr.DESCRIPTION,
                TOOLTIP_TEXT: curr.TOOLTIP_TEXT,
                FIELD_TYPE: curr.FIELD_TYPE,
                SELECT_VALUE: curr.SELECT_VALUE,
                checked: curr.checked
              }
            ]
          } else {
            prev = [
              ...prev,
              {
                UAP_TYPE_ID: curr.UAP_TYPE_ID,
                DESCRIPTION: curr.UAP_TYPE_DESC,
                detail: [
                  {
                    UAP_ID: curr.UAP_ID,
                    DESCRIPTION: curr.DESCRIPTION,
                    TOOLTIP_TEXT: curr.TOOLTIP_TEXT,
                    FIELD_TYPE: curr.FIELD_TYPE,
                    SELECT_VALUE: curr.SELECT_VALUE,
                    checked: curr.checked
                  }
                ]
              }
            ]
          }
        }

        return prev
      }, [])

      setUsingPlanningOptions(_data)
    }
  }

  const setRentalFrequency = async () => {
    const data = await getGlobalParametersLOV('RENTFREQ')

    //Bind Price Modifier List
    if (data?.length > 0) {
      setRentalFrequencyOptions(data)
    }
  }

  const initialized = async () => {
    setSiteStatus()
    setListingStatus()
    setPropertyType()
    setTenure()
    setCouncilTaxBand()
    setRentalFrequency()
    setFeeApply()
    setBedrooms()
    setBathrooms()
    setReceptions()
    setFloors()
    setUnits()
    setFurnished()
    bindFeatures()
    bindUtilities()
    bindUsingPlanning()
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
      setPLACE(formattedAddress)
      setValue('MAP_URL', mapUrl)
      setMapParams({
        LATITUDE: lat,
        LONGITUDE: lng,
        MAP_URL: mapUrl
      })
      setSearchState({ name, status, formattedAddress, mapUrl, lat, lng })
    } else {
      alert('Please enter text')
    }
  }

  const checkedFeatures = (event, item, FEATURES_TYPE_ID) => {
    let updateFeaturesList = []
    if (FEATURES_TYPE_ID) {
      const featuresOptionsDetail = featuresOptions.find(i => i.FEATURES_TYPE_ID === FEATURES_TYPE_ID)?.detail

      const featuresOptionUpdate = featuresOptionsDetail.map(i => {
        if (i.FEATURES_ID === item.FEATURES_ID) {
          const _featuresList = featuresList.find(it => it.FEATURES_ID === item.FEATURES_ID)
          updateFeaturesList = { ...featuresList, ...{ _featuresList, checked: event.target.checked } }

          return { ...i, checked: event.target.checked }
        } else {
          return i
        }
      })

      const updateFeaturesOptions = featuresOptions.map(i => {
        if (i.FEATURES_TYPE_ID === FEATURES_TYPE_ID) {
          return { ...i, detail: featuresOptionUpdate }
        } else {
          return i
        }
      })
      updateFeaturesList = featuresList.map(it => {
        if (it.FEATURES_ID === item.FEATURES_ID) {
          return { ...it, checked: event.target.checked }
        } else {
          return it
        }
      })
      setFeatures(updateFeaturesList.filter(i => i.checked === true))
      setFeaturesList(updateFeaturesList)

      setFeaturesOptions(updateFeaturesOptions)
    } else {
      const updateFeaturesOption = featuresOptions.map(i => {
        if (i.FEATURES_ID === item.FEATURES_ID) {
          return { ...i, checked: event.target.checked }
        } else {
          return i
        }
      })
      updateFeaturesList = featuresList.map(it => {
        if (it.FEATURES_ID === item.FEATURES_ID) {
          return { ...it, checked: event.target.checked }
        } else {
          return it
        }
      })
      setFeatures(updateFeaturesList.filter(i => i.checked === true))
      setFeaturesList(updateFeaturesList)
      setFeaturesOptions(updateFeaturesOption)
    }
  }

  const checkedAllFeatures = (checked, FEATURES_TYPE_ID) => {
    const featuresOptionsDetail = featuresOptions.find(i => i.FEATURES_TYPE_ID === FEATURES_TYPE_ID)?.detail
    let updateFeaturesList = []

    const featuresOptionUpdate = featuresOptionsDetail.map(i => {
      return { ...i, checked: checked }
    })

    const updateFeaturesOptions = featuresOptions.map(i => {
      if (i.FEATURES_TYPE_ID === FEATURES_TYPE_ID) {
        updateFeaturesList = featuresList.map(it => {
          if (it.FEATURES_TYPE_ID === i.FEATURES_TYPE_ID) {
            return { ...it, checked: checked }
          } else {
            return it
          }
        })

        return { ...i, detail: featuresOptionUpdate }
      } else {
        return i
      }
    })
    setFeatures(updateFeaturesList.filter(i => i.checked === true))
    setFeaturesList(updateFeaturesList)
    setFeaturesOptions(updateFeaturesOptions)
  }

  const isIndeterminate = FEATURES_TYPE_ID => {
    const _featuresOptionsDetail = featuresOptions.find(i => i.FEATURES_TYPE_ID === FEATURES_TYPE_ID)?.detail

    const total = _featuresOptionsDetail?.length

    const totalChecked = _featuresOptionsDetail?.filter(i => i.checked).length

    return total !== totalChecked && totalChecked > 0
  }

  const isCheckedAll = FEATURES_TYPE_ID => {
    const _featuresOptionsDetail = featuresOptions.find(i => i.FEATURES_TYPE_ID === FEATURES_TYPE_ID)?.detail

    const total = _featuresOptionsDetail?.length

    const totalChecked = _featuresOptionsDetail?.filter(i => i.checked).length

    return total === totalChecked
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

  const clearAdditionalFeatures = () => {
    setCUSTOM_FEATURES([])
  }

  const checkedUtilities = (event, item, UTILITY_TYPE_ID) => {
    let updateUtilitiesList = []
    if (UTILITY_TYPE_ID) {
      const utilitiesOptionsDetail = utilitiesOptions.find(i => i.UTILITY_TYPE_ID === UTILITY_TYPE_ID)?.detail

      const utilitiesOptionUpdate = utilitiesOptionsDetail.map(i => {
        if (i.UTILITY_ID === item.UTILITY_ID) {
          const _utilitiesList = utilitiesList.find(it => it.UTILITY_ID === item.UTILITY_ID)
          updateUtilitiesList = { ...utilitiesList, ...{ _utilitiesList, checked: event.target.checked } }

          return { ...i, checked: event.target.checked }
        } else {
          return i
        }
      })

      const updateUtilitiesOptions = utilitiesOptions.map(i => {
        if (i.UTILITY_TYPE_ID === UTILITY_TYPE_ID) {
          return { ...i, detail: utilitiesOptionUpdate }
        } else {
          return i
        }
      })
      updateUtilitiesList = utilitiesList.map(it => {
        if (it.UTILITY_ID === item.UTILITY_ID) {
          return { ...it, checked: event.target.checked }
        } else {
          return it
        }
      })
      setUtilities(updateUtilitiesList.filter(i => i.checked === true))
      setUtilitiesList(updateUtilitiesList)

      setUtilitiesOptions(updateUtilitiesOptions)
    } else {
      const updateUtilitiesOption = utilitiesOptions.map(i => {
        if (i.UTILITY_ID === item.UTILITY_ID) {
          return { ...i, checked: event.target.checked }
        } else {
          return i
        }
      })
      updateUtilitiesList = utilitiesList.map(it => {
        if (it.UTILITY_ID === item.UTILITY_ID) {
          return { ...it, checked: event.target.checked }
        } else {
          return it
        }
      })
      setUtilities(updateUtilitiesList.filter(i => i.checked === true))
      setUtilitiesList(updateUtilitiesList)
      setUtilitiesOptions(updateUtilitiesOption)
    }
  }

  const checkedUsingPlanning = (event, item, UAP_TYPE_ID) => {
    let updateUsingPlanningList = []
    if (UAP_TYPE_ID) {
      const usingPlanningOptionsDetail = usingPlanningOptions.find(i => i.UAP_TYPE_ID === UAP_TYPE_ID)?.detail

      const usingPlanningOptionUpdate = usingPlanningOptionsDetail.map(i => {
        if (i.UAP_ID === item.UAP_ID) {
          if (item.FIELD_TYPE === 2) {
            updateUsingPlanningList = usingPlanningList.map(it => {
              if (i.UAP_ID == it.UAP_ID) {
                return { ...it, checked: event.target.value != '0', SELECT_VALUE: event.target.value }
              } else {
                return it
              }
            })

            return { ...i, checked: event.target.value != '0', SELECT_VALUE: event.target.value }
          } else {
            updateUsingPlanningList = usingPlanningList.map(it => {
              if (i.UAP_ID == it.UAP_ID) {
                return { ...it, checked: event.target.checked }
              } else {
                return it
              }
            })

            return { ...i, checked: event.target.checked }
          }
        } else {
          return i
        }
      })

      const updateUsingPlanningOptions = usingPlanningOptions.map(i => {
        if (i.UAP_TYPE_ID === UAP_TYPE_ID) {
          return { ...i, detail: usingPlanningOptionUpdate }
        } else {
          return i
        }
      })
      updateUsingPlanningList = usingPlanningList.map(it => {
        if (it.UAP_ID === item.UAP_ID) {
          if (item.FIELD_TYPE === 2) {
            return { ...it, checked: event.target.value != '0', SELECT_VALUE: event.target.value }
          } else {
            return { ...it, checked: event.target.checked }
          }
        } else {
          return it
        }
      })

      const _updateUsingPlanningList = updateUsingPlanningList.filter(i => i.checked === true)
      setUsingPlanning(_updateUsingPlanningList)
      setUsingPlanningList(updateUsingPlanningList)

      setUsingPlanningOptions(updateUsingPlanningOptions)
    } else {
      const updateUsingPlanningOption = usingPlanningOptions.map(i => {
        if (i.UAP_ID === item.UAP_ID) {
          return { ...i, checked: event.target.checked }
        } else {
          return i
        }
      })
      updateUsingPlanningList = usingPlanningList.map(it => {
        if (it.UAP_ID === item.UAP_ID) {
          return { ...it, checked: event.target.checked }
        } else {
          return it
        }
      })
      setsingPlanning(updateUsingPlanningList.filter(i => i.checked === true))
      setsingPlanningList(updateUsingPlanningList)
      setsingPlanningOptions(updateUsingPlanningOption)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      {/* <Grid container spacing={3} mt={0}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Controller
              name='PROPERTY_ID'
              control={control}
              render={({ field: { value } }) => (
                <TextField
                  value={value}
                  disabled
                  variant='outlined'
                  label='PROPERTY ID'
                  placeholder='PROPERTY ID'
                  size='small'
                />
              )}
            />
          </FormControl>
        </Grid>
        Grid item xs={12} md={6}>
          <FormControl fullWidth size='small'>
            <Controller
              name='LISTING_TYPE_ID'
              control={control}
              rules={{
                required: 'Required'
              }}
              render={({ field, fieldState }) => {
                return (
                  <Autocomplete
                    size='small'
                    options={listingTypeOptions}
                    value={field.value?.value ? field.value : null}
                    getOptionLabel={option => option.label}
                    onChange={(_, data) => field.onChange(data)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='LISTING TYPE*'
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
      </Grid>*/}
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
                                    bgcolor: '#eee',
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
                                    bgcolor: '#eee',
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
                <Grid item xs={12} md={4}>
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
                {/* <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='TENURE_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={tenureOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='TENURE*'
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
                </Grid> */}
              </Grid>
              <Grid container my={3}>
                <Grid item xs={12} display='flex' justifyContent='left'>
                  <FormControl>
                    <Controller
                      name='RETIREMENT_HOME'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          label='RETIREMENT HOME'
                          value={value}
                          onChange={onChange}
                          control={<Checkbox color='secondary' checked={value} />}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} display='flex' justifyContent='left'>
                  <FormControl>
                    <Controller
                      name='SHARED_ACCOMMODATION'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          label='ROOM(S) SHARED ACCOMMODATION'
                          value={value}
                          onChange={onChange}
                          control={<Checkbox color='secondary' checked={value} />}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='left'>
                  <FormControl>
                    <Controller
                      name='SHORT_LET'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          label='SHORT LET'
                          value={value}
                          onChange={onChange}
                          control={<Checkbox color='secondary' checked={value} />}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='left'>
                  <FormControl>
                    <Controller
                      name='STUDENT_ACCEPTED'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          label='STUDENT ACCEPTED'
                          value={value}
                          onChange={onChange}
                          control={<Checkbox color='secondary' checked={value} />}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='COUNCIL_TAX_BAND_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={councilTaxBandOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField {...params} label='COUNCIL TAX BAND' variant='outlined' />
                            )}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} display='flex' justifyContent='left'>
                  <FormControl>
                    <Controller
                      name='ISEXEMPT'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          label='EXEMPT'
                          value={value}
                          onChange={onChange}
                          control={<Checkbox color='secondary' checked={value} />}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={3}></Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='Price' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='RENTAL_FREQUENCY_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={rentalFrequencyOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField {...params} label='RENTAL FREQUENCY' variant='outlined' />
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
            <CardHeader title='Administration' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='LETTING_ARRANGEMENTS'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          multiline
                          minRows={3}
                          inputProps={{ maxLength: 500 }}
                          label='LETTING ARRANGEMENTS'
                          onChange={onChange}
                          onKeyUp={e => setLettingArrangementsCount(500 - e.target.value.length)}
                          placeholder='PLEASE ENTER LETTING ARRANGEMENTS'
                          size='small'
                        />
                      )}
                    />
                    <FormLabel sx={{ fontSize: 12 }}>Characters remaining {lettingArrangementsCount}</FormLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='LETTINGS_DEPOSIT_PAYABLE'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 20 }}
                          label='LETTINGS DEPOSIT PAYABLE'
                          onChange={onChange}
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
                <Grid item xs={12}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='FEE_APPLY_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={feeApplyOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='FEE APPLY*'
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
                      name='BEDROOMS_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={bedroomsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='BEDROOMS*'
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
                      name='BATHROOMS_ID'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={bathroomsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='BATHROOMS*'
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
                      name='RECEPTIONS_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={receptionsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => <TextField {...params} label='RECEPTIONS' variant='outlined' />}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='SIZE'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 15 }}
                          label='SIZE'
                          onChange={onChange}
                          placeholder='PLEASE ENTER SIZE'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='UNITS_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={unitsOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => <TextField {...params} label='UNITS' variant='outlined' />}
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='FURNISHED_ID'
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={furnishedOptions}
                            value={field.value?.value ? field.value : null}
                            getOptionLabel={option => option.label}
                            onChange={(_, data) => field.onChange(data)}
                            renderInput={params => <TextField {...params} label='FURNISHED' variant='outlined' />}
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
                  <FormControl fullWidth>
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
            <CardHeader title='UTILITIES' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {utilitiesOptions.map((row, index) => {
                    return (
                      <Grid item sm={2} xs={12} key={index}>
                        <Typography fontWeight='bold' variant='subtitle1'>
                          {row.DESCRIPTION}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                          {row.detail.map((item, index2) => {
                            return (
                              <FormControlLabel
                                key={index2}
                                label={item.UTILITIES}
                                control={
                                  <Checkbox
                                    color='secondary'
                                    checked={item.checked}
                                    onChange={e => checkedUtilities(e, item, row.UTILITY_TYPE_ID)}
                                  />
                                }
                              />
                            )
                          })}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='USING AND PLANNING' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {usingPlanningOptions.map((row, index) => {
                    return (
                      <Grid item sm={3} xs={12} key={index}>
                        <Typography fontWeight='bold' variant='subtitle1'>
                          {row.DESCRIPTION}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                          {row.detail.map((item, index2) => {
                            return (
                              <FormControlLabel
                                key={index2}
                                control={
                                  item.FIELD_TYPE === 2 ? (
                                    <>
                                      <select
                                        value={item.SELECT_VALUE}
                                        style={{ width: '45px', padding: 0, marginRight: '9px' }}
                                        onChange={e => checkedUsingPlanning(e, item, row.UAP_TYPE_ID)}
                                      >
                                        <option value='0'></option>
                                        <option value='Y'>Yes</option>
                                        <option value='N'>No</option>
                                      </select>
                                      {item.DESCRIPTION}
                                      {item.TOOLTIP_TEXT?.length > 0 && (
                                        <Tooltip title={item.TOOLTIP_TEXT}>
                                          <Icon icon='tabler:help-circle-filled' />
                                        </Tooltip>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Checkbox
                                        color='secondary'
                                        checked={item.checked}
                                        onChange={e => checkedUsingPlanning(e, item, row.UAP_TYPE_ID)}
                                      />
                                      {item.DESCRIPTION}
                                    </>
                                  )
                                }
                              />
                            )
                          })}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <Controller
                  name='PLANNING_CONSIDERATIONS'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      inputProps={{ maxLength: 200 }}
                      label='PLANNING CONSIDERATIONS'
                      onChange={onChange}
                      placeholder='PLEASE ENTER PLANNING CONSIDERATIONS'
                      size='small'
                    />
                  )}
                />
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader title='FEATURES' sx={{ textDecoration: 'underline' }} />
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {featuresOptions.map((row, index) => {
                    return (
                      <Grid item xs={12} md={featuresOptions?.length < 4 ? 4 : 12} key={index}>
                        <FormControlLabel
                          label={
                            <Typography fontWeight='bold' variant='subtitle1'>
                              {row.DESCRIPTION}
                            </Typography>
                          }
                          control={
                            <Checkbox
                              color='secondary'
                              indeterminate={isIndeterminate(row.FEATURES_TYPE_ID)}
                              checked={isCheckedAll(row.FEATURES_TYPE_ID)}
                              onChange={e => checkedAllFeatures(e.target.checked, row.FEATURES_TYPE_ID)}
                            />
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                          {row.detail.map((item, index2) => {
                            return (
                              <FormControlLabel
                                key={index2}
                                label={item.FEATURES}
                                control={
                                  <Checkbox
                                    color='secondary'
                                    checked={item.checked}
                                    onChange={e => checkedFeatures(e, item, row.FEATURES_TYPE_ID)}
                                  />
                                }
                              />
                            )
                          })}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </FormControl>
              <Box mt={5}>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  Add Additional Features <small>(max 10)</small>
                </FormLabel>
                {CUSTOM_FEATURES?.length > 0 ? (
                  CUSTOM_FEATURES?.map((item, index) => (
                    <Box key={index} mb={2} display='flex' justifyContent='left' alignItems='center'>
                      <Typography sx={{ mr: 2, width: 20, textAlign: 'right' }}>{index + 1}.</Typography>
                      <TextField
                        size='small'
                        value={item.DESCRIPTION}
                        onChange={e => handleAdditionalFeatures(e, item)}
                        sx={{ maxWidth: 300 }}
                      />
                      {CUSTOM_FEATURES?.length > 1 && (
                        <IconButton color='error' onClick={() => removeAdditionalFeatures(item)}>
                          <Icon icon='tabler:circle-x-filled' />
                        </IconButton>
                      )}
                      {CUSTOM_FEATURES?.length === index + 1 && CUSTOM_FEATURES?.length < 10 && (
                        <Tooltip title='Add another feature'>
                          <IconButton
                            color={
                              Boolean(CUSTOM_FEATURES?.find(i => i.DESCRIPTION.trim()?.length === 0))
                                ? 'secondary'
                                : 'primary'
                            }
                            onClick={addAdditionalFeatures}
                            disabled={CUSTOM_FEATURES.find(i => i.DESCRIPTION.trim()?.length === 0)}
                          >
                            <Icon icon='tabler:circle-plus-filled' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box>
                    <Button variant='text' color='primary' onClick={addAdditionalFeatures}>
                      <Icon icon='tabler:circle-plus-filled' fontSize={20} style={{ marginRight: 5 }} /> Add Feature
                    </Button>
                  </Box>
                )}
                {CUSTOM_FEATURES?.length > 0 && (
                  <Button variant='text' color='error' onClick={clearAdditionalFeatures}>
                    <Icon icon='tabler:trash-filled' fontSize={20} style={{ marginRight: 5 }} /> Clear All
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardHeader
              title='EPC Rating Input'
              subheader='please provide current and potential EER(Energy Efficiency Ratio) ratings (value should be between 1 - 100)'
              sx={{ textDecoration: 'underline' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='CURRENT_ERR_RATING'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ min: 0, max: 100 }}
                          label='CURRENT ERR RATING'
                          onChange={onChange}
                          placeholder='PLEASE ENTER CURRENT ERR RATING'
                          size='small'
                          type='number'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='POTENTIAL_ERR_RATING'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ min: 0, max: 100 }}
                          label='POTENTIAL ERR RATING'
                          onChange={onChange}
                          placeholder='PLEASE ENTER POTENTIAL ERR RATING'
                          size='small'
                          type='number'
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
