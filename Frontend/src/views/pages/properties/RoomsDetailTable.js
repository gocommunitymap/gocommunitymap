import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useRouter } from 'next/router'
import { use, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { getGlobalParametersLOV, getGlobalParametersLOV_Extended, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'
import { getGlobalParametersAPI } from 'src/configs'

const columns = [
  { id: 'roomType', label: 'Room Type', width: 150, align: 'left' },
  { id: 'guests', label: 'Guests', width: 60, align: 'center' },
  { id: 'price', label: 'Price for [value] Night(s)', width: 120, align: 'center' },
  { id: 'choice', label: 'Your Choice', width: 100, align: 'center' },
  { id: 'select', label: 'Selection', width: 60, align: 'center' }
]

const safeParseJSON = (value, fallback = []) => {
  if (!value) return fallback
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const RoomsDetailTable = ({ data, rooms = [], searchParams = {}, onRoomSelect, onReserve }) => {
  const roomDetails = rooms
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mealPlanOptions, setMealPlanOptions] = useState([])
  const [cancellationOptions, setCancellationOptions] = useState([])
  const [appsetParams, setAppsetParams] = useState([])

  useEffect(() => {
    getGlobalParametersAPI({ TYPE_CODE: GLOBAL_PARAMETER_TYPES.APPLICATION_SETTING })
      .then(res => setAppsetParams(res?.data || []))
      .catch(() => {})
    getGlobalParametersLOV(GLOBAL_PARAMETER_TYPES.MEAL_PLAN).then(d => {
      if (d?.length) setMealPlanOptions(d)
    })
    getGlobalParametersLOV_Extended(GLOBAL_PARAMETER_TYPES.CANCELLATION_POLICY).then(d => {
      if (d?.length) setCancellationOptions(d)
    })
  }, [])

  const checkIn = searchParams.checkIn || ''
  const checkOut = searchParams.checkOut || ''

  const totalNights =
    checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1

  const featureList = safeParseJSON(data?.PROPERTY_FEATURES)

  const getPropertyImage = () => {
    try {
      const pics = JSON.parse(data?.PICTURE_LINKS || '[]')

      return (Array.isArray(pics) && pics[0]?.LINK) || (typeof pics[0] === 'string' ? pics[0] : '') || ''
    } catch {
      return ''
    }
  }

  const handleReserveAll = () => {
    if (onReserve) {
      onReserve(null)

      return
    }

    const subtotal = selectedRooms.reduce((sum, s) => sum + (s.room?.PRICE || 0) * totalNights * s.quantity, 0)
    const feeLines = appsetParams.map(p => Math.round(subtotal * ((parseFloat(p.PARAMETER_DESCRIPTION_4) || 0) / 100)))
    const serviceFee = feeLines.reduce((sum, a) => sum + a, 0)
    const total = subtotal + serviceFee

    const roomsParam = JSON.stringify(
      selectedRooms.map(s => ({
        name: s.room?.ROOM_TYPE_DESC || s.room?.SUMMARY,
        price: s.room?.PRICE,
        qty: s.quantity
      }))
    )

    const params = new URLSearchParams({
      propertyId: data?.PROPERTY_ID || '',
      propertyName: data?.PROPERTY_NUM_NAME || '',
      propertyImage: getPropertyImage(),
      place: data?.PLACE || '',
      checkIn,
      checkOut,
      nights: String(totalNights),
      adults: String(searchParams.adults || 2),
      children: String(searchParams.children || 0),
      subtotal: String(subtotal),
      serviceFee: String(serviceFee),
      total: String(total),
      selectedRooms: roomsParam
    })
    router.push(`/hotels/booking/details?${params.toString()}`)
  }

  const handleReserveInternal = room => {
    if (onReserve) {
      onReserve(room)

      return
    }
    const qty = selectedRooms.find(r => r.roomId === room.ROOM_ID)?.quantity || 1
    const subtotal = (room.PRICE || 0) * totalNights * qty
    const feeLines = appsetParams.map(p => Math.round(subtotal * ((parseFloat(p.PARAMETER_DESCRIPTION_4) || 0) / 100)))
    const serviceFee = feeLines.reduce((sum, a) => sum + a, 0)
    const total = subtotal + serviceFee

    const params = new URLSearchParams({
      propertyId: data?.PROPERTY_ID || '',
      propertyName: data?.PROPERTY_NUM_NAME || '',
      propertyImage: getPropertyImage(),
      place: data?.PLACE || '',
      pricePerNight: String(room.PRICE || 0),
      checkIn,
      checkOut,
      nights: String(totalNights),
      adults: String(searchParams.adults || 2),
      children: String(searchParams.children || 0),
      rooms: String(searchParams.rooms || 1),
      subtotal: String(subtotal),
      serviceFee: String(serviceFee),
      total: String(total)
    })
    router.push(`/hotels/booking/details?${params.toString()}`)
  }

  // const selectedRooms = JSON.parse(data?.SELECTED_ROOMS || '[]')
  const [selectedRooms, setSelectedRooms] = useState([])
  const [expandedRooms, setExpandedRooms] = useState({}) // Track which rooms have expanded features

  const toggleRoomFeatures = roomId => {
    setExpandedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }))
  }

  const handleSelectionChange = (room, quantity) => {
    const roomId = room.ROOM_ID
    setSelectedRooms(prev => {
      if (quantity === 0) return prev.filter(r => r.roomId !== roomId)
      const existing = prev.find(r => r.roomId === roomId)
      if (existing) {
        return prev.map(r => (r.roomId === roomId ? { ...r, quantity } : r))
      } else {
        return [...prev, { roomId, quantity, room }]
      }
    })
    if (onRoomSelect) onRoomSelect(room, quantity)
  }

  useEffect(() => {
    rooms.forEach(room => {
      const selected = selectedRooms.find(r => r.roomId === room.ROOM_ID)
      if (selected) {
        handleSelectionChange(room, selected.quantity)
      }
    })
  }, [rooms])

  if (!roomDetails.length) return null

  // Mobile: stacked card layout
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {roomDetails.map((room, index) => {
          const roomFeatures = safeParseJSON(room.ROOM_FEATURES, featureList)
          const availableRooms = room.AVAILABLE_QUANTITY ?? 1

          return (
            <Paper
              key={room.ROOM_ID ?? index}
              variant='outlined'
              sx={{ p: 2, borderRadius: 2, borderColor: '#e0e0e0' }}
            >
              {/* Room name + availability */}
              <Stack direction='row' justifyContent='space-between' alignItems='flex-start' mb={1}>
                <Typography variant='subtitle1' fontWeight={700} sx={{ flex: 1, mr: 1 }}>
                  {room.ROOM_TYPE_DESC}
                </Typography>
                {availableRooms <= 20 && (
                  <Chip
                    variant='filled'
                    size='small'
                    color='error'
                    sx={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                    icon={<IconifyIcon icon='tabler:clock-filled' width={10} />}
                    label={
                      <Typography variant='body2' fontSize={9} fontWeight='bold'>
                        ONLY {availableRooms} LEFT
                      </Typography>
                    }
                  />
                )}
              </Stack>

              {/* Features */}
              {roomFeatures.length > 0 && (
                <>
                  <Grid container spacing={1} mb={1.5}>
                    {roomFeatures.slice(0, expandedRooms[room.ROOM_ID] ? roomFeatures.length : 10).map((feature, i) => (
                      <Grid item xs={6} key={i} display='flex' alignItems='flex-start' gap={0.5}>
                        <IconifyIcon icon='tabler:circle-check' width={10} color='#1E4D2B' />
                        <Typography fontSize={9} color='primary.main'>
                          {feature.FEATURES}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                  {roomFeatures.length > 10 && (
                    <Button
                      size='small'
                      fullWidth
                      sx={{
                        fontSize: '9px',
                        fontWeight: 600,
                        color: '#1E4D2B',
                        textTransform: 'none',
                        mb: 1.5,
                        '&:hover': { backgroundColor: '#e3f2fd' }
                      }}
                      onClick={() => toggleRoomFeatures(room.ROOM_ID)}
                    >
                      {expandedRooms[room.ROOM_ID] ? '− Show Less' : `+ Show More (${roomFeatures.length - 10})`}
                    </Button>
                  )}
                </>
              )}

              <Divider sx={{ my: 1.5 }} />

              {/* Guests + price */}
              <Stack direction='row' justifyContent='space-between' alignItems='center' mb={1}>
                <Stack direction='row' spacing={0.3} alignItems='center'>
                  {Array.from({ length: room.MAX_GUESTS || 1 }).map((_, i) => (
                    <IconifyIcon key={i} icon='tabler:user-filled' width={14} />
                  ))}
                  <Typography fontSize={11} color='text.secondary' ml={0.5}>
                    {room.MAX_GUESTS || 1} guest{(room.MAX_GUESTS || 1) !== 1 ? 's' : ''}
                  </Typography>
                </Stack>
                <Box textAlign='right'>
                  <Typography variant='subtitle1' fontWeight={700}>
                    ${room.PRICE || 0}
                    <Typography component='span' fontSize={10} color='text.secondary' ml={0.5}>
                      / night
                    </Typography>
                  </Typography>
                  <Typography fontSize={10} color='text.secondary'>
                    + taxes & fees
                  </Typography>
                </Box>
              </Stack>

              {/* Meal plan + cancellation */}
              {(room.MEAL_PLAN || room.CANCELLATION_POLICY) && (
                <Stack spacing={0.5} mb={1.5}>
                  {room.MEAL_PLAN && (
                    <Stack direction='row' spacing={0.5} alignItems='center'>
                      <IconifyIcon icon='tabler:tools-kitchen-2' width={14} color='#1E4D2B' />
                      <Typography fontSize={11} color='primary.dark' fontWeight={600}>
                        {mealPlanOptions.find(o => String(o.value) === String(room.MEAL_PLAN))?.label || room.MEAL_PLAN}
                      </Typography>
                    </Stack>
                  )}
                  {room.CANCELLATION_POLICY && (
                    <Stack direction='row' spacing={0.5} alignItems='center'>
                      <IconifyIcon icon='tabler:circle-check' width={14} color='#1E4D2B' />
                      <Typography fontSize={11} color='primary.dark' fontWeight={600}>
                        {cancellationOptions.find(o => String(o.value) === String(room.CANCELLATION_POLICY))?.label ||
                          room.CANCELLATION_POLICY}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}

              {/* Selection + reserve */}
              <Stack direction='row' spacing={1.5} alignItems='center' justifyContent='flex-end'>
                <Select
                  size='small'
                  sx={{ fontSize: '12px', height: 32, width: 60 }}
                  disabled={availableRooms === 0}
                  value={selectedRooms.find(r => r.roomId === room.ROOM_ID)?.quantity || 0}
                  onChange={e => handleSelectionChange(room, e.target.value)}
                >
                  <MenuItem value={0}>—</MenuItem>
                  {Array.from({ length: availableRooms }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant='contained'
                  size='small'
                  disabled={availableRooms === 0}
                  onClick={() => handleReserveInternal(room)}
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    py: 0.7,
                    px: 2,
                    borderRadius: 1,
                    backgroundColor: '#27ae60',
                    '&:hover': { backgroundColor: '#229954' },
                    '&.Mui-disabled': { backgroundColor: '#ccc' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Reserve
                </Button>
              </Stack>
            </Paper>
          )
        })}
      </Stack>
    )
  }

  // Desktop: scrollable table
  return (
    <>
      <Box sx={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1E4D2B', color: '#fff' }}>
            <TableRow>
              {columns.map((column, idx) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.width || 'auto',
                    fontSize: '8px !important',
                    borderRight: idx !== columns.length - 1 ? '1px solid #317e47' : 'none',
                    fontWeight: 700,
                    lineHeight: '1.5 !important',
                    letterSpacing: '0 ',
                    px: 0,
                    py: 2.8,
                    position: 'sticky',
                    top: 0,
                    zIndex: 3,
                    bgcolor: '#1E4D2B',
                    color: '#fff',
                    ...(idx === 0 && { borderStartStartRadius: 15 }),
                    ...(idx === columns.length - 1 && { borderStartEndRadius: 15 })
                  }}
                >
                  {column.label.replace('[value]', totalNights)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roomDetails.map((room, index) => {
              const roomFeatures = safeParseJSON(room.ROOM_FEATURES, featureList)
              const availableRooms = room.AVAILABLE_QUANTITY ?? 1

              return (
                <TableRow
                  key={room.ROOM_ID ?? index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#fff'
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: '#f4f4f4'
                    }
                  }}
                >
                  <TableCell sx={{ p: 0 }}>
                    <Box sx={{ p: 0, m: 0 }}>
                      <Typography variant='subtitle1' fontWeight={700}>
                        {room.ROOM_TYPE_DESC}
                      </Typography>
                      {availableRooms == 0 ? (
                        <Chip
                          variant='filled'
                          sx={{
                            color: '#DC2626',
                            backgroundColor: '#FEF2F2',
                            py: 0
                          }}
                          color='error'
                          label={
                            <Typography sx={{ mx: 0, px: 0 }} variant='body2' fontSize={9} fontWeight='bold'>
                              SOLD OUT
                            </Typography>
                          }
                          size='small'
                          icon={<IconifyIcon icon='tabler:clock-filled' width={10} />}
                        />
                      ) : (
                        availableRooms <= 20 && (
                          <Chip
                            variant='filled'
                            sx={{
                              color: '#DC2626',
                              backgroundColor: '#FEF2F2',
                              py: 0
                            }}
                            color='error'
                            label={
                              <Typography sx={{ mx: 0, px: 0 }} variant='body2' fontSize={9} fontWeight='bold'>
                                ONLY {availableRooms} ROOM(S) LEFT
                              </Typography>
                            }
                            size='small'
                            icon={<IconifyIcon icon='tabler:clock-filled' width={10} />}
                          />
                        )
                      )}
                    </Box>
                    <Grid container spacing={2} mt={3}>
                      {roomFeatures
                        .slice(0, expandedRooms[room.ROOM_ID] ? roomFeatures.length : 10)
                        .map((feature, index) => (
                          <Grid item xs={12} md={6} key={index} display='flex' alignItems='flex-start' gap={0.5}>
                            <IconifyIcon
                              icon='tabler:circle-check'
                              width={10}
                              color='#1E4D2B'
                              style={{ marginTop: 2 }}
                            />
                            <Typography fontSize={9} color='primary.main'>
                              {feature.FEATURES}
                            </Typography>
                          </Grid>
                        ))}
                      {roomFeatures.length > 10 && (
                        <Grid item xs={12} md={6}>
                          <Button
                            size='small'
                            sx={{
                              fontSize: '9px',
                              fontWeight: 600,
                              color: '#1E4D2B',
                              textTransform: 'none',
                              p: 0,
                              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                            }}
                            onClick={() => toggleRoomFeatures(room.ROOM_ID)}
                          >
                            {expandedRooms[room.ROOM_ID] ? '− Show Less' : `+ Show More (${roomFeatures.length - 10})`}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell align='center'>
                    {Array.from({ length: room.MAX_GUESTS || 1 }).map((_, i) => (
                      <IconifyIcon key={i} icon='tabler:user-filled' width={12} />
                    ))}
                  </TableCell>
                  <TableCell align='center'>
                    <Typography textAlign='center' variant='subtitle1' fontWeight={700}>
                      ${room.PRICE || 0}
                    </Typography>
                    <Typography variant='body2' textAlign='center' fontSize={9} sx={{ ml: 1, lineHeight: 1 }}>
                      per night
                    </Typography>
                    <Typography variant='body2' textAlign='center' fontSize={9}>
                      + taxes and fees
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    {/* MEAL_PLAN */}
                    {room.MEAL_PLAN && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, my: 2 }}>
                        <Typography fontSize={9} color='primary.light'>
                          <IconifyIcon icon='tabler:tools-kitchen-2' width={20} />
                        </Typography>
                        <Typography variant='body2' color='primary.dark' textAlign='left' fontSize={9} fontWeight={700}>
                          {mealPlanOptions.find(o => String(o.value) === String(room.MEAL_PLAN))?.label ||
                            room.MEAL_PLAN}
                        </Typography>
                      </Box>
                    )}
                    {/* CANCELLATION_POLICY */}
                    {room.CANCELLATION_POLICY && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, my: 2 }}>
                        <Typography fontSize={9} color='primary.light'>
                          <IconifyIcon icon='tabler:circle-check' width={20} />
                        </Typography>
                        <Typography variant='body2' color='primary.dark' textAlign='left' fontSize={9} fontWeight={700}>
                          {cancellationOptions.find(o => String(o.value) === String(room.CANCELLATION_POLICY))?.label ||
                            room.CANCELLATION_POLICY}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    <Select
                      size='small'
                      sx={{
                        fontSize: '12px !important',
                        height: 32,
                        width: 50,
                        bgcolor: availableRooms === 0 ? 'grey.200' : 'transparent',
                        '& .MuiSelect-select': { m: 0, p: 0, pl: 3, textAlign: 'left' }
                      }}
                      disabled={availableRooms === 0}
                      value={selectedRooms.find(r => r.roomId === room.ROOM_ID)?.quantity || 0}
                      onChange={e => handleSelectionChange(room, e.target.value)}
                    >
                      <MenuItem value={0}>0</MenuItem>
                      {Array.from({ length: availableRooms }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant='contained'
          disabled={selectedRooms.length === 0}
          onClick={handleReserveAll}
          sx={{
            fontWeight: 700,
            px: 4,
            py: 1,
            borderRadius: 2,
            backgroundColor: '#27ae60',
            '&:hover': { backgroundColor: '#229954' },
            '&.Mui-disabled': { backgroundColor: '#ccc' }
          }}
        >
          Reserve{' '}
          {selectedRooms.length > 0
            ? `(${selectedRooms.reduce((s, r) => s + r.quantity, 0)} room${
                selectedRooms.reduce((s, r) => s + r.quantity, 0) !== 1 ? 's' : ''
              })`
            : ''}
        </Button>
      </Box>
    </>
  )
}

export default RoomsDetailTable
