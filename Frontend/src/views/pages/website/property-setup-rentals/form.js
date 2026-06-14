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
  CardContent,
  FormGroup,
  Checkbox,
  FormLabel,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  Typography,
  Divider
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
  getGlobalParametersGroupsLOV,
  getGlobalParametersLOV_Extended,
  getGlobalParametersLOV_W2P,
  getOptionsByTypeCode,
  getPostCode,
  validateFileFormat,
  POPULAR_COUNTRIES,
  POPULAR_REGIONS,
  GLOBAL_PARAMETER_TYPES
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

const placesLibrary = ['places']

// ─── Section card helpers ───────────────────────────────────────────────────
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

const FieldLabel = ({ label, required, help }) => (
  <Box sx={{ mb: 0.75 }}>
    <Typography variant='body2' fontWeight={600} color='text.primary' component='label'>
      {label}
      {required && (
        <Typography component='span' color='error' sx={{ ml: 0.4 }}>
          *
        </Typography>
      )}
    </Typography>
    {help && (
      <Typography variant='caption' color='text.disabled' sx={{ display: 'block', mt: 0.25 }}>
        {help}
      </Typography>
    )}
  </Box>
)

const StarRatingPicker = ({ value, onChange }) => {
  const theme = useTheme()
  const [hoverValue, setHoverValue] = useState(null)

  const active = hoverValue ?? value

  const getIcon = n => {
    if (active >= n) return 'tabler:star-filled'
    if (active >= n - 0.5) return 'tabler:star-half-filled'

    return 'tabler:star'
  }

  const handleMouseMove = (e, n) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isLeftHalf = e.clientX - rect.left < rect.width / 2
    setHoverValue(isLeftHalf ? n - 0.5 : n)
  }

  return (
    <Box>
      <FieldLabel label='Star Rating' help='Official star classification of the property' />
      <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <Box
            key={n}
            onClick={() => onChange(active === value ? null : active)}
            onMouseMove={e => handleMouseMove(e, n)}
            onMouseLeave={() => setHoverValue(null)}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', px: 0.25 }}
          >
            <Icon
              icon={getIcon(n)}
              style={{
                fontSize: 26,
                color: active >= n - 0.5 ? theme.palette.warning.main : theme.palette.action.disabled,
                transition: 'color 0.1s'
              }}
            />
          </Box>
        ))}
        {value && (
          <Box
            onClick={() => onChange(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              cursor: 'pointer',
              border: '1.5px dashed',
              borderColor: 'divider',
              '&:hover': { borderColor: 'error.main' }
            }}
          >
            <Typography variant='caption' color='text.disabled'>
              Clear
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

// ─── RulesList ──────────────────────────────────────────────────────────────
const RulesList = ({ PROPERTY_RULES, setPROPERTY_RULES }) => {
  const theme = useTheme()

  const handleChange = (index, field, value) => {
    setPROPERTY_RULES(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addRow = () => setPROPERTY_RULES(prev => [...prev, { RULE_ID: null, RULE: '', NOTE: '' }])

  const removeRow = index => {
    setPROPERTY_RULES(prev => {
      const filtered = prev.filter((_, i) => i !== index)

      return filtered.length > 0 ? filtered : [{ RULE_ID: null, RULE: '', NOTE: '' }]
    })
  }

  return (
    <Box>
      {PROPERTY_RULES.map((item, index) => (
        <Box
          key={item.RULE_ID || index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: alpha(theme.palette.background.default, 0.5),
            transition: 'border-color 0.15s',
            '&:hover': { borderColor: theme.palette.primary.light }
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: alpha(theme.palette.primary.main, 0.08),
              flexShrink: 0
            }}
          >
            <Typography variant='caption' fontWeight={700} color='primary'>
              {index + 1}
            </Typography>
          </Box>
          <TextField
            size='small'
            placeholder='Rule (e.g. Check-in)'
            value={item.RULE}
            onChange={e => handleChange(index, 'RULE', e.target.value)}
            sx={{ flex: '0 0 185px' }}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
          <TextField
            size='small'
            placeholder='Note (e.g. After 3:00 PM)'
            value={item.NOTE}
            onChange={e => handleChange(index, 'NOTE', e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <Tooltip title='Remove rule'>
              <IconButton size='small' color='error' onClick={() => removeRow(index)}>
                <Icon icon='tabler:trash' style={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {index === PROPERTY_RULES.length - 1 && (
              <Tooltip title='Add rule'>
                <IconButton size='small' color='primary' onClick={addRow} disabled={!item.RULE.trim()}>
                  <Icon icon='tabler:plus' style={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      ))}
      <Box
        onClick={() => {
          const last = PROPERTY_RULES[PROPERTY_RULES.length - 1]
          if (last?.RULE?.trim()) addRow()
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 1,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          border: '1.5px dashed',
          borderColor: 'divider',
          cursor: 'pointer',
          color: 'text.disabled',
          transition: 'all 0.15s',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
        }}
      >
        <Icon icon='tabler:plus' style={{ fontSize: 18 }} />
        <Typography variant='body2' fontWeight={500}>
          Add another rule
        </Typography>
      </Box>
    </Box>
  )
}

// ─── FaqsList ───────────────────────────────────────────────────────────────
const FaqsList = ({ PROPERTY_FAQS, setPROPERTY_FAQS }) => {
  const theme = useTheme()

  const handleChange = (index, field, value) => {
    setPROPERTY_FAQS(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addRow = () => setPROPERTY_FAQS(prev => [...prev, { FAQ_ID: null, QUESTION: '', ANSWER: '' }])

  const removeRow = index => {
    setPROPERTY_FAQS(prev => {
      const filtered = prev.filter((_, i) => i !== index)

      return filtered.length > 0 ? filtered : [{ FAQ_ID: null, QUESTION: '', ANSWER: '' }]
    })
  }

  return (
    <Box>
      {PROPERTY_FAQS.map((item, index) => (
        <Box
          key={item.FAQ_ID || index}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: alpha(theme.palette.background.default, 0.5),
            transition: 'border-color 0.15s',
            '&:hover': { borderColor: theme.palette.info.light }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.info.main, 0.1)
                }}
              >
                <Typography variant='caption' fontWeight={700} color='info.main' sx={{ fontSize: 10 }}>
                  {index + 1}
                </Typography>
              </Box>
              <Typography variant='body2' fontWeight={600} color='text.secondary'>
                FAQ {index + 1}
              </Typography>
            </Box>
            <Tooltip title='Remove FAQ'>
              <IconButton size='small' color='error' onClick={() => removeRow(index)}>
                <Icon icon='tabler:trash' style={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            fullWidth
            size='small'
            label='Question'
            placeholder='e.g. Is parking available?'
            value={item.QUESTION}
            onChange={e => handleChange(index, 'QUESTION', e.target.value)}
            sx={{ mb: 1.5 }}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
          <TextField
            fullWidth
            size='small'
            label='Answer'
            multiline
            rows={2}
            placeholder='e.g. Yes, free on-street parking is available.'
            value={item.ANSWER}
            onChange={e => handleChange(index, 'ANSWER', e.target.value)}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
        </Box>
      ))}
      <Box
        onClick={() => {
          const last = PROPERTY_FAQS[PROPERTY_FAQS.length - 1]
          if (last?.QUESTION?.trim()) addRow()
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 1,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          border: '1.5px dashed',
          borderColor: 'divider',
          cursor: 'pointer',
          color: 'text.disabled',
          transition: 'all 0.15s',
          '&:hover': { borderColor: 'info.main', color: 'info.main' }
        }}
      >
        <Icon icon='tabler:plus' style={{ fontSize: 18 }} />
        <Typography variant='body2' fontWeight={500}>
          Add another FAQ
        </Typography>
      </Box>
    </Box>
  )
}

// ─── NearbyList ─────────────────────────────────────────────────────────────
const NearbyList = ({ NEARBY_PLACES, setNEARBY_PLACES, nearbyIconOptions }) => {
  const theme = useTheme()

  const handleChange = (index, field, value) => {
    setNEARBY_PLACES(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addRow = () =>
    setNEARBY_PLACES(prev => [...prev, { ICON_ID: 0, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])

  const removeRow = index => {
    setNEARBY_PLACES(prev => {
      const filtered = prev.filter((_, i) => i !== index)

      return filtered.length > 0 ? filtered : [{ ICON_ID: 0, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }]
    })
  }

  return (
    <Box>
      <Grid container spacing={1.5} sx={{ mb: 1, px: 0.5 }}>
        <Grid item xs={2}>
          <Typography variant='caption' color='text.disabled' fontWeight={600} textTransform='uppercase' fontSize={10}>
            Icon
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='caption' color='text.disabled' fontWeight={600} textTransform='uppercase' fontSize={10}>
            Place Name
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant='caption' color='text.disabled' fontWeight={600} textTransform='uppercase' fontSize={10}>
            Distance
          </Typography>
        </Grid>
        <Grid item xs={1} />
      </Grid>
      {NEARBY_PLACES.map((item, index) => (
        <Grid
          container
          spacing={1.5}
          key={index}
          alignItems='center'
          sx={{
            mb: 1,
            borderRadius: 2,
            p: 0.25,
            transition: 'background 0.15s',
            '&:hover': { background: alpha(theme.palette.success.main, 0.03) }
          }}
        >
          <Grid item xs={2}>
            <FormControl fullWidth size='small'>
              <Select
                size='small'
                value={item.ICON || 'tabler:map-pin'}
                onChange={e => handleChange(index, 'ICON', e.target.value)}
                sx={{ borderRadius: 1 }}
                renderValue={v =>
                  v ? (
                    <Box display='flex' alignItems='center' justifyContent='left' gap={1.5}>
                      <Icon icon={v} style={{ fontSize: 18, color: theme.palette.success.main }} />
                      <Typography variant='body2' fontSize={12}>
                        {nearbyIconOptions.find(opt => opt.value === v)?.label}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography color='text.disabled'>Select icon…</Typography>
                  )
                }
              >
                {nearbyIconOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box display='flex' alignItems='center' gap={1.5}>
                      <Icon icon={opt.value} style={{ fontSize: 18, color: theme.palette.success.main }} />
                      <Typography variant='body2'>{opt.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size='small'
              placeholder='e.g. City Centre'
              value={item.NAME}
              onChange={e => handleChange(index, 'NAME', e.target.value)}
              InputProps={{ sx: { borderRadius: 1 } }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              size='small'
              placeholder='e.g. 1.2 km away'
              value={item.DISTANCE}
              onChange={e => handleChange(index, 'DISTANCE', e.target.value)}
              InputProps={{
                sx: { borderRadius: 1 },
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:route' style={{ fontSize: 15, color: theme.palette.text.disabled }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={1} sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title='Remove'>
              <IconButton size='small' color='error' onClick={() => removeRow(index)}>
                <Icon icon='tabler:trash' style={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            {index === NEARBY_PLACES.length - 1 && (
              <Tooltip title='Add place'>
                <IconButton size='small' color='primary' onClick={addRow} disabled={!item.NAME?.trim()}>
                  <Icon icon='tabler:plus' style={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      ))}
      <Box
        onClick={() => {
          const last = NEARBY_PLACES[NEARBY_PLACES.length - 1]
          if (last?.NAME?.trim()) addRow()
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 1.5,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          border: '1.5px dashed',
          borderColor: 'divider',
          cursor: 'pointer',
          color: 'text.disabled',
          transition: 'all 0.15s',
          '&:hover': { borderColor: 'success.main', color: 'success.main' }
        }}
      >
        <Icon icon='tabler:map-pin-plus' style={{ fontSize: 18 }} />
        <Typography variant='body2' fontWeight={500}>
          Add nearby place
        </Typography>
      </Box>
    </Box>
  )
}

// ─── ModalForm ───────────────────────────────────────────────────────────────
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
  setPROPERTY_RULES
}) => {
  const theme = useTheme()

  const [siteStatusOptions, setSiteStatusOptions] = useState([])
  const [listingStatusOptions, setListingStatusOptions] = useState([])
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])
  const [councilTaxBandOptions, setCouncilTaxBandOptions] = useState([])
  const [priceModifierOptions, setPriceModifierOptions] = useState([])
  const [bedroomsOptions, setBedroomsOptions] = useState([])
  const [bathroomsOptions, setBathroomsOptions] = useState([])
  const [receptionsOptions, setReceptionsOptions] = useState([])
  const [floorsOptions, setFloorsOptions] = useState([])
  const [unitsOptions, setUnitsOptions] = useState([])
  const [contentTypeOptions, setContentTypeOptions] = useState([])
  const [featuresOptions, setFeaturesOptions] = useState([])
  const [featuresList, setFeaturesList] = useState([])
  const [utilitiesOptions, setUtilitiesOptions] = useState([])
  const [utilitiesList, setUtilitiesList] = useState([])
  const [usingPlanningOptions, setUsingPlanningOptions] = useState([])
  const [usingPlanningList, setUsingPlanningList] = useState([])
  const [rentalFrequencyOptions, setRentalFrequencyOptions] = useState([])
  const [lettingArrangementsOptions, setLettingArrangementsOptions] = useState([])
  const [lettingsDepositOptions, setLettingsDepositOptions] = useState([])
  const [feeApplyOptions, setFeeApplyOptions] = useState([])
  const [furnishedOptions, setFurnishedOptions] = useState([])
  const [summaryCount, setSummaryCount] = useState(0)
  const [searchResult, setSearchResult] = useState('Result: none')
  const [searchState, setSearchState] = useState()
  const [mapParams, setMapParams] = useState({})
  const [nearbyIconOptions, setNearbyIconOptions] = useState([])
  const [faqsLoading, setFaqsLoading] = useState(false)
  const [rulesLoading, setRulesLoading] = useState(false)

  const loadGlobalParameterOptions = async () => {
    const globalParametersLOVData = await getGlobalParametersGroupsLOV(
      `${GLOBAL_PARAMETER_TYPES.SITE_STATUS},${GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE},${GLOBAL_PARAMETER_TYPES.COUNCIL_TAX_BAND},${GLOBAL_PARAMETER_TYPES.BEDROOMS},${GLOBAL_PARAMETER_TYPES.BATHROOMS},${GLOBAL_PARAMETER_TYPES.RECEPTIONS},${GLOBAL_PARAMETER_TYPES.FLOORS},${GLOBAL_PARAMETER_TYPES.UNITS},${GLOBAL_PARAMETER_TYPES.CONTENT_TYPE},${GLOBAL_PARAMETER_TYPES.RENTAL_FREQUENCY},${GLOBAL_PARAMETER_TYPES.LETTING_ARRANGEMENTS},${GLOBAL_PARAMETER_TYPES.LETTINGS_DEPOSIT},${GLOBAL_PARAMETER_TYPES.FEE_APPLY},${GLOBAL_PARAMETER_TYPES.FURNISHED},${GLOBAL_PARAMETER_TYPES.PRICE_MODIFIER}`
    )

    const siteStatuses = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.SITE_STATUS)
    const propertyTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE)
    const councilTaxBands = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.COUNCIL_TAX_BAND)
    const bedrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BEDROOMS)
    const bathrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BATHROOMS)
    const receptions = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.RECEPTIONS)
    const floors = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.FLOORS)
    const units = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.UNITS)
    const contentTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.CONTENT_TYPE)
    const rentalFrequencies = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.RENTAL_FREQUENCY)

    const lettingArrangements = getOptionsByTypeCode(
      globalParametersLOVData,
      GLOBAL_PARAMETER_TYPES.LETTING_ARRANGEMENTS
    )
    const lettingsDeposits = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.LETTINGS_DEPOSIT)
    const feeApplies = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.FEE_APPLY)
    const furnished = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.FURNISHED)
    const priceModifiers = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.PRICE_MODIFIER)

    if (siteStatuses?.length > 0) setSiteStatusOptions(siteStatuses)
    if (propertyTypes?.length > 0) setPropertyTypeOptions(propertyTypes)
    if (councilTaxBands?.length > 0) setCouncilTaxBandOptions(councilTaxBands)
    if (bedrooms?.length > 0) setBedroomsOptions(bedrooms)
    if (bathrooms?.length > 0) setBathroomsOptions(bathrooms)
    if (receptions?.length > 0) setReceptionsOptions(receptions)
    if (floors?.length > 0) setFloorsOptions(floors)
    if (units?.length > 0) setUnitsOptions(units)
    if (contentTypes?.length > 0) setContentTypeOptions(contentTypes)
    if (rentalFrequencies?.length > 0) setRentalFrequencyOptions(rentalFrequencies)
    if (lettingArrangements?.length > 0) setLettingArrangementsOptions(lettingArrangements)
    if (lettingsDeposits?.length > 0) setLettingsDepositOptions(lettingsDeposits)
    if (feeApplies?.length > 0) setFeeApplyOptions(feeApplies)
    if (furnished?.length > 0) setFurnishedOptions(furnished)
    if (priceModifiers?.length > 0) setPriceModifierOptions(priceModifiers)
  }

  const setListingStatus = async () => {
    const data = await getGlobalParametersLOV_W2P('LSTSTS', 1)
    if (data?.length > 0) setListingStatusOptions(data)
  }

  const bindFeatures = async () => {
    const response = await getFeaturesAPI({ ACTIVE: true, TYPE: 2 })

    const _featuresList = response?.data.map(i => ({
      ...i,
      checked: features?.length && Boolean(features?.find(x => x.FEATURES_ID === i.FEATURES_ID))
    }))
    setFeaturesList(_featuresList)
    if (response?.data?.length > 0) {
      const data = response?.data.map(row => ({
        ...row,
        checked: features?.length && Boolean(features?.find(i => i.FEATURES_ID === row.FEATURES_ID))
      }))

      const _data = data.reduce((prev, curr) => {
        const rowPrev = prev.filter(a => a.FEATURES_TYPE_ID === curr.FEATURES_TYPE_ID)
        if (curr.FEATURES_TYPE_ID === null) {
          prev = [...prev, { FEATURES_ID: curr.FEATURES_ID, FEATURES: curr.FEATURES, checked: curr.checked }]
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
    if (response?.data?.length > 0) {
      const data = response?.data.map(row => ({
        ...row,
        checked: utilities?.length && Boolean(utilities?.find(i => i.UTILITY_ID === row.UTILITY_ID))
      }))

      const _data = data.reduce((prev, curr) => {
        const rowPrev = prev.filter(a => a.UTILITY_TYPE_ID === curr.UTILITY_TYPE_ID)
        if (curr.UTILITY_TYPE_ID === null) {
          prev = [...prev, { UTILITY_ID: curr.UTILITY_ID, UTILITIES: curr.UTILITIES, checked: curr.checked }]
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
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.NEARBY_ICON).then(d =>
      setNearbyIconOptions(d?.map(o => ({ label: o.label, value: o.extra || o.value })) || [])
    )
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
      setValue('PROVINCE_STATE', province)
      setValue('CITY', city)
      setPLACE(formattedAddress)
      setValue('FULLPOSTCODE', postCode || '')
      setValue('MAP_URL', mapUrl)
      setValue('PROPERTY_NUM_NAME', name || '')
      setValue('STREET_NAME', streetName || '')
      setValue('AREA_TOWN_CITY', areaTownCity || '')
      setMapParams({ LATITUDE: lat, LONGITUDE: lng, MAP_URL: mapUrl })
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
    const featuresOptionUpdate = featuresOptionsDetail.map(i => ({ ...i, checked }))

    const updateFeaturesOptions = featuresOptions.map(i => {
      if (i.FEATURES_TYPE_ID === FEATURES_TYPE_ID) {
        updateFeaturesList = featuresList.map(it => {
          if (it.FEATURES_TYPE_ID === i.FEATURES_TYPE_ID) {
            return { ...it, checked }
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

  // ── Utilities check-all helpers ──────────────────────────────────────────
  const isCheckedAllUtilities = UTILITY_TYPE_ID => {
    const detail = utilitiesOptions.find(i => i.UTILITY_TYPE_ID === UTILITY_TYPE_ID)?.detail
    const total = detail?.length
    const totalChecked = detail?.filter(i => i.checked).length

    return total > 0 && total === totalChecked
  }

  const isIndeterminateUtilities = UTILITY_TYPE_ID => {
    const detail = utilitiesOptions.find(i => i.UTILITY_TYPE_ID === UTILITY_TYPE_ID)?.detail
    const total = detail?.length
    const totalChecked = detail?.filter(i => i.checked).length

    return totalChecked > 0 && totalChecked < total
  }

  const checkedAllUtilities = (checked, UTILITY_TYPE_ID) => {
    const updatedOptions = utilitiesOptions.map(g => {
      if (g.UTILITY_TYPE_ID !== UTILITY_TYPE_ID) return g

      return { ...g, detail: g.detail.map(d => ({ ...d, checked })) }
    })
    setUtilitiesOptions(updatedOptions)
    const groupDetail = utilitiesOptions.find(g => g.UTILITY_TYPE_ID === UTILITY_TYPE_ID)?.detail ?? []
    const groupIds = new Set(groupDetail.map(d => d.UTILITY_ID))

    const updatedList = utilitiesList.map(it => (groupIds.has(it.UTILITY_ID) ? { ...it, checked } : it))
    setUtilities(updatedList.filter(i => i.checked === true))
    setUtilitiesList(updatedList)
  }

  // ── Using & Planning check-all helpers ───────────────────────────────────
  const isCheckedAllUsingPlanning = UAP_TYPE_ID => {
    const detail = usingPlanningOptions.find(i => i.UAP_TYPE_ID === UAP_TYPE_ID)?.detail
    if (!detail?.length) return false

    return detail.every(i => (i.FIELD_TYPE === 2 ? i.SELECT_VALUE === '1' || i.SELECT_VALUE === 1 : i.checked))
  }

  const isIndeterminateUsingPlanning = UAP_TYPE_ID => {
    const detail = usingPlanningOptions.find(i => i.UAP_TYPE_ID === UAP_TYPE_ID)?.detail
    if (!detail?.length) return false
    const total = detail.length

    const totalChecked = detail.filter(i =>
      i.FIELD_TYPE === 2 ? i.SELECT_VALUE === '1' || i.SELECT_VALUE === 1 : i.checked
    ).length

    return totalChecked > 0 && totalChecked < total
  }

  const checkedAllUsingPlanning = (checked, UAP_TYPE_ID) => {
    const updatedOptions = usingPlanningOptions.map(g => {
      if (g.UAP_TYPE_ID !== UAP_TYPE_ID) return g

      return {
        ...g,
        detail: g.detail.map(d =>
          d.FIELD_TYPE === 2 ? { ...d, checked, SELECT_VALUE: checked ? '1' : '0' } : { ...d, checked }
        )
      }
    })
    setUsingPlanningOptions(updatedOptions)
    const groupDetail = usingPlanningOptions.find(g => g.UAP_TYPE_ID === UAP_TYPE_ID)?.detail ?? []
    const groupIds = new Set(groupDetail.map(d => d.UAP_ID))

    const updatedList = usingPlanningList.map(it => {
      if (!groupIds.has(it.UAP_ID)) return it
      if (it.FIELD_TYPE === 2) return { ...it, checked, SELECT_VALUE: checked ? '1' : '0' }

      return { ...it, checked }
    })
    setUsingPlanning(updatedList.filter(i => i.checked === true))
    setUsingPlanningList(updatedList)
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
      setUsingPlanning(updateUsingPlanningList.filter(i => i.checked === true))
      setUsingPlanningList(updateUsingPlanningList)
      setUsingPlanningOptions(updateUsingPlanningOption)
    }
  }

  const loadRulePresets = () => {
    setRulesLoading(true)
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.HOUSE_RULES).then(d => {
      setRulesLoading(false)
      if (!d?.length) return
      const presets = d.map(o => ({ RULE_ID: o.value, RULE: o.label, NOTE: o.extra || '' }))
      setPROPERTY_RULES(prev => {
        const hasContent = prev.some(r => r.RULE?.trim())

        return hasContent ? [...prev, ...presets] : presets
      })
    })
  }

  const loadFaqPresets = () => {
    setFaqsLoading(true)
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.PROPERTY_FAQ).then(d => {
      setFaqsLoading(false)
      if (!d?.length) return
      const presets = d.map(o => ({ FAQ_ID: o.value, QUESTION: o.label, ANSWER: o.extra || '' }))
      setPROPERTY_FAQS(prev => {
        const hasContent = prev.some(f => f.QUESTION?.trim())

        return hasContent ? [...prev, ...presets] : presets
      })
    })
  }

  return (
    <>
      {submitRef && <button ref={submitRef} type='submit' style={{ display: 'none' }} />}

      <Grid container spacing={3} mt={0}>
        {/* ── Listing Status ── */}
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
                    Control visibility, publishing status and active state of this rental listing
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
                      rules={{ required: 'Required' }}
                      render={({ field, fieldState }) => (
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
                      )}
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

        {/* ── Guest Demographics ── */}
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
                    Indicate the most common tenant origins — used for analytics and personalised marketing
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel shrink>Popular Tenant Countries</InputLabel>
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
                          label='Popular Tenant Countries'
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

        {/* ── Address & Location ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.success.main)}>
            <Box sx={sectionHeader(theme.palette.success.main)}>
              <Box sx={sectionInner(theme.palette.success.main)}>
                <Box sx={sectionIconBox(theme.palette.success.main)}>
                  <Icon icon='tabler:map-pin' style={{ fontSize: 22, color: theme.palette.success.main }} />
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
                    Property address and map pin — used for tenant directions and map listing
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {isLoaded && (
                        <Controller
                          name='PLACE'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <GAutocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                              <TextField
                                size='medium'
                                placeholder='Find Location'
                                fullWidth
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
                                mt: 2,
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
                                mt: 2,
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
                <Grid item xs={12} md={7}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name='FULLPOSTCODE'
                          control={control}
                          rules={{ required: true }}
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
                          name='PROPERTY_NUM_NAME'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              multiline
                              inputProps={{ maxLength: 250 }}
                              label='PROPERTY NAME / NUMBER*'
                              onChange={onChange}
                              placeholder='PLEASE ENTER PROPERTY NAME OR NUMBER'
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
                          name='STREET_NAME'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              multiline
                              inputProps={{ maxLength: 250 }}
                              label='STREET NAME'
                              onChange={onChange}
                              placeholder='PLEASE ENTER STREET NAME'
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
                              label='AREA, TOWN OR CITY'
                              onChange={onChange}
                              placeholder='PLEASE ENTER AREA, TOWN OR CITY'
                              size='small'
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Property Details ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.warning.main)}>
            <Box sx={sectionHeader(theme.palette.warning.main)}>
              <Box sx={sectionInner(theme.palette.warning.main)}>
                <Box sx={sectionIconBox(theme.palette.warning.main)}>
                  <Icon icon='tabler:home' style={{ fontSize: 22, color: theme.palette.warning.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Property Details
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Property type, special flags and council tax band
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='PROPERTY_TYPE_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={propertyTypeOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='PROPERTY TYPE'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='STAR_RATING'
                      control={control}
                      render={({ field }) => <StarRatingPicker value={field.value} onChange={field.onChange} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='COUNCIL_TAX_BAND_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={councilTaxBandOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='COUNCIL TAX BAND'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} display='flex' alignItems='center' gap={2}>
                  <InputLabel>EXEMPT</InputLabel>
                  <FormControl>
                    <Controller
                      name='ISEXEMPT'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          value={value}
                          onChange={onChange}
                          control={<Switch color='warning' checked={Boolean(value)} />}
                          label=''
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup row>
                    <Controller
                      name='RETIREMENT_HOME'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={Boolean(value)} onChange={onChange} color='warning' />}
                          label='Retirement Home'
                        />
                      )}
                    />
                    <Controller
                      name='SHARED_ACCOMMODATION'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={Boolean(value)} onChange={onChange} color='warning' />}
                          label='Shared Accommodation'
                        />
                      )}
                    />
                    <Controller
                      name='SHORT_LET'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={Boolean(value)} onChange={onChange} color='warning' />}
                          label='Short Let'
                        />
                      )}
                    />
                    <Controller
                      name='STUDENT_ACCEPTED'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={Boolean(value)} onChange={onChange} color='warning' />}
                          label='Student Accepted'
                        />
                      )}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Price ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.info.main)}>
            <Box sx={sectionHeader(theme.palette.info.main)}>
              <Box sx={sectionInner(theme.palette.info.main)}>
                <Box sx={sectionIconBox(theme.palette.info.main)}>
                  <Icon icon='tabler:currency-dollar' style={{ fontSize: 22, color: theme.palette.info.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Price
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Rental price and payment frequency
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='PRICE'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='number'
                          inputProps={{ min: 0 }}
                          label='PRICE*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER PRICE'
                          size='small'
                          error={Boolean(errors.PRICE)}
                          helperText={Boolean(errors.PRICE) && 'Required'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Icon icon='tabler:currency-dollar' style={{ fontSize: 16 }} />
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='RENTAL_FREQUENCY_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={rentalFrequencyOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='RENTAL FREQUENCY'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Administration ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.error.main)}>
            <Box sx={sectionHeader(theme.palette.error.main)}>
              <Box sx={sectionInner(theme.palette.error.main)}>
                <Box sx={sectionIconBox(theme.palette.error.main)}>
                  <Icon icon='tabler:clipboard-list' style={{ fontSize: 22, color: theme.palette.error.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Administration
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Letting arrangements, deposit and fees
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='LETTING_ARRANGEMENTS'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={lettingArrangementsOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='LETTING ARRANGEMENTS'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='LETTINGS_DEPOSIT_PAYABLE'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={lettingsDepositOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='LETTINGS DEPOSIT PAYABLE'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='FEE_APPLY_ID'
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field, fieldState }) => (
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
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Photos ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.primary.main)}>
            <Box sx={sectionHeader(theme.palette.primary.main)}>
              <Box sx={sectionInner(theme.palette.primary.main)}>
                <Box sx={sectionIconBox(theme.palette.primary.main)}>
                  <Icon icon='tabler:photo' style={{ fontSize: 22, color: theme.palette.primary.main }} />
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
                    Upload high-quality photos — listings with 10+ photos receive significantly more enquiries
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

        {/* ── Video / Virtual Tours ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.secondary.main)}>
            <Box sx={sectionHeader(theme.palette.secondary.main)}>
              <Box sx={sectionInner(theme.palette.secondary.main)}>
                <Box sx={sectionIconBox(theme.palette.secondary.main)}>
                  <Icon icon='tabler:video' style={{ fontSize: 22, color: theme.palette.secondary.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Video / Virtual Tours
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Add a YouTube or virtual tour link to boost engagement
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='VIDEO_VIRTUALS_LINK'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          inputProps={{ maxLength: 500 }}
                          label='VIDEO / VIRTUAL TOUR LINK'
                          onChange={onChange}
                          placeholder='e.g. https://youtube.com/...'
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

        {/* ── Description ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.secondary.main)}>
            <Box sx={sectionHeader(theme.palette.secondary.main)}>
              <Box sx={sectionInner(theme.palette.secondary.main)}>
                <Box sx={sectionIconBox(theme.palette.secondary.main)}>
                  <Icon icon='tabler:file-description' style={{ fontSize: 22, color: theme.palette.secondary.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Description
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Property details, size and description shown on the listing page
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='BEDROOMS_ID'
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field, fieldState }) => (
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
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='BATHROOMS_ID'
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field, fieldState }) => (
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
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='RECEPTIONS_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={receptionsOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='RECEPTIONS'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='FLOORS_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={floorsOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='FLOORS'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <Controller
                      name='SIZE'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='number'
                          inputProps={{ min: 0 }}
                          label='SIZE'
                          onChange={onChange}
                          placeholder='PLEASE ENTER SIZE'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='UNITS_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={unitsOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='UNITS'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='FURNISHED_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={furnishedOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='FURNISHED'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <Controller
                      name='MAX_GUESTS'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value ?? ''}
                          inputProps={{ min: 1, max: 30 }}
                          label='MAX GUESTS'
                          onChange={onChange}
                          placeholder='e.g. 2'
                          size='small'
                          type='number'
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Icon
                                  icon='tabler:users'
                                  style={{ fontSize: 16, color: theme.palette.text.disabled }}
                                />
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <Controller
                      name='PROPERTY_QUANTITY'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='number'
                          inputProps={{ min: 1 }}
                          label='PROPERTY QUANTITY*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER QUANTITY'
                          size='small'
                          error={Boolean(errors.PROPERTY_QUANTITY)}
                          helperText={Boolean(errors.PROPERTY_QUANTITY) && 'Required'}
                        />
                      )}
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
                          minRows={2}
                          inputProps={{ maxLength: 500 }}
                          label='SUMMARY'
                          onChange={onChange}
                          placeholder='PLEASE ENTER A BRIEF SUMMARY'
                          size='small'
                        />
                      )}
                    />
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

        {/* ── Utilities ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.success.main)}>
            <Box sx={sectionHeader(theme.palette.success.main)}>
              <Box sx={sectionInner(theme.palette.success.main)}>
                <Box sx={sectionIconBox(theme.palette.success.main)}>
                  <Icon icon='tabler:plug' style={{ fontSize: 22, color: theme.palette.success.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Utilities
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Utilities included or available with this rental property
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {utilitiesOptions.map((row, index) => (
                    <Grid item xs={12} md={3} key={index}>
                      {row.detail ? (
                        <>
                          <FormControlLabel
                            label={
                              <Typography fontWeight='bold' variant='subtitle1'>
                                {row.DESCRIPTION}
                              </Typography>
                            }
                            control={
                              <Checkbox
                                color='success'
                                indeterminate={isIndeterminateUtilities(row.UTILITY_TYPE_ID)}
                                checked={isCheckedAllUtilities(row.UTILITY_TYPE_ID)}
                                onChange={e => checkedAllUtilities(e.target.checked, row.UTILITY_TYPE_ID)}
                              />
                            }
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                            {row.detail.map((item, index2) => (
                              <FormControlLabel
                                key={index2}
                                label={item.UTILITIES}
                                control={
                                  <Checkbox
                                    color='success'
                                    checked={item.checked}
                                    onChange={e => checkedUtilities(e, item, row.UTILITY_TYPE_ID)}
                                  />
                                }
                              />
                            ))}
                          </Box>
                        </>
                      ) : (
                        <FormControlLabel
                          label={row.UTILITIES}
                          control={
                            <Checkbox
                              color='success'
                              checked={row.checked}
                              onChange={e => checkedUtilities(e, row, null)}
                            />
                          }
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Using and Planning ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.warning.main)}>
            <Box sx={sectionHeader(theme.palette.warning.main)}>
              <Box sx={sectionInner(theme.palette.warning.main)}>
                <Box sx={sectionIconBox(theme.palette.warning.main)}>
                  <Icon icon='tabler:ruler-2' style={{ fontSize: 22, color: theme.palette.warning.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Using and Planning
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Planning use class and restrictions applicable to the property
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {usingPlanningOptions.map((row, index) => (
                    <Grid item xs={12} md={3} key={index}>
                      {row.detail ? (
                        <>
                          {row.detail.every(d => d.FIELD_TYPE === 2) ? (
                            <Box
                              display='flex'
                              alignItems='center'
                              justifyContent='space-between'
                              gap={1}
                              mb={1}
                              maxWidth={260}
                            >
                              <Typography fontWeight='bold' variant='subtitle1'>
                                {row.DESCRIPTION}
                              </Typography>
                              <Select
                                color='secondary'
                                size='small'
                                value={
                                  row.detail.every(d => d.SELECT_VALUE === '1' || d.SELECT_VALUE === 1) ? '1' : '0'
                                }
                                onChange={e => checkedAllUsingPlanning(e.target.value === '1', row.UAP_TYPE_ID)}
                                sx={{
                                  bgcolor: 'secondary.light',
                                  fontSize: 12,
                                  width: 60,
                                  height: 20,
                                  m: '0 !important',
                                  p: '0 !important'
                                }}
                              >
                                <MenuItem value='0'>No</MenuItem>
                                <MenuItem value='1'>Yes</MenuItem>
                              </Select>
                            </Box>
                          ) : (
                            <FormControlLabel
                              label={
                                <Typography fontWeight='bold' variant='subtitle1'>
                                  {row.DESCRIPTION}
                                </Typography>
                              }
                              control={
                                <Checkbox
                                  color='warning'
                                  indeterminate={isIndeterminateUsingPlanning(row.UAP_TYPE_ID)}
                                  checked={isCheckedAllUsingPlanning(row.UAP_TYPE_ID)}
                                  onChange={e => checkedAllUsingPlanning(e.target.checked, row.UAP_TYPE_ID)}
                                />
                              }
                            />
                          )}
                          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                            {row.detail.map((item, index2) => (
                              <Box key={index2} minHeight={50}>
                                {item.FIELD_TYPE === 2 ? (
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    gap={1}
                                    mb={1}
                                    maxWidth={250}
                                  >
                                    <Typography variant=''>
                                      {item.DESCRIPTION}
                                      {item.TOOLTIP_TEXT && (
                                        <Tooltip title={item.TOOLTIP_TEXT}>
                                          <span style={{ marginLeft: 2, marginRight: 2 }}>
                                            <Icon icon='tabler:info-circle-filled' style={{ fontSize: 14 }} />
                                          </span>
                                        </Tooltip>
                                      )}
                                    </Typography>
                                    <Select
                                      size='small'
                                      value={item.SELECT_VALUE || '0'}
                                      onChange={e => checkedUsingPlanning(e, item, row.UAP_TYPE_ID)}
                                      sx={{ fontSize: 12, width: 60, height: 20, m: '0 !important', p: '0 !important' }}
                                    >
                                      <MenuItem value='0'>No</MenuItem>
                                      <MenuItem value='1'>Yes</MenuItem>
                                    </Select>
                                  </Box>
                                ) : (
                                  <FormControlLabel
                                    label={
                                      <Box display='flex' alignItems='center' gap={0.5}>
                                        {item.DESCRIPTION}
                                        {item.TOOLTIP_TEXT && (
                                          <Tooltip title={item.TOOLTIP_TEXT}>
                                            <span>
                                              <Icon icon='tabler:info-circle-filled' style={{ fontSize: 14 }} />
                                            </span>
                                          </Tooltip>
                                        )}
                                      </Box>
                                    }
                                    control={
                                      <Checkbox
                                        color='warning'
                                        checked={item.checked}
                                        onChange={e => checkedUsingPlanning(e, item, row.UAP_TYPE_ID)}
                                      />
                                    }
                                  />
                                )}
                              </Box>
                            ))}
                          </Box>
                        </>
                      ) : (
                        <Box>
                          {row.FIELD_TYPE === 2 ? (
                            <Box display='flex' alignItems='center' gap={1} mb={1}>
                              <Typography variant='body2'>{row.DESCRIPTION}</Typography>
                              {row.TOOLTIP_TEXT && (
                                <Tooltip title={row.TOOLTIP_TEXT}>
                                  <span>
                                    <Icon icon='tabler:info-circle' style={{ fontSize: 14 }} />
                                  </span>
                                </Tooltip>
                              )}
                              <Select
                                size='small'
                                value={row.SELECT_VALUE || '0'}
                                onChange={e => checkedUsingPlanning(e, row, null)}
                                sx={{ minWidth: 80 }}
                              >
                                <MenuItem value='0'>No</MenuItem>
                                <MenuItem value='1'>Yes</MenuItem>
                              </Select>
                            </Box>
                          ) : (
                            <FormControlLabel
                              label={
                                <Box display='flex' alignItems='center' gap={0.5}>
                                  {row.DESCRIPTION}
                                  {row.TOOLTIP_TEXT && (
                                    <Tooltip title={row.TOOLTIP_TEXT}>
                                      <span>
                                        <Icon icon='tabler:info-circle' style={{ fontSize: 14 }} />
                                      </span>
                                    </Tooltip>
                                  )}
                                </Box>
                              }
                              control={
                                <Checkbox
                                  color='warning'
                                  checked={row.checked}
                                  onChange={e => checkedUsingPlanning(e, row, null)}
                                />
                              }
                            />
                          )}
                        </Box>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </FormControl>
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PLANNING_CONSIDERATIONS'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          multiline
                          minRows={3}
                          inputProps={{ maxLength: 1000 }}
                          label='PLANNING CONSIDERATIONS'
                          onChange={onChange}
                          placeholder='Additional planning notes or considerations'
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

        {/* ── Features & Amenities ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.primary.main)}>
            <Box sx={sectionHeader(theme.palette.primary.main)}>
              <Box sx={sectionInner(theme.palette.primary.main)}>
                <Box sx={sectionIconBox(theme.palette.primary.main)}>
                  <Icon icon='tabler:sparkles' style={{ fontSize: 22, color: theme.palette.primary.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Features & Amenities
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Select all amenities that apply — tenants filter by these on the search results page
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <FormControl fullWidth>
                <Grid container>
                  {featuresOptions.map((row, index) => (
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
                        {row.detail.map((item, index2) => (
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
                        ))}
                      </Box>
                    </Grid>
                  ))}
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

        {/* ── EPC Rating (commented out) ── */}
        {/* <Grid item xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='CURRENT_ERR_RATING'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField value={value} inputProps={{ min: 0, max: 100 }} label='CURRENT ERR RATING' onChange={onChange} placeholder='PLEASE ENTER CURRENT ERR RATING' size='small' type='number' />
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
                        <TextField value={value} inputProps={{ min: 0, max: 100 }} label='POTENTIAL ERR RATING' onChange={onChange} placeholder='PLEASE ENTER POTENTIAL ERR RATING' size='small' type='number' />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid> */}

        {/* ── Content Upload ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.info.main)}>
            <Box sx={sectionHeader(theme.palette.info.main)}>
              <Box sx={sectionInner(theme.palette.info.main)}>
                <Box sx={sectionIconBox(theme.palette.info.main)}>
                  <Icon icon='tabler:upload' style={{ fontSize: 22, color: theme.palette.info.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Content Upload
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Upload floor plans, brochures or other content files
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='CONTENT_TYPE_ID'
                      control={control}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={contentTypeOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='CONTENT TYPE'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
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

        {/* ── Host / Manager ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.primary.main)}>
            <Box sx={sectionHeader(theme.palette.primary.main)}>
              <Box sx={sectionInner(theme.palette.primary.main)}>
                <Box sx={sectionIconBox(theme.palette.primary.main)}>
                  <Icon icon='tabler:user-circle' style={{ fontSize: 22, color: theme.palette.primary.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Host / Manager
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Information about the host or property manager shown to prospective tenants
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='AGENT_NAME'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value ?? ''}
                          inputProps={{ maxLength: 150 }}
                          label='HOST / AGENT NAME'
                          onChange={onChange}
                          placeholder='PLEASE ENTER HOST OR AGENT NAME'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth>
                    <Controller
                      name='AGENT_BIO'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value ?? ''}
                          multiline
                          minRows={2}
                          inputProps={{ maxLength: 1000 }}
                          label='HOST BIO'
                          onChange={onChange}
                          placeholder='Brief bio of the host or property manager'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='IMPORTANT_INFO'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value ?? ''}
                          multiline
                          minRows={3}
                          inputProps={{ maxLength: 2000 }}
                          label='IMPORTANT INFORMATION'
                          onChange={onChange}
                          placeholder='Important information or special conditions for this rental'
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

        {/* ── House Rules ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.error.main)}>
            <Box sx={sectionHeader(theme.palette.error.main)}>
              <Box sx={sectionInner(theme.palette.error.main)}>
                <Box sx={sectionIconBox(theme.palette.error.main)}>
                  <Icon icon='tabler:list-check' style={{ fontSize: 22, color: theme.palette.error.main }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                      House Rules
                    </Typography>
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      disabled={rulesLoading}
                      onClick={loadRulePresets}
                      startIcon={
                        rulesLoading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <Icon icon='tabler:download' style={{ fontSize: 14 }} />
                        )
                      }
                    >
                      Load presets
                    </Button>
                  </Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Rules and conditions tenants must agree to before renting
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <RulesList PROPERTY_RULES={PROPERTY_RULES} setPROPERTY_RULES={setPROPERTY_RULES} />
            </CardContent>
          </Card>
        </Grid>

        {/* ── FAQs ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.info.main)}>
            <Box sx={sectionHeader(theme.palette.info.main)}>
              <Box sx={sectionInner(theme.palette.info.main)}>
                <Box sx={sectionIconBox(theme.palette.info.main)}>
                  <Icon icon='tabler:help-circle' style={{ fontSize: 22, color: theme.palette.info.main }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                      Frequently Asked Questions
                    </Typography>
                    <Button
                      size='small'
                      variant='outlined'
                      color='info'
                      disabled={faqsLoading}
                      onClick={loadFaqPresets}
                      startIcon={
                        faqsLoading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <Icon icon='tabler:download' style={{ fontSize: 14 }} />
                        )
                      }
                    >
                      Load presets
                    </Button>
                  </Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Common questions and answers shown on the listing page
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <FaqsList PROPERTY_FAQS={PROPERTY_FAQS} setPROPERTY_FAQS={setPROPERTY_FAQS} />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Nearby Places ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.success.main)}>
            <Box sx={sectionHeader(theme.palette.success.main)}>
              <Box sx={sectionInner(theme.palette.success.main)}>
                <Box sx={sectionIconBox(theme.palette.success.main)}>
                  <Icon icon='tabler:map-2' style={{ fontSize: 22, color: theme.palette.success.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Nearby Places
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                  >
                    Points of interest near this rental — transport, schools, shops, parks etc.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <NearbyList
                NEARBY_PLACES={NEARBY_PLACES}
                setNEARBY_PLACES={setNEARBY_PLACES}
                nearbyIconOptions={nearbyIconOptions}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
