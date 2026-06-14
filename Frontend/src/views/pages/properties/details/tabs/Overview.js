import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Typography
} from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import ReactDatePicker from 'react-datepicker'
import IconifyIcon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import RoomsDetailTable from '../../RoomsDetailTable'
import themeConfig from 'src/configs/themeConfig'
import { useRouter } from 'next/router'
import { getHotelBookingCalendarAPI } from 'src/configs'

const pmgBenefits = [
  `We guarantee the lowest price on every booking made through ${themeConfig.templateName}.`,
  'If you find a lower rate for the same property, dates, and guests within 24 hours of booking, we will match it.',
  'Simply contact our support team with a screenshot of the lower price from a verified booking site.',
  'The guarantee applies to identical room types, cancellation policies, and meal inclusions.',
  'No hidden fees - the price you see is the price you pay.'
]

const PriceMatchDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction='row' spacing={1} alignItems='center'>
        <IconifyIcon icon='tabler:shield-check-filled' color='#27ae60' width={24} />
        <Typography variant='h6' fontWeight={700}>
          Price Match Guarantee
        </Typography>
      </Stack>
      <IconButton size='small' onClick={onClose}>
        <IconifyIcon icon='tabler:x' />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          borderRadius: 2,
          p: 2.5,
          mb: 2.5,
          border: '1px solid #c8e6c9'
        }}
      >
        <Typography variant='subtitle1' fontWeight={700} color='#1b5e20' gutterBottom>
          We match the lowest price - guaranteed.
        </Typography>
        <Typography variant='body2' color='#388e3c'>
          Book with confidence knowing you&apos;re getting the best deal available.
        </Typography>
      </Box>
      <List disablePadding>
        {pmgBenefits.map((benefit, i) => (
          <ListItem key={i} alignItems='flex-start' sx={{ px: 0, py: 0.75 }}>
            <ListItemIcon sx={{ minWidth: 32, mt: 0.3 }}>
              <IconifyIcon icon='tabler:circle-check-filled' color='#27ae60' width={18} />
            </ListItemIcon>
            <ListItemText primary={<Typography variant='body2'>{benefit}</Typography>} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant='caption' color='text.secondary'>
        Terms & conditions apply. The guarantee is subject to verification and applies only to publicly available rates
        on comparable booking platforms.
      </Typography>
      <Button
        fullWidth
        variant='contained'
        sx={{ mt: 2.5, backgroundColor: '#27ae60', '&:hover': { backgroundColor: '#229954' }, borderRadius: 2 }}
        onClick={onClose}
      >
        Got it!
      </Button>
    </DialogContent>
  </Dialog>
)

const DateRangeInput = forwardRef(({ value, onClick }, ref) => (
  <Box
    ref={ref}
    onClick={onClick}
    sx={{
      width: '100%',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      px: 1.5,
      py: 2.5,
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      '&:hover': { borderColor: '#27ae60' }
    }}
  >
    <IconifyIcon icon='tabler:calendar' width={16} />
    <Typography variant='body2' fontWeight={700} fontSize={11} sx={{ textTransform: 'uppercase' }}>
      {value || 'Select dates'}
    </Typography>
  </Box>
))
DateRangeInput.displayName = 'DateRangeInput'

const Overview = ({
  data,
  startDate,
  endDate,
  adults,
  childCount,
  roomCount,
  onSearchChange,
  onRoomSelect,
  onReserve,
  priceMap,
  updatedRooms,
  getBookingCalendar
}) => {
  const [guestAnchorEl, setGuestAnchorEl] = useState(null)
  const [pmgOpen, setPmgOpen] = useState(false)

  // const nights = startDate && endDate ? Math.max(1, differenceInCalendarDays(endDate, startDate)) : 1

  const dateLabel =
    startDate && endDate
      ? `${format(startDate, 'MMM dd').toUpperCase()} - ${format(endDate, 'MMM dd').toUpperCase()}`
      : null

  const guestLabel = `${adults} adult${adults !== 1 ? 's' : ''}, ${childCount} children, ${roomCount} room${
    roomCount !== 1 ? 's' : ''
  }`

  const handleDateChange = dates => {
    const [start, end] = dates
    onSearchChange({ startDate: start, endDate: end })
  }

  const updateCount = (field, current, delta, min = 0) => {
    onSearchChange({ [field]: Math.max(min, current + delta) })
  }

  const handleMonthChange = date => {
    const from = date || null
    const to = date ? new Date(date.getFullYear(), date.getMonth() + 2, 0) : null
    getBookingCalendar(from, to)
  }

  return (
    <Box>
      {/* Availability Header */}
      <Box
        sx={{
          p: 3,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Typography variant='h6' fontWeight='bold'>
          Availability
        </Typography>
        <Typography
          variant='body2'
          fontWeight='bold'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => setPmgOpen(true)}
        >
          <IconifyIcon icon='tabler:shield-check-filled' width={20} />
          Price Match Guarantee
        </Typography>
      </Box>

      {/* Search Details */}
      <Box sx={{ border: '1px solid #e8e8e8', borderRadius: 2, p: 2.5, mb: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <DatePickerWrapper>
              <ReactDatePicker
                selectsRange
                dateFormat='dd-MMM-yyyy'
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                minDate={new Date()}
                onMonthChange={handleMonthChange}
                customInput={<DateRangeInput value={dateLabel} />}
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
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 2.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                '&:hover': { borderColor: '#27ae60' }
              }}
              onClick={e => setGuestAnchorEl(e.currentTarget)}
            >
              <IconifyIcon icon='tabler:users' width={16} />
              <Typography variant='body2' fontWeight={700} fontSize={11} sx={{ textTransform: 'uppercase' }}>
                {guestLabel}
              </Typography>
              <IconifyIcon icon='tabler:chevron-down' width={14} style={{ color: '#888' }} />
            </Box>
          </Grid>

          {/* <Grid item xs={12} md={2} display='flex' justifyContent={{ md: 'flex-end', xs: 'flex-start' }}>
            <Button
              variant='contained'
              size='small'
              sx={{
                height: 36,
                fontSize: 11,
                backgroundColor: '#27ae60',
                borderRadius: 1,
                lineHeight: 1.2,
                textTransform: 'capitalize',
                '&:hover': { backgroundColor: '#229954' }
              }}
              onClick={() => onSearchChange({ startDate, endDate, adults, childCount, roomCount })}
            >
              Change Search
            </Button>
          </Grid> */}
        </Grid>
      </Box>

      {/* Rooms Details Table */}

      <RoomsDetailTable
        data={data}
        rooms={updatedRooms}
        searchParams={{
          checkIn: startDate ? format(startDate, 'yyyy-MM-dd') : '',
          checkOut: endDate ? format(endDate, 'yyyy-MM-dd') : '',
          adults,
          children: childCount,
          rooms: roomCount
        }}
        onRoomSelect={onRoomSelect}
        onReserve={onReserve}
      />

      {/* Guest Popover */}
      <Popover
        open={Boolean(guestAnchorEl)}
        anchorEl={guestAnchorEl}
        onClose={() => setGuestAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2.5, borderRadius: 3, minWidth: 280 } }}
      >
        {[
          { label: 'Adults', sub: 'Age 13+', value: adults, field: 'adults', min: 1 },
          { label: 'Children', sub: 'Ages 2–12', value: childCount, field: 'childCount', min: 0 },
          { label: 'Rooms', sub: null, value: roomCount, field: 'roomCount', min: 1 }
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
                onClick={() => updateCount(item.field, item.value, -1, item.min)}
                sx={{ border: '1px solid #ddd', width: 28, height: 28 }}
              >
                <IconifyIcon icon='tabler:minus' fontSize='0.85rem' />
              </IconButton>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.value}</Typography>
              <IconButton
                size='small'
                onClick={() => updateCount(item.field, item.value, 1, item.min)}
                sx={{ border: '1px solid #ddd', width: 28, height: 28 }}
              >
                <IconifyIcon icon='tabler:plus' fontSize='0.85rem' />
              </IconButton>
            </Stack>
          </Stack>
        ))}
        <Divider sx={{ my: 1.5 }} />
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

      {/* Price Match Guarantee Dialog */}
      <PriceMatchDialog open={pmgOpen} onClose={() => setPmgOpen(false)} />
    </Box>
  )
}

export default Overview
