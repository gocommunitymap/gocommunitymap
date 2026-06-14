import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Autocomplete } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Controller, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import { getRoomDetail, updateRoomDetail, deleteRoomDetail } from 'src/store'
import { getFeaturesAPI } from 'src/configs'
import {
  getGlobalParametersLOV_Extended,
  GLOBAL_PARAMETER_TYPES,
  getGlobalParametersGroupsLOV,
  getOptionsByTypeCode
} from 'src/@core/utils'
import FileUploaderMultiple from './fileUploaderMultiple'
import DeleteModal from 'src/views/components/modal/delete-modal'

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

const FaqsList = ({ ROOM_FAQS, setROOM_FAQS }) => {
  const theme = useTheme()

  const handleChange = (index, field, value) =>
    setROOM_FAQS(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))

  const addRow = () => setROOM_FAQS(prev => [...prev, { FAQ_ID: null, QUESTION: '', ANSWER: '' }])

  const removeRow = index =>
    setROOM_FAQS(prev => {
      const filtered = prev.filter((_, i) => i !== index)

      return filtered.length > 0 ? filtered : [{ FAQ_ID: null, QUESTION: '', ANSWER: '' }]
    })

  return (
    <Box>
      {ROOM_FAQS.map((item, index) => (
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
            placeholder='e.g. Check-in starts at CHECK_IN_TIMESLOT_DESC and check-out is by CHECK_OUT_TIMESLOT_DESC.'
            value={item.ANSWER}
            onChange={e => handleChange(index, 'ANSWER', e.target.value)}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
        </Box>
      ))}
      <Box
        onClick={() => {
          const last = ROOM_FAQS[ROOM_FAQS.length - 1]
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

const roomDefaultValues = {
  ROOM_ID: null,
  PROPERTY_TYPE_ID: null,
  BED_TYPE: '',
  MAX_GUESTS: '',
  ROOMS_QUANTITY: '',
  PRICE: '',
  ROOM_PICTURE_LINKS: [],
  VIDEO_VIRTUALS_LINK: '',
  BATHROOMS_ID: null,
  SIZE: '',
  UNITS_ID: null,
  SUMMARY: '',
  FULLDESCRIPTION: '',
  MEAL_PLAN: '',
  CANCELLATION_POLICY: '',
  PETS_ALLOWED: false
}

const RoomDetailSection = ({ propertyId }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const roomDetailStore = useSelector(state => state.roomDetail)

  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ROOM_FAQS, setROOM_FAQS] = useState([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
  const [faqsLoading, setFaqsLoading] = useState(false)
  const [roomFiles, setRoomFiles] = useState([])
  const [roomPictureLinks, setRoomPictureLinks] = useState([])
  const [summaryCount, setSummaryCount] = useState(255)
  const [deleteStates, setDeleteStates] = useState({ ROOM_ID: null })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [features, setFeatures] = useState([])
  const [featuresOptions, setFeaturesOptions] = useState([])
  const [CUSTOM_FEATURES, setCUSTOM_FEATURES] = useState([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])

  // Option lists
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([])
  const [bedTypeOptions, setBedTypeOptions] = useState([])
  const [bathroomsOptions, setBathroomsOptions] = useState([])
  const [floorsOptions, setFloorsOptions] = useState([])
  const [unitsOptions, setUnitsOptions] = useState([])
  const [mealPlanOptions, setMealPlanOptions] = useState([])
  const [cancellationOptions, setCancellationOptions] = useState([])

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: roomDefaultValues })

  const loadOptions = async () => {
    const globalParametersLOVData = await getGlobalParametersGroupsLOV(
      `${GLOBAL_PARAMETER_TYPES.ROOM_TYPE},${GLOBAL_PARAMETER_TYPES.BED_TYPE},${GLOBAL_PARAMETER_TYPES.BATHROOMS},${GLOBAL_PARAMETER_TYPES.FLOORS},${GLOBAL_PARAMETER_TYPES.UNITS},${GLOBAL_PARAMETER_TYPES.MEAL_PLAN},${GLOBAL_PARAMETER_TYPES.CANCELLATION_POLICY}`
    )

    const roomTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.ROOM_TYPE)
    const bedTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BED_TYPE)
    const bathrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BATHROOMS)
    const floors = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.FLOORS)
    const units = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.UNITS)
    const mealPlans = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.MEAL_PLAN)
    const cancellations = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.CANCELLATION_POLICY)

    if (roomTypes?.length) setPropertyTypeOptions(roomTypes)
    if (bedTypes?.length) setBedTypeOptions(bedTypes)
    if (bathrooms?.length) setBathroomsOptions(bathrooms)
    if (floors?.length) setFloorsOptions(floors)
    if (units?.length) setUnitsOptions(units)
    if (mealPlans?.length) setMealPlanOptions(mealPlans)
    if (cancellations?.length) setCancellationOptions(cancellations)
  }

  const loadFaqPresets = () => {
    setFaqsLoading(true)
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.ROOM_FAQ).then(d => {
      setFaqsLoading(false)
      if (!d?.length) return
      const presets = d.map((o, i) => ({ FAQ_ID: o.value, QUESTION: o.label, ANSWER: o.extra || '' }))
      setROOM_FAQS(prev => {
        const hasContent = prev.some(f => f.QUESTION?.trim())

        return hasContent ? [...prev, ...presets] : presets
      })
    })
  }

  const getCancellationColor = badge => {
    if (!badge) return 'default'
    if (/flexible|free.*any/i.test(badge)) return 'success'
    if (/non.?refund|strict/i.test(badge)) return 'error'
    if (/\d+\s*day/i.test(badge)) return 'warning'

    return 'info'
  }

  const loadFeatures = async (existingFeatures = []) => {
    const response = await getFeaturesAPI({ ACTIVE: true, TYPE: 3 })
    if (!response?.data?.length) return

    const data = response.data.map(row => ({
      ...row,
      checked: existingFeatures.length > 0 && Boolean(existingFeatures.find(f => f.FEATURES_ID === row.FEATURES_ID))
    }))

    const grouped = data.reduce((prev, curr) => {
      if (curr.FEATURES_TYPE_ID === null) {
        prev.push({ FEATURES_ID: curr.FEATURES_ID, FEATURES: curr.FEATURES, checked: curr.checked })
      } else {
        const existing = prev.find(g => g.FEATURES_TYPE_ID === curr.FEATURES_TYPE_ID)
        if (existing) {
          existing.detail.push({ FEATURES_ID: curr.FEATURES_ID, FEATURES: curr.FEATURES, checked: curr.checked })
        } else {
          prev.push({
            FEATURES_TYPE_ID: curr.FEATURES_TYPE_ID,
            DESCRIPTION: curr.FEATURES_TYPE,
            detail: [{ FEATURES_ID: curr.FEATURES_ID, FEATURES: curr.FEATURES, checked: curr.checked }]
          })
        }
      }

      return prev
    }, [])
    setFeaturesOptions(grouped)
  }

  useEffect(() => {
    loadOptions()
    loadFeatures()
    if (propertyId) {
      dispatch(getRoomDetail({ PROPERTY_ID: propertyId }))
    }
  }, [dispatch, propertyId])

  const isCheckedAll = typeId => {
    const group = featuresOptions.find(g => g.FEATURES_TYPE_ID === typeId)

    return group?.detail?.every(d => d.checked) ?? false
  }

  const isIndeterminate = typeId => {
    const group = featuresOptions.find(g => g.FEATURES_TYPE_ID === typeId)
    if (!group?.detail) return false
    const checkedCount = group.detail.filter(d => d.checked).length

    return checkedCount > 0 && checkedCount < group.detail.length
  }

  const checkedAllFeatures = (checked, typeId) => {
    const updated = featuresOptions.map(g => {
      if (g.FEATURES_TYPE_ID !== typeId) return g

      return { ...g, detail: g.detail.map(d => ({ ...d, checked })) }
    })
    setFeaturesOptions(updated)
    const allChecked = updated.flatMap(g => g.detail ?? []).filter(d => d.checked)
    setFeatures(allChecked)
  }

  const checkedFeatures = (e, item, typeId) => {
    const updated = featuresOptions.map(g => {
      if (g.FEATURES_TYPE_ID !== typeId) return g

      return {
        ...g,
        detail: g.detail.map(d => (d.FEATURES_ID === item.FEATURES_ID ? { ...d, checked: e.target.checked } : d))
      }
    })
    setFeaturesOptions(updated)
    const allChecked = updated.flatMap(g => g.detail ?? []).filter(d => d.checked)
    setFeatures(allChecked)
  }

  const handleEdit = row => {
    setValue('ROOM_ID', row.ROOM_ID)
    setValue(
      'PROPERTY_TYPE_ID',
      row.PROPERTY_TYPE_ID
        ? propertyTypeOptions.find(o => String(o.value) === String(row.PROPERTY_TYPE_ID)) ?? {
            value: row.PROPERTY_TYPE_ID,
            label: row.PROPERTY_TYPE_DESC ?? String(row.PROPERTY_TYPE_ID)
          }
        : null
    )
    setValue('BED_TYPE', row.BED_TYPE ?? '')
    setValue('MAX_GUESTS', row.MAX_GUESTS ?? '')
    setValue('ROOMS_QUANTITY', row.ROOMS_QUANTITY ?? '')
    setValue('PRICE', row.PRICE ?? '')
    setValue('VIDEO_VIRTUALS_LINK', row.VIDEO_VIRTUALS_LINK ?? '')
    setValue(
      'BATHROOMS_ID',
      row.BATHROOMS_ID ? { value: row.BATHROOMS_ID, label: row.BATHROOMS_DESC ?? String(row.BATHROOMS_ID) } : null
    )
    setValue('SIZE', row.SIZE ?? '')
    setValue('UNITS_ID', row.UNITS_ID ? { value: row.UNITS_ID, label: row.UNITS_DESC ?? String(row.UNITS_ID) } : null)
    setValue('SUMMARY', row.SUMMARY ?? '')
    setValue('FULLDESCRIPTION', row.FULLDESCRIPTION ?? '')
    setValue('MEAL_PLAN', row.MEAL_PLAN ?? '')
    setValue('CANCELLATION_POLICY', row.CANCELLATION_POLICY ?? '')
    setValue('PETS_ALLOWED', row.PETS_ALLOWED ?? false)
    setROOM_FAQS(row.ROOM_FAQS?.length ? JSON.parse(row.ROOM_FAQS) : [{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
    const pics = row.ROOM_PICTURE_LINKS?.length ? JSON.parse(row.ROOM_PICTURE_LINKS) : []
    setRoomPictureLinks(pics)
    const existingFeatures = row.ROOM_FEATURES?.length ? JSON.parse(row.ROOM_FEATURES) : []

    const existingCustom = row.ROOM_CUSTOM_FEATURES?.length
      ? JSON.parse(row.ROOM_CUSTOM_FEATURES)
      : [{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }]
    setCUSTOM_FEATURES(existingCustom)
    loadFeatures(existingFeatures)
    setRoomFiles([])
    setSummaryCount(255 - (row.SUMMARY?.length ?? 0))
    setModalOpen(true)
  }

  const handleAdd = () => {
    reset(roomDefaultValues)
    setRoomFiles([])
    setRoomPictureLinks([])
    setFeatures([])
    setCUSTOM_FEATURES([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])
    setROOM_FAQS([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
    loadFeatures()
    setSummaryCount(255)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    reset(roomDefaultValues)
    setRoomFiles([])
    setRoomPictureLinks([])
    setFeatures([])
    setCUSTOM_FEATURES([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])
    setROOM_FAQS([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
    loadFeatures()
  }

  const onSubmit = data => {
    if (!propertyId) {
      toast.error('Please save the hotel record first before adding rooms.', { position: 'top-center' })

      return
    }
    setIsSubmitting(true)
    const featuresList = featuresOptions.flatMap(g => g.detail ?? []).filter(d => d.checked)
    dispatch(
      updateRoomDetail({
        data: {
          ROOM_ID: data.ROOM_ID ?? null,
          PROPERTY_ID: propertyId,
          PROPERTY_TYPE_ID: data.PROPERTY_TYPE_ID?.value ?? null,
          BED_TYPE: data.BED_TYPE || null,
          MAX_GUESTS: data.MAX_GUESTS ? Number(data.MAX_GUESTS) : null,
          ROOMS_QUANTITY: data.ROOMS_QUANTITY ? Number(data.ROOMS_QUANTITY) : null,
          PRICE: data.PRICE ?? null,
          VIDEO_VIRTUALS_LINK: data.VIDEO_VIRTUALS_LINK || null,
          BATHROOMS_ID: data.BATHROOMS_ID?.value ?? null,
          SIZE: data.SIZE || null,
          UNITS_ID: data.UNITS_ID?.value ?? null,
          SUMMARY: data.SUMMARY || null,
          FULLDESCRIPTION: data.FULLDESCRIPTION || null,
          MEAL_PLAN: data.MEAL_PLAN || null,
          CANCELLATION_POLICY: data.CANCELLATION_POLICY || null,
          PETS_ALLOWED: Boolean(data.PETS_ALLOWED),
          ROOM_FAQS: ROOM_FAQS.filter(f => f.QUESTION?.trim()).map(item => ({
            FAQ_ID: item.FAQ_ID,
            QUESTION: item.QUESTION,
            ANSWER: item.ANSWER,
            PROPERTY_ID: propertyId,
            ROOM_ID: data.ROOM_ID ?? null
          })),
          ROOM_PICTURE_LINKS: roomPictureLinks,
          ROOM_FEATURES: featuresList.map(f => ({
            FEATURES_ID: f.FEATURES_ID,
            PROPERTY_ID: propertyId,
            ROOM_ID: data.ROOM_ID ?? null
          })),
          ROOM_CUSTOM_FEATURES: CUSTOM_FEATURES.filter(c => c.DESCRIPTION?.trim()).map(c => ({
            CUSTOM_FEATURES_ID: c.CUSTOM_FEATURES_ID,
            DESCRIPTION: c.DESCRIPTION,
            PROPERTY_ID: propertyId,
            ROOM_ID: data.ROOM_ID ?? null
          }))
        },
        files: roomFiles
      })
    ).then(() => {
      setIsSubmitting(false)
      handleClose()
      toast.success('Room saved successfully', { position: 'top-center' })
    })
  }

  const handleConfirmDelete = row => {
    setDeleteStates({ ROOM_ID: row.ROOM_ID, PROPERTY_ID: propertyId })
    setDeleteModalOpen(true)
  }

  const onDelete = () => {
    dispatch(deleteRoomDetail(deleteStates)).then(() => {
      setDeleteModalOpen(false)
      setDeleteStates({ ROOM_ID: null })
      toast.success('Room deleted', { position: 'top-center' })
    })
  }

  const columns = [
    {
      field: 'ROOM_TYPE_DESC',
      headerName: 'Room Type',
      flex: 1.2,
      minWidth: 120

      // valueGetter: row =>
      //   propertyTypeOptions?.find(o => String(o.value) === String(row?.PROPERTY_TYPE_ID))?.label ??
      //   row.PROPERTY_TYPE_DESC ??
      //   row.PROPERTY_TYPE_ID
    },
    { field: 'BED_TYPE', headerName: 'Bed Type', flex: 1, minWidth: 100 },
    {
      field: 'MAX_GUESTS',
      headerName: 'Max Guests',
      width: 100,
      type: 'number'
    },
    {
      field: 'PRICE',
      headerName: 'Rate ($/night)',
      width: 120,
      type: 'number',
      valueFormatter: ({ value }) => (value != null ? `$${value}` : '-')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={() => handleEdit(row)}>
              <Icon icon='tabler:pencil' style={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' color='error' onClick={() => handleConfirmDelete(row)}>
              <Icon icon='tabler:trash' style={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const rows = Array.isArray(roomDetailStore.data) ? roomDetailStore.data : []

  return (
    <>
      <Card sx={sectionCard(theme.palette.info.main)}>
        <Box sx={sectionHeader(theme.palette.info.main)}>
          <Box sx={sectionInner(theme.palette.info.main)}>
            <Box sx={sectionIconBox(theme.palette.info.main)}>
              <Icon icon='tabler:door' style={{ fontSize: 22, color: theme.palette.info.main }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                Rooms
              </Typography>
              <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}>
                Manage individual room configurations, pricing, photos and amenities
              </Typography>
            </Box>
            <Button
              size='small'
              variant='contained'
              startIcon={<Icon icon='tabler:plus' />}
              onClick={handleAdd}
              disabled={!propertyId}
              sx={{ flexShrink: 0 }}
            >
              Add Room
            </Button>
          </Box>
        </Box>
        <CardContent sx={{ pt: 0 }}>
          {!propertyId && (
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2, fontStyle: 'italic' }}>
              Save the hotel record above to enable room management.
            </Typography>
          )}
          <DataGrid autoHeight rows={rows} columns={columns} getRowId={row => row.ROOM_ID} />
        </CardContent>
      </Card>

      <DeleteModal
        isOpen={deleteModalOpen}
        title={`Delete Room`}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={onDelete}
      />

      <Dialog open={modalOpen} onClose={handleClose} maxWidth='md' fullWidth scroll='paper'>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
          <Icon icon='tabler:door' style={{ fontSize: 22, color: theme.palette.info.main }} />
          <Typography variant='h6' fontWeight={700}>
            {watch('ROOM_ID') ? 'Edit Room' : 'Add Room'}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton size='small' onClick={handleClose}>
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent>
          <form id='room-form' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <Card sx={sectionCard(theme.palette.primary.main)}>
                  <Box sx={sectionHeader(theme.palette.primary.main)}>
                    <Box sx={sectionInner(theme.palette.primary.main)}>
                      <Box sx={sectionIconBox(theme.palette.primary.main)}>
                        <Icon icon='tabler:bed' style={{ fontSize: 22, color: theme.palette.primary.main }} />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                          Room Details
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                          Room type, bed type and guest capacity
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
                            rules={{ required: 'Required' }}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                size='small'
                                options={propertyTypeOptions}
                                value={field.value?.value ? field.value : null}
                                getOptionLabel={o => o.label ?? ''}
                                isOptionEqualToValue={(opt, val) => String(opt.value) === String(val?.value)}
                                onChange={(_, v) => field.onChange(v)}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='ROOM TYPE*'
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
                          <InputLabel shrink>Bed Type</InputLabel>
                          <Controller
                            name='BED_TYPE'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                displayEmpty
                                notched
                                size='small'
                                label='Bed Type'
                                value={field.value ?? ''}
                                sx={{ borderRadius: 1 }}
                                startAdornment={
                                  <InputAdornment position='start'>
                                    <Icon
                                      icon='tabler:bed'
                                      style={{ fontSize: 16, color: theme.palette.text.disabled }}
                                    />
                                  </InputAdornment>
                                }
                                renderValue={v =>
                                  v ? (
                                    bedTypeOptions.find(o => o.value === v)?.label || v
                                  ) : (
                                    <Typography color='text.disabled'>Select bed type</Typography>
                                  )
                                }
                              >
                                <MenuItem value=''>- Not set -</MenuItem>
                                {bedTypeOptions.map(opt => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <Controller
                            name='ROOMS_QUANTITY'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value ?? ''}
                                inputProps={{ min: 1 }}
                                label='ROOMS QUENTITY'
                                onChange={onChange}
                                placeholder='e.g. 5'
                                size='small'
                                type='number'
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                      <Icon
                                        icon='tabler:door'
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={sectionCard(theme.palette.warning.main)}>
                  <Box sx={sectionHeader(theme.palette.warning.main)}>
                    <Box sx={sectionInner(theme.palette.warning.main)}>
                      <Box sx={sectionIconBox(theme.palette.warning.main)}>
                        <Icon
                          icon='tabler:currency-dollar'
                          style={{ fontSize: 22, color: theme.palette.warning.main }}
                        />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                          Pricing
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                          Nightly rate displayed to guests on the booking screen
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
                                inputProps={{ maxLength: 20 }}
                                label='RATES*'
                                onChange={onChange}
                                placeholder='e.g. 149'
                                size='small'
                                type='number'
                                error={Boolean(errors.PRICE)}
                                helperText={Boolean(errors.PRICE) && 'Required'}
                                InputProps={{ startAdornment: '$' }}
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
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                          Upload room photos - showcase the space to attract more bookings
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FileUploaderMultiple
                          files={roomFiles}
                          setFiles={setRoomFiles}
                          PICTURE_LINKS={roomPictureLinks}
                          setPICTURE_LINKS={setRoomPictureLinks}
                        />
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
                        <Icon icon='tabler:video' style={{ fontSize: 22, color: theme.palette.secondary.main }} />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                          Video / Virtual Tour
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                          Paste a YouTube, Vimeo or 360Â° tour link
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
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
                <Card sx={sectionCard(theme.palette.success.main)}>
                  <Box sx={sectionHeader(theme.palette.success.main)}>
                    <Box sx={sectionInner(theme.palette.success.main)}>
                      <Box sx={sectionIconBox(theme.palette.success.main)}>
                        <Icon
                          icon='tabler:file-description'
                          style={{ fontSize: 22, color: theme.palette.success.main }}
                        />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                          Description
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                          Room dimensions, amenities and detailed description
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size='small'>
                          <Controller
                            name='BATHROOMS_ID'
                            control={control}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                size='small'
                                options={bathroomsOptions}
                                value={field.value?.value ? field.value : null}
                                getOptionLabel={o => o.label}
                                onChange={(_, v) => field.onChange(v)}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='BATHROOMS'
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
                                placeholder='e.g. 32'
                                size='small'
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
                            render={({ field }) => (
                              <Autocomplete
                                size='small'
                                options={unitsOptions}
                                value={field.value?.value ? field.value : null}
                                getOptionLabel={o => o.label}
                                onChange={(_, v) => field.onChange(v)}
                                renderInput={params => <TextField {...params} label='UNITS' />}
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
                                minRows={3}
                                inputProps={{ maxLength: 255 }}
                                label='SUMMARY'
                                onChange={onChange}
                                onKeyUp={e => setSummaryCount(255 - e.target.value.length)}
                                placeholder='Brief room summary'
                                size='small'
                              />
                            )}
                          />
                          <FormLabel sx={{ fontSize: 12 }}>Characters remaining {summaryCount}</FormLabel>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <Controller
                            name='FULLDESCRIPTION'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                multiline
                                minRows={5}
                                inputProps={{ maxLength: 2000 }}
                                label='FULL DESCRIPTION'
                                onChange={onChange}
                                placeholder='Full room description'
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
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                          Select amenities available in this specific room
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
                              {row.detail?.map((item, i2) => (
                                <FormControlLabel
                                  key={i2}
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
                    {/* Custom features */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
                        Custom Features
                      </Typography>
                      {CUSTOM_FEATURES.map((cf, idx) => (
                        <Box key={cf.CUSTOM_FEATURES_ID} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            size='small'
                            fullWidth
                            placeholder='e.g. Rain shower'
                            value={cf.DESCRIPTION}
                            onChange={e => {
                              const updated = CUSTOM_FEATURES.map((c, i) =>
                                i === idx ? { ...c, DESCRIPTION: e.target.value } : c
                              )
                              setCUSTOM_FEATURES(updated)
                            }}
                          />
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => {
                              if (CUSTOM_FEATURES.length === 1) {
                                setCUSTOM_FEATURES([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])
                              } else {
                                setCUSTOM_FEATURES(CUSTOM_FEATURES.filter((_, i) => i !== idx))
                              }
                            }}
                          >
                            <Icon icon='tabler:trash' style={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        size='small'
                        variant='outlined'
                        startIcon={<Icon icon='tabler:plus' />}
                        onClick={() =>
                          setCUSTOM_FEATURES([
                            ...CUSTOM_FEATURES,
                            { CUSTOM_FEATURES_ID: CUSTOM_FEATURES.length + 1, DESCRIPTION: '', PROPERTY_ID: 0 }
                          ])
                        }
                      >
                        Add Custom Feature
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={sectionCard(theme.palette.secondary.main)}>
                  <Box sx={sectionHeader(theme.palette.secondary.main)}>
                    <Box sx={sectionInner(theme.palette.secondary.main)}>
                      <Box sx={sectionIconBox(theme.palette.secondary.main)}>
                        <Icon icon='tabler:receipt' style={{ fontSize: 22, color: theme.palette.secondary.main }} />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                          Policies
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                        >
                          Meal inclusions, cancellation terms and pet policy for this room type
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={5}>
                        <FormControl fullWidth size='small'>
                          <InputLabel>Meal Plan</InputLabel>
                          <Controller
                            name='MEAL_PLAN'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                displayEmpty
                                size='small'
                                label='Meal Plan'
                                value={field.value ?? ''}
                                sx={{ borderRadius: 1 }}
                                startAdornment={
                                  <InputAdornment position='start'>
                                    <Icon
                                      icon='tabler:tools-kitchen-2'
                                      style={{ fontSize: 16, color: theme.palette.text.disabled }}
                                    />
                                  </InputAdornment>
                                }
                                renderValue={v =>
                                  v ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Icon icon='tabler:tools-kitchen-2' style={{ fontSize: 15 }} />
                                      {mealPlanOptions.find(o => o.value === v)?.label || v}
                                    </Box>
                                  ) : (
                                    <Typography color='text.disabled'>Select plan</Typography>
                                  )
                                }
                              >
                                <MenuItem value=''>- Not set -</MenuItem>
                                {mealPlanOptions.map(opt => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    <Typography variant='body2' fontWeight={600}>
                                      {opt.label}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <FormControl fullWidth size='small'>
                          <InputLabel>Cancellation Policy</InputLabel>
                          <Controller
                            name='CANCELLATION_POLICY'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                displayEmpty
                                size='small'
                                label='Cancellation Policy'
                                value={field.value ?? ''}
                                sx={{ borderRadius: 1 }}
                                startAdornment={
                                  <InputAdornment position='start'>
                                    <Icon
                                      icon='tabler:calendar-x'
                                      style={{ fontSize: 16, color: theme.palette.text.disabled }}
                                    />
                                  </InputAdornment>
                                }
                                renderValue={v => {
                                  if (!v) return <Typography color='text.disabled'>Select policy</Typography>
                                  const opt = cancellationOptions.find(o => o.value === v)

                                  return (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip
                                        label={opt?.extra || 'Custom'}
                                        size='small'
                                        color={getCancellationColor(opt?.extra)}
                                        sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
                                      />
                                      <Typography variant='body2' sx={{ fontSize: 12 }}>
                                        {opt?.label || v}
                                      </Typography>
                                    </Box>
                                  )
                                }}
                              >
                                <MenuItem value=''>- Not set -</MenuItem>
                                {cancellationOptions.map(opt => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Chip
                                        label={opt.extra || opt.label}
                                        size='small'
                                        color={getCancellationColor(opt.extra)}
                                        sx={{ height: 20, fontSize: 10, fontWeight: 700, minWidth: 52 }}
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
                      <Grid item xs={12}>
                        <Tooltip title='Guests will see a pets-welcome indicator on this room type'>
                          <Box
                            sx={{
                              maxWidth: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 1.25,
                              px: 2,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: '#cccdd2'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Icon icon='tabler:paw' style={{ fontSize: 20, color: theme.palette.text.secondary }} />
                              <Typography variant='body2' fontWeight={600} color='text.primary'>
                                Pets Allowed
                              </Typography>
                            </Box>
                            <Controller
                              name='PETS_ALLOWED'
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <Switch color='primary' checked={Boolean(value)} onChange={onChange} />
                              )}
                            />
                          </Box>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={sectionCard(theme.palette.primary.main)}>
                  <Box sx={sectionHeader(theme.palette.primary.main)}>
                    <Box sx={sectionInner(theme.palette.primary.main)}>
                      <Box sx={sectionIconBox(theme.palette.primary.main)}>
                        <Icon
                          icon='tabler:message-question'
                          style={{ fontSize: 22, color: theme.palette.primary.main }}
                        />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={700} color='text.primary' lineHeight={1.2}>
                          Frequently Asked Questions
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}
                        >
                          Proactively answer common guest questions about this room
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
                      <Tooltip title='Load predefined FAQs from setup' placement='top'>
                        <span>
                          <IconButton size='small' color='primary' onClick={loadFaqPresets} disabled={faqsLoading}>
                            <Icon
                              icon={faqsLoading ? 'tabler:loader-2' : 'tabler:database-import'}
                              style={{ fontSize: 18 }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                    <FaqsList ROOM_FAQS={ROOM_FAQS} setROOM_FAQS={setROOM_FAQS} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            type='submit'
            form='room-form'
            variant='contained'
            loading={isSubmitting}
            startIcon={<Icon icon='tabler:device-floppy' />}
          >
            Save Room
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RoomDetailSection
