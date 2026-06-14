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
  Divider,
  RadioGroup,
  Radio,
  FormHelperText,
  Alert
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
  GLOBAL_PARAMETER_TYPES,
  SELLER_TYPES,
  amountWithComma,
  CONDITIONS,
  DELIVERY_OPTIONS,
  setFieldFocus
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
  alignItems: 'center',
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

const radioButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1.5px solid',
  borderColor: 'grey.300',
  borderRadius: 1,
  mr: '8px',
  mt: '8px',
  py: 1,
  px: 2,
  width: { xs: '100%', sm: 'calc(50% - 8px)' }
}

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
      {/* {PROPERTY_RULES.map((item, index) => (
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
      ))} */}
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
      {/* {PROPERTY_FAQS.map((item, index) => (
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
      ))} */}
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
  setPROPERTY_RULES,
  setFocus
}) => {
  const theme = useTheme()

  const [postStatusOptions, setPostStatusOptions] = useState([])
  const [listingStatusOptions, setListingStatusOptions] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
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
      `${GLOBAL_PARAMETER_TYPES.CATEGORY},${GLOBAL_PARAMETER_TYPES.SUB_CATEGORY},${GLOBAL_PARAMETER_TYPES.COUNCIL_TAX_BAND},${GLOBAL_PARAMETER_TYPES.BEDROOMS},${GLOBAL_PARAMETER_TYPES.BATHROOMS},${GLOBAL_PARAMETER_TYPES.RECEPTIONS},${GLOBAL_PARAMETER_TYPES.FLOORS},${GLOBAL_PARAMETER_TYPES.UNITS},${GLOBAL_PARAMETER_TYPES.CONTENT_TYPE},${GLOBAL_PARAMETER_TYPES.RENTAL_FREQUENCY},${GLOBAL_PARAMETER_TYPES.LETTING_ARRANGEMENTS},${GLOBAL_PARAMETER_TYPES.LETTINGS_DEPOSIT},${GLOBAL_PARAMETER_TYPES.FEE_APPLY},${GLOBAL_PARAMETER_TYPES.FURNISHED},${GLOBAL_PARAMETER_TYPES.PRICE_MODIFIER}`
    )

    const categories = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.CATEGORY)
    const subCategories = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.SUB_CATEGORY)
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

    if (categories?.length > 0) setCategoryOptions(categories)
    if (subCategories?.length > 0) setSubCategoryOptions(subCategories)
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
      {submitRef && (
        <button
          onClick={() => {
            if (Object.keys(errors).length > 0) {
              debugger
              setFocus('TITLE')
            }
          }}
          ref={submitRef}
          type='submit'
          style={{ display: 'none' }}
        />
      )}

      <Grid container spacing={3} mt={0}>
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

        {/* ── Item Details ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.warning.main)}>
            <Box sx={sectionHeader(theme.palette.warning.main)}>
              <Box sx={sectionInner(theme.palette.warning.main)}>
                <Box sx={sectionIconBox(theme.palette.warning.main)}>
                  <Icon icon='tabler:tag' style={{ fontSize: 22, color: theme.palette.warning.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Item Details
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ fontSize: 14, fontWeight: 'bold' }} id='user-view-status-label'>
                    Seller Type
                  </InputLabel>
                  <FormControl fullWidth size='small' variant='filled'>
                    <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                      {SELLER_TYPES.map(item => (
                        <Controller
                          key={item.value}
                          name='SELLER_TYPE_ID'
                          control={control}
                          rules={{ required: { value: true, message: 'Seller Type is required' } }}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              name='SELLER_TYPE_ID'
                              value={item.value}
                              onChange={onChange}
                              sx={{
                                color: item.value == value ? 'success.main' : 'inherit'
                              }}
                              control={<Radio color='success' checked={item.value == value} />}
                              label={item.title}
                            />
                          )}
                        />
                      ))}
                    </RadioGroup>
                    {errors.SELLER_TYPE_ID && <FormHelperText error>{errors.SELLER_TYPE_ID.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='TITLE'
                      control={control}
                      rules={{ required: { value: true, message: 'TITLE is required' } }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          name='TITLE'
                          type='text'
                          label='TITLE*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER TITLE'
                          size='small'
                          error={Boolean(errors.TITLE)}
                          helperText={Boolean(errors.TITLE) && errors.TITLE.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='BRAND_NAME'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          name='BRAND_NAME'
                          type='text'
                          label='BRAND NAME (optional)'
                          onChange={onChange}
                          placeholder='PLEASE ENTER BRAND NAME'
                          size='small'
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PRICE'
                      control={control}
                      rules={{ required: { value: true, message: 'PRICE is required' } }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value && amountWithComma(value)}
                          name='PRICE'
                          type='number'
                          inputProps={{ min: 0, max: 9999999999, step: 0.5 }}
                          label='PRICE*'
                          onChange={e => {
                            if (e.target.value > 9999999999) return
                            onChange(e)
                          }}
                          placeholder='PLEASE ENTER PRICE'
                          size='small'
                          error={Boolean(errors.PRICE)}
                          helperText={Boolean(errors.PRICE) && errors.PRICE.message}
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='CATEGORY_ID'
                      control={control}
                      rules={{ required: { value: true, message: 'CATEGORY is required' } }}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={categoryOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              name='CATEGORY_ID'
                              {...params}
                              label='CATEGORY*'
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

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size='small'>
                    <Controller
                      name='SUB_CATEGORY_ID'
                      control={control}
                      rules={{ required: { value: true, message: 'SUB-CATEGORY is required' } }}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          size='small'
                          options={subCategoryOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              name='SUB_CATEGORY_ID'
                              {...params}
                              label='SUB-CATEGORY*'
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
                  <FormControl fullWidth>
                    <Controller
                      name='FULLDESCRIPTION'
                      control={control}
                      rules={{ required: { value: true, message: 'FULL DESCRIPTION is required' } }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          name='FULLDESCRIPTION'
                          multiline
                          minRows={5}
                          label='FULL DESCRIPTION*'
                          onChange={onChange}
                          placeholder='PLEASE ENTER FULL DESCRIPTION'
                          size='small'
                          error={Boolean(errors.FULLDESCRIPTION)}
                          helperText={Boolean(errors.FULLDESCRIPTION) && errors.FULLDESCRIPTION.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ fontSize: 14, fontWeight: 'bold' }} id='user-view-status-label'>
                    Condition
                  </InputLabel>
                  <FormControl fullWidth size='small' variant='filled'>
                    <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                      {CONDITIONS.map(item => (
                        <Controller
                          key={item.value}
                          name='CONDITION_ID'
                          control={control}
                          rules={{ required: { value: true, message: 'Condition is required' } }}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              name='CONDITION_ID'
                              sx={{
                                color: item.value == value ? 'success.main' : 'inherit'
                              }}
                              value={item.value}
                              onChange={onChange}
                              control={<Radio color='success' checked={item.value == value} />}
                              label={item.title}
                            />
                          )}
                        />
                      ))}
                    </RadioGroup>
                    {errors.CONDITION_ID && <FormHelperText error>{errors.CONDITION_ID.message}</FormHelperText>}
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
                                name='PLACE'
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
                          rules={{ required: { value: true, message: 'Postal Code is required' } }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              name='FULLPOSTCODE'
                              value={value}
                              sx={{ maxWidth: 265 }}
                              inputProps={{ maxLength: 20 }}
                              label='POSTAL CODE*'
                              onChange={onChange}
                              placeholder='PLEASE ENTER POSTAL CODE'
                              size='small'
                              error={Boolean(errors.FULLPOSTCODE)}
                              helperText={Boolean(errors.FULLPOSTCODE) && errors.FULLPOSTCODE.message}
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
                          rules={{ required: { value: true, message: 'Property Name/Number is required' } }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              name='PROPERTY_NUM_NAME'
                              multiline
                              inputProps={{ maxLength: 250 }}
                              label='PROPERTY NAME / NUMBER*'
                              onChange={onChange}
                              placeholder='PLEASE ENTER PROPERTY NAME OR NUMBER'
                              size='small'
                              error={Boolean(errors.PROPERTY_NUM_NAME)}
                              helperText={Boolean(errors.PROPERTY_NUM_NAME) && errors.PROPERTY_NUM_NAME.message}
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
                          rules={{ required: { value: true, message: 'Street Name is required' } }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              name='STREET_NAME'
                              multiline
                              inputProps={{ maxLength: 250 }}
                              label='STREET NAME*'
                              onChange={onChange}
                              placeholder='PLEASE ENTER STREET NAME'
                              size='small'
                              error={Boolean(errors.STREET_NAME)}
                              helperText={Boolean(errors.STREET_NAME) && errors.STREET_NAME.message}
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
                              name='AREA_TOWN_CITY'
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
                              name='OWN_REF'
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
        {/* ── Item Details ── */}
        <Grid item xs={12}>
          <Card sx={sectionCard(theme.palette.info.main)}>
            <Box sx={sectionHeader(theme.palette.info.main)}>
              <Box sx={sectionInner(theme.palette.info.main)}>
                <Box sx={sectionIconBox(theme.palette.info.main)}>
                  <Icon icon='tabler:truck-delivery' style={{ fontSize: 22, color: theme.palette.info.main }} />
                </Box>
                <Box>
                  <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                    Delivery Options
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ fontSize: 14, fontWeight: 'bold' }} id='user-view-status-label'>
                    Select Delivery Option
                  </InputLabel>
                  <FormControl fullWidth size='small' variant='filled'>
                    <RadioGroup row aria-label='colored' defaultValue='primary'>
                      {DELIVERY_OPTIONS.map(item => (
                        <Controller
                          key={item.value}
                          name='DELIVERY_OPTION_ID'
                          control={control}
                          rules={{ required: { value: true, message: 'Delivery Option is required' } }}
                          render={({ field: { value, onChange } }) => (
                            <Button
                              sx={radioButtonStyle}
                              variant={item.value == value ? 'contained' : 'outlined'}
                              color={item.value == value ? 'info' : 'inherit'}
                              onClick={() => onChange(item.value)}
                            >
                              <FormControlLabel
                                name='DELIVERY_OPTION_ID'
                                value={item.value}
                                onChange={onChange}
                                control={
                                  <Radio
                                    color={item.value == value ? 'default' : 'info'}
                                    checked={item.value == value}
                                  />
                                }
                                label={item.title}
                              />
                            </Button>
                          )}
                        />
                      ))}
                    </RadioGroup>
                    {errors.DELIVERY_OPTION_ID && (
                      <FormHelperText error>{errors.DELIVERY_OPTION_ID.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} id='error-box'>
          {Object.keys(errors).length > 0 && (
            <Alert
              severity='error'
              sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}
              title='There are errors in the form:'
            >
              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>There are errors in the form:</div>

              {Object.keys(errors).map((key, index) => (
                <Typography
                  onClick={() => {
                    setFieldFocus(key)
                  }}
                  key={key}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': { color: 'error.light' }
                  }}
                >
                  <Icon icon='tabler:circle-filled' style={{ fontSize: 16, marginRight: '8px' }} />
                  {errors[key].message}
                </Typography>
              ))}
            </Alert>
          )}
        </Grid>
      </Grid>
    </>
  )
}
