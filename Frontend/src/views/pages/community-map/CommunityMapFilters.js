import React from 'react'
import { Box, Stack, Typography, Slider, MenuItem, Select, OutlinedInput, Chip, Card, TextField } from '@mui/material'
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import { forwardRef, useMemo } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const propertyTypes = [
  { label: 'Hotel', value: 'hotel' },
  { label: 'Rental', value: 'rental' }
]

const amenitiesList = [
  'wifi',
  'parking',
  'pool',
  'gym',
  'pets-allowed',
  'kitchen',
  'air-conditioning',
  'washer',
  'dryer'
]

const CustomInput = forwardRef((props, ref) => {
  const startDate = props?.start !== null ? format(props.start, 'dd-MMM-yyyy') : null
  const endDate = props?.end !== null ? ` - ${format(props.end, 'dd-MMM-yyyy')}` : null
  const value = `${startDate !== null ? startDate : ''}${endDate !== null ? endDate : ''}`

  return <TextField size='small' fullWidth inputRef={ref} label={null} value={value} />
})

const CommunityMapFilters = ({ filters, setFilters, minValue, maxValue }) => {
  const handlePriceChange = (_, newValue) => {
    setFilters(prev => ({ ...prev, priceRange: newValue }))
  }

  const handleTypeChange = event => {
    setFilters(prev => ({ ...prev, propertyType: event.target.value }))
  }

  const handleAmenitiesChange = event => {
    setFilters(prev => ({ ...prev, amenities: event.target.value }))
  }

  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <Card sx={{ p: 5 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant='caption' fontWeight={700} sx={{ mb: 0.5, display: 'block' }}>
            Price Range
          </Typography>
          <Slider
            value={filters.priceRange || [minValue, maxValue]}
            onChange={handlePriceChange}
            valueLabelDisplay='auto'
            min={minValue}
            max={maxValue}
            step={10}
          />
          <Typography variant='caption' fontWeight={700} sx={{ mb: 0.5, display: 'block' }}>
            {filters?.priceRange?.length > 0
              ? `$${filters.priceRange[0]} - $${filters.priceRange[1]}`
              : `$${minValue} - $${maxValue}`}
          </Typography>
        </Box>
        <Box>
          <Typography variant='caption' fontWeight={700} sx={{ mb: 0.5, display: 'block' }}>
            Property Type
          </Typography>
          <Select
            multiple
            size='small'
            value={filters.propertyType || []}
            onChange={handleTypeChange}
            input={<OutlinedInput placeholder='select property Type' />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => (
                  <Chip key={value} label={propertyTypes.find(t => t.value === value)?.label || value} />
                ))}
              </Box>
            )}
            fullWidth
          >
            {propertyTypes.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Typography variant='caption' fontWeight={700} sx={{ mb: 0.5, display: 'block' }}>
            Availability Dates
          </Typography>
          <DatePickerWrapper>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              selected={startDate}
              onChange={handleOnChangeRange}
              shouldCloseOnSelect={false}
              popperPlacement='bottom-start'
              customInput={<CustomInput start={startDate} end={endDate} />}
              dateFormat='MM/dd/yyyy'
              isClearable
            />
          </DatePickerWrapper>
        </Box>
        <Box>
          <Typography variant='caption' fontWeight={700} sx={{ mb: 0.5, display: 'block' }}>
            Amenities
          </Typography>
          <Select
            multiple
            size='small'
            value={filters.amenities || []}
            onChange={handleAmenitiesChange}
            input={<OutlinedInput placeholder='select amenities' />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            fullWidth
          >
            {amenitiesList.map(a => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
    </Card>
  )
}

export default CommunityMapFilters
