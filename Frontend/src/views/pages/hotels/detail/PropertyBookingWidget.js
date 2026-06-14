import { Box, Button, Card, Divider, IconButton, Popover, Stack, Switch, TextField, Typography } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import ReactDatePicker from 'react-datepicker'
import { Icon } from '@iconify/react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { amountWithComma, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'
import { getGlobalParametersAPI, getGlobalParametersGuestAPI } from 'src/configs'

const formatTime = val => {
  if (!val && val !== 0) return val
  const num = parseInt(val, 10)
  if (isNaN(num)) return val

  const h = num % 12 || 12
  const ampm = num < 12 ? 'AM' : 'PM'

  return `${h}:00 ${ampm}`
}

const DateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <Box
    ref={ref}
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      p: 2,
      backgroundColor: '#f5f5f5',
      borderRadius: 1,
      '&:hover': { backgroundColor: '#ede7e7' }
    }}
  >
    <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
      Check-in / Check-out
    </Typography>
    <Typography variant='body2' sx={{ color: value ? '#222' : '#666', fontWeight: value ? 600 : 400 }}>
      {value || placeholder || 'Select your dates'}
    </Typography>
  </Box>
))
DateInput.displayName = 'DateInput'

const PropertyBookingWidget = ({
  property,
  startDate,
  endDate,
  adults,
  childCount,
  roomCount,
  onSearchChange,
  selectedRooms = [],
  onBeginBooking,
  bookingCalendar,
  priceMap = {},
  getBookingCalendar,
  isAvailableBetweenSelectedDates
}) => {
  const [petsAllowed, setPetsAllowed] = useState(false)
  const [guestAnchorEl, setGuestAnchorEl] = useState(null)
  const [appsetParams, setAppsetParams] = useState([])

  useEffect(() => {
    getGlobalParametersGuestAPI({ TYPE_CODE: GLOBAL_PARAMETER_TYPES.APPLICATION_SETTING })
      .then(res => setAppsetParams(res?.data || []))
      .catch(() => {})
  }, [])

  const basePrice = Number(property?.PRICE) || 0
  const maxGuests = Number(property?.MAX_GUESTS) || 10
  const petsWelcome = property?.PETS_ALLOWED !== false
  const listingType = Number(property?.LISTING_TYPE_ID ?? property?.listingType ?? 0)
  const requiresRoomSelection = listingType === 1
  const isRoomSelectionMissing = requiresRoomSelection && selectedRooms.length === 0

  const nights = startDate && endDate ? Math.max(1, differenceInCalendarDays(endDate, startDate)) : 1

  const roomLines =
    selectedRooms.length > 0
      ? selectedRooms.map(s => ({
          name: s.room?.ROOM_TYPE_DESC,
          price: Number(s.room?.PRICE) || 0,
          qty: s.quantity,
          lineTotal: (Number(s.room?.PRICE) || 0) * s.quantity * nights
        }))
      : null

  const subtotal = roomLines ? roomLines.reduce((sum, l) => sum + l.lineTotal, 0) : basePrice * nights

  const feeLines = appsetParams.map(p => ({
    label: p.PARAMETER_DESCRIPTION_3,
    rate: (parseFloat(p.PARAMETER_DESCRIPTION_4) || 0) / 100,
    amount: Math.round(subtotal * ((parseFloat(p.PARAMETER_DESCRIPTION_4) || 0) / 100))
  }))
  const totalFees = feeLines.reduce((sum, f) => sum + f.amount, 0)
  const total = subtotal + totalFees

  const dateRangeLabel =
    startDate && endDate ? `${format(startDate, 'MMM dd')} – ${format(endDate, 'MMM dd, yyyy')}` : null

  const guestSummary = `${adults} adult${adults !== 1 ? 's' : ''} · ${childCount} child${
    childCount !== 1 ? 'ren' : ''
  } · ${roomCount} room${roomCount !== 1 ? 's' : ''}`

  const handleDateChange = dates => {
    const [start, end] = dates
    onSearchChange({ startDate: start, endDate: end })
  }

  const updateCount = (field, current, delta, min = 0, max = Infinity) => {
    onSearchChange({ [field]: Math.min(max, Math.max(min, current + delta)) })
  }

  const handleBeginBooking = () => {
    onBeginBooking && onBeginBooking(null)
  }

  const handleMonthChange = date => {
    const from = date || null
    const to = date ? new Date(date.getFullYear(), date.getMonth() + 2, 0) : null
    getBookingCalendar(from, to)
  }

  return (
    <Box sx={{ position: 'sticky', top: 150 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        {/* Price Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' color='primary.dark' sx={{ fontWeight: 700 }}>
            Booking Summary
          </Typography>
          {selectedRooms.length > 0 && (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {selectedRooms.map(s => (
                <Box
                  key={s.roomId}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    backgroundColor: '#f0fdf4',
                    borderRadius: 1,
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75
                  }}
                >
                  <Icon icon='tabler:door' style={{ color: '#15803d', fontSize: 14 }} />
                  <Typography variant='caption' sx={{ color: '#15803d', fontWeight: 600 }}>
                    {s.room?.ROOM_TYPE_DESC} x {s.quantity}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Date Range Picker */}
        <DatePickerWrapper>
          <ReactDatePicker
            selectsRange
            dateFormat='dd-MMM-yyyy'
            popperProps={{ strategy: 'fixed' }}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            minDate={new Date()}
            onMonthChange={handleMonthChange}
            customInput={<DateInput placeholder='Select your dates' value={dateRangeLabel} />}
            monthsShown={2}
            renderDayContents={(day, date) => {
              const key = format(date, 'yyyy-MM-dd')
              const price = priceMap[key]

              return (
                <div
                  style={{
                    padding: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    lineHeight: 1.1
                  }}
                >
                  <span>{day}</span>

                  {/* PRICE BELOW DATE */}
                  {price ? (
                    <span style={{ fontSize: 10, color: '#10b981' }}>${price}</span>
                  ) : (
                    <span style={{ fontSize: 10, opacity: 0.3 }}>-</span>
                  )}
                </div>
              )
            }}
          />
        </DatePickerWrapper>

        {/* Check-in / Check-out times + Meal Plan */}

        {/* Guests */}
        {listingType === 1 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Box
              sx={{
                cursor: 'pointer',
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': { backgroundColor: '#ede7e7' }
              }}
              onClick={e => setGuestAnchorEl(e.currentTarget)}
            >
              <Box>
                <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Guests & Rooms
                </Typography>
                <Typography variant='body2' sx={{ color: '#222', fontWeight: 600 }}>
                  {guestSummary}
                </Typography>
              </Box>
              <Icon icon='tabler:chevron-down' style={{ color: '#666' }} />
            </Box>
          </Box>
        )}

        {/* Guest Popover */}
        {listingType === 1 && (
          <Popover
            open={Boolean(guestAnchorEl)}
            anchorEl={guestAnchorEl}
            onClose={() => setGuestAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { p: 2.5, borderRadius: 3, minWidth: 280 } }}
          >
            {[
              { label: 'Adults', sub: 'Age 13+', value: adults, field: 'adults', min: 1, max: maxGuests },
              { label: 'Children', sub: 'Ages 2–12', value: childCount, field: 'childCount', min: 0, max: maxGuests },
              { label: 'Rooms', sub: null, value: roomCount, field: 'roomCount', min: 1, max: 10 }
            ].map(item => (
              <Stack key={item.label} direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 2 }}>
                <Box>
                  <Typography variant='body2' fontWeight={600}>
                    {item.label}
                  </Typography>
                  {item.sub && (
                    <Typography variant='caption' color='text.secondary'>
                      {item.sub}
                    </Typography>
                  )}
                </Box>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <IconButton
                    size='small'
                    onClick={() => updateCount(item.field, item.value, -1, item.min, item.max)}
                    sx={{ border: '1px solid #ddd', width: 28, height: 28 }}
                  >
                    <Icon icon='tabler:minus' fontSize='0.85rem' />
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.value}</Typography>
                  <IconButton
                    size='small'
                    onClick={() => updateCount(item.field, item.value, 1, item.min, item.max)}
                    sx={{ border: '1px solid #ddd', width: 28, height: 28 }}
                  >
                    <Icon icon='tabler:plus' fontSize='0.85rem' />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
            <Divider sx={{ my: 1.5 }} />
            {petsWelcome ? (
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Box>
                  <Typography variant='body2' fontWeight={600}>
                    Travelling with pets?
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Charges may apply
                  </Typography>
                </Box>
                <Switch
                  size='small'
                  checked={petsAllowed}
                  onChange={e => setPetsAllowed(e.target.checked)}
                  sx={{ '& .MuiSwitch-thumb': { backgroundColor: petsAllowed ? '#27ae60' : undefined } }}
                />
              </Stack>
            ) : (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
              >
                <Icon icon='tabler:paw-off' style={{ fontSize: 14 }} /> Pets not permitted at this property
              </Typography>
            )}
            <Button
              fullWidth
              variant='contained'
              size='small'
              sx={{ mt: 2, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#229954' } }}
              onClick={() => setGuestAnchorEl(null)}
            >
              Done
            </Button>
          </Popover>
        )}

        {/* Price Breakdown */}
        {nights > 0 && (
          <Box sx={{ my: 3 }}>
            {roomLines ? (
              roomLines.map(line => (
                <Box key={line.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='caption'>
                    {line.name} &times; {line.qty} (${amountWithComma(line.price)} &times; {nights} night
                    {nights !== 1 ? 's' : ''})
                  </Typography>
                  <Typography variant='caption'>${amountWithComma(line.lineTotal)}</Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant='caption'>
                  ${amountWithComma(basePrice)} &times; {nights} night{nights !== 1 ? 's' : ''}
                </Typography>
                <Typography variant='caption'>${amountWithComma(subtotal)}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            {feeLines.map(fee => (
              <Box key={fee.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant='caption'>
                  {fee.label} ({Math.round(fee.rate * 100)}%)
                </Typography>
                <Typography variant='caption'>${amountWithComma(fee.amount)}</Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography fontWeight='bold' variant='caption'>
                Total Taxes & Fees:
              </Typography>
              <Typography fontWeight='bold' variant='caption'>
                ${amountWithComma(subtotal)}
              </Typography>
            </Box>
            <Typography variant='caption' sx={{ display: 'block', textAlign: 'right', fontWeight: 600 }}></Typography>
          </Box>
        )}

        {/* Total */}
        <Box sx={{ p: 2, backgroundColor: '#f0f0f0', borderRadius: 1, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
              {nights > 0 ? 'Total price' : 'Price per night'}
            </Typography>
            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
              ${amountWithComma(nights > 0 ? total : basePrice)}
            </Typography>
          </Box>
          {nights > 0 && (
            <Typography variant='caption' sx={{ color: '#999', display: 'block', mt: 1 }}>
              Includes taxes and service fee.
            </Typography>
          )}
        </Box>

        {/* Cancellation Policy */}
        {property?.CANCELLATION_POLICY && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              mb: 2,
              p: 1.5,
              backgroundColor: '#f0fdf4',
              borderRadius: 1,
              border: '1px solid #bbf7d0'
            }}
          >
            <Icon icon='tabler:shield-check' style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
            <Typography variant='caption' sx={{ color: '#15803d', lineHeight: 1.6 }}>
              {property.CANCELLATION_POLICY}
            </Typography>
          </Box>
        )}
        {isRoomSelectionMissing && (
          <Typography variant='caption' color='error' sx={{ mb: 2, display: 'block' }}>
            Please select at least one room to proceed with booking.
          </Typography>
        )}
        {/* Booking Button */}
        <Button
          variant='contained'
          fullWidth
          sx={{
            backgroundColor: '#27ae60',
            py: 1.5,
            fontWeight: 600,
            mb: 2,
            fontSize: '1rem',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#229954' }
          }}
          onClick={handleBeginBooking}
          disabled={
            !startDate ||
            !endDate ||
            (property.LISTING_TYPE_ID == 1 && isRoomSelectionMissing) ||
            (property.LISTING_TYPE_ID == 2 && !isAvailableBetweenSelectedDates)
          }
        >
          Complete Booking
        </Button>

        {/* <Button variant='outlined' fullWidth sx={{ borderRadius: 2 }}>
          Contact host
        </Button> */}
      </Card>
    </Box>
  )
}

export default PropertyBookingWidget
