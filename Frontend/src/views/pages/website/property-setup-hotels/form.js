import {
  Grid,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  InputLabel,
  InputAdornment,
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
  Select,
  MenuItem,
  Tooltip,
  Chip
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import {
  getFeaturesAPI,
  getUtilitiesAPI,
  getUsingAndPlanningAPI,
  getFileAPI,
  getGlobalParametersAPI,
  getRoleMasterAPI,
  GetPlacesByPostCodeAPI
} from 'src/configs'
import { useEffect, useRef, useState } from 'react'
import { statusOptions, setStatusOptions } from './static-data'
import {
  countryISO,
  dateConvert,
  getGlobalParametersGroupsLOV,
  getGlobalParametersLOV_W2P,
  getOptionsByTypeCode,
  getPostCode,
  validateFileFormat,
  GLOBAL_PARAMETER_TYPES,
  POPULAR_COUNTRIES,
  POPULAR_REGIONS
} from 'src/@core/utils'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import Image from 'next/image'
import { Box } from '@mui/system'
import { grey, red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material'
import { Icon } from '@iconify/react'
import FileUploaderMultiple from './fileUploaderMultiple'
import FileUploaderSingle from './fileUploaderSingle'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'
import Map from 'src/views/components/map'
import HotelDetailsSection from './HotelDetailsSection'
import RoomDetailSection from './RoomDetailSection'

const placesLibrary = ['places']

// ─── Section card helpers (use theme colors from caller) ────────────────────
const sectionCard = color => ({
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  border: `1px solid ${alpha(color, 0.18)}`
})

const sectionHeader = color => ({
  px: 3,
  pt: 3,
  pb: 1,
  background: `linear-gradient(135deg, ${alpha(color, 0.06)} 0%, transparent 60%)`
})

const sectionInner = color => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 2,
  p: 2.5,
  mb: 3,
  borderRadius: 2,
  background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
  borderLeft: `4px solid ${color}`
})

const sectionIconBox = color => ({
  width: 40,
  height: 40,
  borderRadius: 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(color, 0.12),
  flexShrink: 0
})

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
  setPLACE,
  submitRef,
  NEARBY_PLACES,
  setNEARBY_PLACES,
  PROPERTY_FAQS,
  setPROPERTY_FAQS,
  PROPERTY_RULES,
  setPROPERTY_RULES,
  propertyId
}) => {
  const theme = useTheme()

  const [siteStatusOptions, setSiteStatusOptions] = useState([])
  const [listingStatusOptions, setListingStatusOptions] = useState([])
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])
  const [tenureOptions, setTenureOptions] = useState([])
  const [councilTaxBandOptions, setCouncilTaxBandOptions] = useState([])
  const [priceModifierOptions, setPriceModifierOptions] = useState([])
  const [bedroomsOptions, setBedroomsOptions] = useState([])
  const [bathroomsOptions, setBathroomsOptions] = useState([])
  const [receptionsOptions, setReceptionsOptions] = useState([])
  const [floorsOptions, setFloorsOptions] = useState([])
  const [unitsOptions, setUnitsOptions] = useState([])
  const [contentTypeOptions, setContentTypeOptions] = useState([])
  const [bedTypeOptions, setBedTypeOptions] = useState([])
  const [featuresOptions, setFeaturesOptions] = useState([])
  const [featuresList, setFeaturesList] = useState([])
  const [utilitiesOptions, setUtilitiesOptions] = useState([])
  const [utilitiesList, setUtilitiesList] = useState([])
  const [usingPlanningOptions, setUsingPlanningOptions] = useState([])
  const [usingPlanningList, setUsingPlanningList] = useState([])
  const [summaryCount, setSummaryCount] = useState(0)
  const [searchResult, setSearchResult] = useState('Result: none')
  const [searchState, setSearchState] = useState()
  const [mapParams, setMapParams] = useState({})

  const loadGlobalParameterOptions = async () => {
    const globalParametersLOVData = await getGlobalParametersGroupsLOV(
      `${GLOBAL_PARAMETER_TYPES.SITE_STATUS},${GLOBAL_PARAMETER_TYPES.ROOM_TYPE},${GLOBAL_PARAMETER_TYPES.TENURE},${GLOBAL_PARAMETER_TYPES.COUNCIL_TAX_BAND},${GLOBAL_PARAMETER_TYPES.BEDROOMS},${GLOBAL_PARAMETER_TYPES.BATHROOMS},${GLOBAL_PARAMETER_TYPES.RECEPTIONS},${GLOBAL_PARAMETER_TYPES.FLOORS},${GLOBAL_PARAMETER_TYPES.UNITS},${GLOBAL_PARAMETER_TYPES.CONTENT_TYPE},${GLOBAL_PARAMETER_TYPES.BED_TYPE},${GLOBAL_PARAMETER_TYPES.PRICE_MODIFIER}`
    )

    const siteStatuses = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.SITE_STATUS)
    const roomTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.ROOM_TYPE)
    const tenures = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.TENURE)
    const councilTaxBands = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.COUNCIL_TAX_BAND)
    const bedrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BEDROOMS)
    const bathrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BATHROOMS)
    const receptions = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.RECEPTIONS)
    const floors = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.FLOORS)
    const units = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.UNITS)
    const contentTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.CONTENT_TYPE)
    const bedTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BED_TYPE)
    const priceModifiers = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.PRICE_MODIFIER)

    if (siteStatuses?.length > 0) setSiteStatusOptions(siteStatuses)
    if (roomTypes?.length > 0) setPropertyTypeOptions(roomTypes)
    if (tenures?.length > 0) setTenureOptions(tenures)
    if (councilTaxBands?.length > 0) setCouncilTaxBandOptions(councilTaxBands)
    if (bedrooms?.length > 0) setBedroomsOptions(bedrooms)
    if (bathrooms?.length > 0) setBathroomsOptions(bathrooms)
    if (receptions?.length > 0) setReceptionsOptions(receptions)
    if (floors?.length > 0) setFloorsOptions(floors)
    if (units?.length > 0) setUnitsOptions(units)
    if (contentTypes?.length > 0) setContentTypeOptions(contentTypes)
    if (bedTypes?.length > 0) setBedTypeOptions(bedTypes)
    if (priceModifiers?.length > 0) setPriceModifierOptions(priceModifiers)
  }

  const setListingStatus = async () => {
    const data = await getGlobalParametersLOV_W2P('LSTSTS', 1)

    //Bind Listing Status List
    if (data?.length > 0) {
      setListingStatusOptions(data)
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

  const initialized = async () => {
    loadGlobalParameterOptions()
    setListingStatus()
    bindFeatures()
    bindUtilities()
    bindUsingPlanning()
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
      const country = place.address_components?.find(component => component.types.includes('country'))?.long_name

      const province = place.address_components?.find(component =>
        component.types.includes('administrative_area_level_1')
      )?.long_name
      const city = place.address_components?.find(component => component.types.includes('locality'))?.long_name

      const postCode = place ? getPostCode(place) : null

      // Extract street name and area/town/city from address components
      let streetNumber = ''
      let route = ''
      let locality = ''
      let postalTown = ''
      let sublocality = ''
      if (place.address_components?.length > 0) {
        for (const component of place.address_components) {
          if (component.types.includes('street_number')) streetNumber = component.long_name
          if (component.types.includes('route')) route = component.long_name
          if (component.types.includes('locality')) locality = component.long_name
          if (component.types.includes('postal_town')) postalTown = component.long_name
          if (component.types.includes('sublocality_level_1')) sublocality = component.long_name
        }
      }
      const streetName = [streetNumber, route].filter(Boolean).join(' ')
      const areaTownCity = locality || postalTown || sublocality || ''

      const mapUrl = place.url
      const lat = location?.lat()
      const lng = location?.lng()
      setValue('LATITUDE', lat)
      setValue('LONGITUDE', lng)
      setValue('PLACE', formattedAddress)
      setValue('COUNTRY', country)
      setValue('PROVINCE', province)
      setValue('CITY', city)
      setPLACE(formattedAddress)
      setValue('FULLPOSTCODE', postCode || '')
      setValue('MAP_URL', mapUrl)
      setValue('PROPERTY_NUM_NAME', name || '')
      setValue('STREET_NAME', streetName || '')
      setValue('AREA_TOWN_CITY', areaTownCity || '')
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
    <>
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
          <Card sx={sectionCard(theme.palette.primary.main)}>
            <Box sx={sectionHeader(theme.palette.primary.main)}>
              <Box sx={sectionInner(theme.palette.primary.main)}>
                <Box sx={sectionIconBox(theme.palette.primary.main)}>
                  <Icon icon='tabler:toggle-right' style={{ fontSize: 22, color: theme.palette.primary.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Listing Status
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Control visibility, publishing status and active state of this hotel listing
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
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
                {/* <Grid item xs={12} md={5}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='LISTING_STATUS_ID'
                      control={control}
                      // rules={{
                      //   required: 'Required'
                      // }}
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
                </Grid> */}
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
                          control={<Switch color='primary' defaultChecked checked={value} />}
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
          <Card sx={sectionCard(theme.palette.secondary.main)}>
            <Box sx={sectionHeader(theme.palette.secondary.main)}>
              <Box sx={sectionInner(theme.palette.secondary.main)}>
                <Box sx={sectionIconBox(theme.palette.secondary.main)}>
                  <Icon icon='tabler:world' style={{ fontSize: 22, color: theme.palette.secondary.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Guest Demographics
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Indicate the most common guest origins — used for analytics and personalised marketing
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                {/* Popular Guest Countries */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel shrink>Popular Guest Countries</InputLabel>
                    <Controller
                      name='POPULAR_COUNTRIES'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          displayEmpty
                          notched
                          size='small'
                          label='Popular Guest Countries'
                          value={Array.isArray(field.value) ? (field.value.includes('all') ? [] : field.value) : []}
                          onChange={e => {
                            const selected = e.target.value
                            if (selected.includes('__ALL_COUNTRIES__')) {
                              field.onChange(field.value?.includes('all') ? [] : ['all'])
                            } else {
                              field.onChange(selected)
                            }
                          }}
                          sx={{ borderRadius: 1 }}
                          renderValue={_selected => {
                            const isAll = field.value?.includes('all')

                            const selected = isAll
                              ? POPULAR_COUNTRIES.map(o => o.value)
                              : Array.isArray(field.value)
                              ? field.value
                              : []

                            return selected?.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {isAll ? (
                                  <Chip label='ALL COUNTRIES' size='small' sx={{ height: 20, fontSize: 11 }} />
                                ) : (
                                  selected.map(val => {
                                    const opt = POPULAR_COUNTRIES.find(o => o.value === val)

                                    return (
                                      <Chip
                                        key={val}
                                        label={opt?.label ?? val}
                                        size='small'
                                        sx={{ height: 20, fontSize: 11 }}
                                      />
                                    )
                                  })
                                )}
                              </Box>
                            ) : (
                              <Typography color='text.disabled' variant='body2'>
                                Select countries…
                              </Typography>
                            )
                          }}
                        >
                          <MenuItem value='__ALL_COUNTRIES__'>
                            <Checkbox checked={field.value?.includes('all')} indeterminate={false} size='small' />
                            <Typography variant='body2' fontWeight={600}>
                              Select All
                            </Typography>
                          </MenuItem>
                          <Divider />
                          {POPULAR_COUNTRIES.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>
                              <Checkbox
                                checked={field.value?.includes('all') || field.value?.includes(opt.value)}
                                size='small'
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon
                                  icon='tabler:flag'
                                  style={{ fontSize: 16, color: theme.palette.secondary.main }}
                                />
                                <Typography variant='body2'>{opt.label}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Regions */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel shrink>Regions</InputLabel>
                    <Controller
                      name='POPULAR_REGIONS'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          displayEmpty
                          notched
                          size='small'
                          label='Regions'
                          value={Array.isArray(field.value) ? (field.value.includes('all') ? [] : field.value) : []}
                          onChange={e => {
                            const selected = e.target.value
                            if (selected.includes('__ALL_REGIONS__')) {
                              field.onChange(field.value?.includes('all') ? [] : ['all'])
                            } else {
                              field.onChange(selected)
                            }
                          }}
                          sx={{ borderRadius: 1 }}
                          renderValue={_selected => {
                            const isAll = field.value?.includes('all')

                            const selected = isAll
                              ? POPULAR_REGIONS.map(o => o.value)
                              : Array.isArray(field.value)
                              ? field.value
                              : []

                            return selected?.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {isAll ? (
                                  <Chip label='ALL REGIONS' size='small' sx={{ height: 20, fontSize: 11 }} />
                                ) : (
                                  selected.map(val => {
                                    const opt = POPULAR_REGIONS.find(o => o.value === val)

                                    return (
                                      <Chip
                                        key={val}
                                        label={opt?.label ?? val}
                                        size='small'
                                        sx={{ height: 20, fontSize: 11 }}
                                      />
                                    )
                                  })
                                )}
                              </Box>
                            ) : (
                              <Typography color='text.disabled' variant='body2'>
                                Select regions…
                              </Typography>
                            )
                          }}
                        >
                          <MenuItem value='__ALL_REGIONS__'>
                            <Checkbox checked={field.value?.includes('all')} indeterminate={false} size='small' />
                            <Typography variant='body2' fontWeight={600}>
                              Select All
                            </Typography>
                          </MenuItem>
                          <Divider />
                          {POPULAR_REGIONS.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>
                              <Checkbox
                                checked={field.value?.includes('all') || field.value?.includes(opt.value)}
                                size='small'
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon
                                  icon='tabler:map-pin'
                                  style={{ fontSize: 16, color: theme.palette.secondary.main }}
                                />
                                <Typography variant='body2'>{opt.label}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.info.main)}>
            <Box sx={sectionHeader(theme.palette.info.main)}>
              <Box sx={sectionInner(theme.palette.info.main)}>
                <Box sx={sectionIconBox(theme.palette.info.main)}>
                  <Icon icon='tabler:map-pin' style={{ fontSize: 22, color: theme.palette.info.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Address & Location
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Property address and map pin — used for guest directions and map listing
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant='outlined'>
                    <CardHeader title='PLACE' sx={{ py: 0, textDecoration: 'underline' }} />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              {isLoaded && (
                                <Controller
                                  name='PLACE'
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <GAutocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                                      <TextField
                                        id='icons-start-adornment'
                                        size='medium'
                                        placeholder='Find Location'
                                        fullWidth
                                        sx={{ maxWidth: 600 }}
                                        onChange={e => setPLACE(e.target.value)}
                                        value={PLACE}
                                      />
                                    </GAutocomplete>
                                  )}
                                />
                              )}
                            </Grid>
                            <Grid item xs={12}>
                              {isLoaded ? (
                                <>
                                  {mapParams?.LATITUDE > 0 ? (
                                    <Card
                                      sx={{
                                        mt: 5,
                                        bgcolor: '#eee',
                                        width: '100%',
                                        height: 200,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                      }}
                                      variant='outlined'
                                    >
                                      <Map height={200} width={'100%'} data={mapParams} />
                                    </Card>
                                  ) : (
                                    <Card
                                      sx={{
                                        mt: 5,
                                        bgcolor: '#eee',
                                        width: '100%',
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
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} pb={10}>
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
                                      label='HOTEL NAME*'
                                      onChange={onChange}
                                      placeholder='PLEASE ENTER HOTEL NAME'
                                      size='small'
                                      error={Boolean(errors.PROPERTY_NUM_NAME)}
                                      helperText={Boolean(errors.PROPERTY_NUM_NAME) && 'Required'}
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
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
                                      sx={{ maxWidth: 265 }}
                                      inputProps={{ maxLength: 20 }}
                                      label='POSTAL CODE*'
                                      onChange={onChange}
                                      placeholder='PLEASE ENTER POSTAL CODE'
                                      size='small'
                                      error={Boolean(errors.FULLPOSTCODE)}
                                      helperText={Boolean(errors.FULLPOSTCODE) && 'Required'}
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* <Grid item md={4} xs={12}>
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
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Room Details, Pricing, Photos, Video, and Description moved to the Rooms panel below ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.error.main)}>
            <Box sx={sectionHeader(theme.palette.error.main)}>
              <Box sx={sectionInner(theme.palette.error.main)}>
                <Box sx={sectionIconBox(theme.palette.error.main)}>
                  <Icon icon='tabler:photo' style={{ fontSize: 22, color: theme.palette.error.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Photos
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Upload high-quality photos — listings with 10+ photos receive significantly more bookings
                  </Typography>
                </Box>
              </Box>
            </Box>
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
          <Card sx={sectionCard(theme.palette.warning.main)}>
            <Box sx={sectionHeader(theme.palette.warning.main)}>
              <Box sx={sectionInner(theme.palette.warning.main)}>
                <Box sx={sectionIconBox(theme.palette.warning.main)}>
                  <Icon icon='tabler:sparkles' style={{ fontSize: 22, color: theme.palette.warning.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Amenities & Features
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Select all amenities that apply — guests filter by these on the search results page
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {featuresOptions.map((row, index) => {
                    return (
                      <Grid item xs={12} md={3} key={index}>
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
              <FormLabel>
                Add Additional Features <small>(max 10)</small>
              </FormLabel>
              {CUSTOM_FEATURES?.length &&
                CUSTOM_FEATURES?.map((item, index) => (
                  <Box key={index} mb={2} display='flex' justifyContent='left' alignItems='center'>
                    <TextField
                      size='small'
                      value={item.DESCRIPTION}
                      onChange={e => handleAdditionalFeatures(e, item)}
                      sx={{ maxWidth: 300 }}
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
        {/* <Grid item xs={12}>
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
        </Grid> */}
        {/* ── Hotel Details Section ── */}
        <Grid item xs={12}>
          <HotelDetailsSection
            control={control}
            errors={errors}
            NEARBY_PLACES={NEARBY_PLACES}
            setNEARBY_PLACES={setNEARBY_PLACES}
            PROPERTY_FAQS={PROPERTY_FAQS}
            setPROPERTY_FAQS={setPROPERTY_FAQS}
            PROPERTY_RULES={PROPERTY_RULES}
            setPROPERTY_RULES={setPROPERTY_RULES}
          />
        </Grid>

        {/* ── Rooms Panel (master-detail) ── */}
        <Grid item xs={12}>
          <RoomDetailSection propertyId={propertyId} />
        </Grid>

        {/* <Grid item xs={12} display='flex' justifyContent='center'>
          <LoadingButton
            ref={submitRef}
            loading={states.isSubmit}
            size='large'
            type='submit'
            sx={{ mr: 2 }}
            variant='contained'
          >
            {watch('PROPERTY_ID') !== null ? 'Update' : 'Save'}
          </LoadingButton>
        </Grid> */}
      </Grid>
    </>
  )
}
