import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  alpha
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Controller } from 'react-hook-form'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { getGlobalParametersLOV, getGlobalParametersLOV_Extended } from 'src/@core/utils/custom-function'
import { GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// SectionLabel — coloured left-border header with icon
// ─────────────────────────────────────────────────────────────────────────────

const SectionLabel = ({ icon, title, description, accent }) => {
  const theme = useTheme()
  const color = accent || theme.palette.primary.main

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2.5,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
        borderLeft: `4px solid ${color}`
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(color, 0.12),
          flexShrink: 0
        }}
      >
        <Icon icon={icon} style={{ fontSize: 22, color }} />
      </Box>
      <Box>
        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
          {title}
        </Typography>
        {description && (
          <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldLabel
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Star Rating Picker
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Rules List
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// FAQs List
// ─────────────────────────────────────────────────────────────────────────────

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
            placeholder='e.g. What are the check-in times?'
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
            placeholder='e.g. Check-in is from 3:00 PM onwards.'
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

// ─────────────────────────────────────────────────────────────────────────────
// Nearby Places List
// ─────────────────────────────────────────────────────────────────────────────

const NearbyList = ({ NEARBY_PLACES, setNEARBY_PLACES, nearbyIconOptions }) => {
  const theme = useTheme()

  const handleChange = (index, field, value) => {
    setNEARBY_PLACES(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addRow = () =>
    setNEARBY_PLACES(prev => [...prev, { ICON_ID: Date.now(), NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])

  const removeRow = index => {
    setNEARBY_PLACES(prev => {
      const filtered = prev.filter((_, i) => i !== index)

      return filtered.length > 0 ? filtered : [{ ICON_ID: Date.now(), NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }]
    })
  }

  return (
    <Box>
      {/* Column headers */}
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
              placeholder='e.g. Heathrow Airport'
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const HotelDetailsSection = ({
  control,
  errors,
  NEARBY_PLACES,
  setNEARBY_PLACES,
  PROPERTY_FAQS,
  setPROPERTY_FAQS,
  PROPERTY_RULES,
  setPROPERTY_RULES
}) => {
  const theme = useTheme()

  const [hotelTypeOptions, setHotelTypeOptions] = useState([])
  const [timeOptions, setTimeOptions] = useState([])
  const [nearbyIconOptions, setNearbyIconOptions] = useState([])
  const [faqsLoading, setFaqsLoading] = useState(false)
  const [rulesLoading, setRulesLoading] = useState(false)
  useEffect(() => {
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.HOTEL_TYPE).then(d => setHotelTypeOptions(d || []))
    getGlobalParametersLOV('TIMESLOT').then(d => setTimeOptions(d || []))
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.NEARBY_ICON).then(d =>
      setNearbyIconOptions(d?.map(o => ({ label: o.label, value: o.extra || o.value })) || [])
    )
  }, [])

  const loadRulePresets = () => {
    setRulesLoading(true)
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.HOUSE_RULES).then(d => {
      setRulesLoading(false)
      if (!d?.length) return
      const presets = d.map((o, i) => ({ RULE_ID: o.value, RULE: o.label, NOTE: o.extra || '' }))
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
      const presets = d.map((o, i) => ({ FAQ_ID: o.value, QUESTION: o.label, ANSWER: o.extra || '' }))
      setPROPERTY_FAQS(prev => {
        const hasContent = prev.some(f => f.QUESTION?.trim())

        return hasContent ? [...prev, ...presets] : presets
      })
    })
  }

  const sectionCard = accent => ({
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: `1px solid ${alpha(accent, 0.18)}`
  })

  const sectionHeader = accent => ({
    px: 3,
    pt: 3,
    pb: 1,
    background: `linear-gradient(135deg, ${alpha(accent, 0.06)} 0%, transparent 60%)`
  })

  return (
    <Grid container spacing={3}>
      {/* ══ DESCRIPTION ═════════════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.secondary.main)}>
          <Box sx={sectionHeader(theme.palette.secondary.main)}>
            <SectionLabel
              icon='tabler:file-description'
              title='Description'
              description='Short summary and full description shown on the hotel listing page'
              accent={theme.palette.secondary.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name='SUMMARY'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      label='Summary'
                      placeholder='Brief summary of the hotel (shown in search results)'
                      value={field.value ?? ''}
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 500 }}
                      InputProps={{ sx: { borderRadius: 1 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='FULLDESCRIPTION'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      label='Full Description'
                      placeholder='Detailed description of the hotel, its amenities and surroundings'
                      value={field.value ?? ''}
                      multiline
                      minRows={5}
                      InputProps={{ sx: { borderRadius: 1 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* ══ HOTEL IDENTITY ══════════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.primary.main)}>
          <Box sx={sectionHeader(theme.palette.primary.main)}>
            <SectionLabel
              icon='tabler:building-hotel'
              title='Hotel Identity'
              description='Core information displayed to guests — type, classification and marketing title'
              accent={theme.palette.primary.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} mb={5}>
                <Controller
                  name='STAR_RATING'
                  control={control}
                  render={({ field }) => <StarRatingPicker value={field.value} onChange={field.onChange} />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel shrink>Hotel Type</InputLabel>
                  <Controller
                    name='HOTEL_TYPE'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        notched
                        size='small'
                        label='Hotel Type'
                        value={field.value ?? ''}
                        sx={{ borderRadius: 1 }}
                        renderValue={v =>
                          v ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Icon
                                icon={hotelTypeOptions.find(o => o.value === v)?.extra || 'tabler:building'}
                                style={{ fontSize: 16 }}
                              />
                              {hotelTypeOptions.find(o => o.value === v)?.label || v}
                            </Box>
                          ) : (
                            <Typography color='text.disabled'>Select type…</Typography>
                          )
                        }
                      >
                        <MenuItem value=''>
                          <Typography color='text.disabled'>— Not set —</Typography>
                        </MenuItem>
                        {hotelTypeOptions.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Icon
                                icon={opt.extra || 'tabler:building'}
                                style={{ fontSize: 18, color: theme.palette.primary.main }}
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

      {/* ══ CHECK-IN / CHECK-OUT ════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.success.main)}>
          <Box sx={sectionHeader(theme.palette.success.main)}>
            <SectionLabel
              icon='tabler:clock-hour-3'
              title='Check-in / Check-out Times'
              description='Guests will see these times on their booking confirmation and hotel detail page'
              accent={theme.palette.success.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Grid container spacing={3} alignItems='flex-end'>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth size='small'>
                  <InputLabel shrink>Check-in Time</InputLabel>
                  <Controller
                    name='CHECK_IN_TIME'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        notched
                        size='small'
                        label='Check-in Time'
                        value={field.value ?? ''}
                        sx={{ borderRadius: 1 }}
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon
                              icon='tabler:door-enter'
                              style={{ fontSize: 16, color: theme.palette.success.main }}
                            />
                          </InputAdornment>
                        }
                        renderValue={v =>
                          v ? (
                            timeOptions.find(o => o.value === v)?.label || v
                          ) : (
                            <Typography color='text.disabled'>Select time…</Typography>
                          )
                        }
                      >
                        <MenuItem value=''>— Not set —</MenuItem>
                        {timeOptions.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center', pb: 0.75 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    background: alpha(theme.palette.success.main, 0.08)
                  }}
                >
                  <Icon icon='tabler:arrows-right-left' style={{ fontSize: 18, color: theme.palette.success.main }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Check-out Time</InputLabel>
                  <Controller
                    name='CHECK_OUT_TIME'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        size='small'
                        label='Check-out Time'
                        value={field.value ?? ''}
                        sx={{ borderRadius: 1 }}
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='tabler:door-exit' style={{ fontSize: 16, color: theme.palette.warning.main }} />
                          </InputAdornment>
                        }
                        renderValue={v =>
                          v ? (
                            timeOptions.find(o => o.value === v)?.label || v
                          ) : (
                            <Typography color='text.disabled'>Select time…</Typography>
                          )
                        }
                      >
                        <MenuItem value=''>— Not set —</MenuItem>
                        {timeOptions.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
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

      {/* ══ HOST / MANAGER ══════════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.info.main)}>
          <Box sx={sectionHeader(theme.palette.info.main)}>
            <SectionLabel
              icon='tabler:user-circle'
              title='Host / Manager'
              description='Agent or manager details and important information shown on the hotel listing'
              accent={theme.palette.info.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='AGENT_NAME'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      label='Agent / Host Name'
                      placeholder='e.g. James Hartley'
                      value={field.value ?? ''}
                      InputProps={{
                        sx: { borderRadius: 1 },
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:user' style={{ fontSize: 16, color: theme.palette.text.disabled }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name='AGENT_BIO'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      label='Agent Bio'
                      placeholder='Brief introduction about the host or manager'
                      value={field.value ?? ''}
                      multiline
                      minRows={2}
                      InputProps={{ sx: { borderRadius: 1 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='IMPORTANT_INFO'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      label='Important Information'
                      placeholder='e.g. Parking available on-site, no pets allowed in common areas…'
                      value={field.value ?? ''}
                      multiline
                      minRows={3}
                      InputProps={{ sx: { borderRadius: 1 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* ══ HOUSE RULES ════════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.warning.main)}>
          <Box sx={sectionHeader(theme.palette.warning.main)}>
            <SectionLabel
              icon='tabler:clipboard-list'
              title='House Rules'
              description='Rules and policies displayed on the hotel listing'
              accent={theme.palette.warning.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mb: 2.5,
                p: 1.5,
                borderRadius: 1,
                background: alpha(theme.palette.warning.main, 0.07),
                border: `1px dashed ${alpha(theme.palette.warning.main, 0.35)}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon
                  icon='tabler:info-circle'
                  style={{ fontSize: 15, color: theme.palette.warning.dark, flexShrink: 0 }}
                />
                <Typography variant='caption' color='warning.dark'>
                  Enter each rule with a short note. E.g. rule: <strong>No Smoking</strong> — note:{' '}
                  <strong>Smoking is strictly prohibited</strong>
                </Typography>
              </Box>
              <Tooltip title='Load predefined rules from setup' placement='top'>
                <span>
                  <IconButton
                    size='small'
                    color='warning'
                    onClick={loadRulePresets}
                    disabled={rulesLoading}
                    sx={{ flexShrink: 0 }}
                  >
                    <Icon icon={rulesLoading ? 'tabler:loader-2' : 'tabler:database-import'} style={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <RulesList PROPERTY_RULES={PROPERTY_RULES} setPROPERTY_RULES={setPROPERTY_RULES} />
          </CardContent>
        </Card>
      </Grid>

      {/* ══ HOTEL FAQs ══════════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.primary.main)}>
          <Box sx={sectionHeader(theme.palette.primary.main)}>
            <SectionLabel
              icon='tabler:message-question'
              title='Frequently Asked Questions'
              description='Proactively answer common guest questions about the hotel'
              accent={theme.palette.primary.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
              <Tooltip title='Load predefined FAQs from setup' placement='top'>
                <span>
                  <IconButton size='small' color='primary' onClick={loadFaqPresets} disabled={faqsLoading}>
                    <Icon icon={faqsLoading ? 'tabler:loader-2' : 'tabler:database-import'} style={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <FaqsList PROPERTY_FAQS={PROPERTY_FAQS} setPROPERTY_FAQS={setPROPERTY_FAQS} />
          </CardContent>
        </Card>
      </Grid>
      {/* ══ NEARBY PLACES ════════════════════════════════════════════════════ */}
      <Grid item xs={12}>
        <Card sx={sectionCard(theme.palette.success.main)}>
          <Box sx={sectionHeader(theme.palette.success.main)}>
            <SectionLabel
              icon='tabler:map-2'
              title='Nearby Places'
              description='Attractions, transport links and landmarks shown on the map section of the hotel detail page'
              accent={theme.palette.success.main}
            />
          </Box>
          <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
            <NearbyList
              NEARBY_PLACES={NEARBY_PLACES}
              setNEARBY_PLACES={setNEARBY_PLACES}
              nearbyIconOptions={nearbyIconOptions}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default HotelDetailsSection
