import React, { forwardRef, useEffect, useState } from 'react'
import { Box, Stack, Typography, Slider, MenuItem, Select, OutlinedInput, Chip, Card, TextField } from '@mui/material'
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getGlobalParametersLOV, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

const propertyTypes = [
  { label: 'Hotel', value: 'hotel' },
  { label: 'Rental', value: 'rental' }
]

const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start ? format(props.start, 'dd-MMM-yyyy') : ''
  const endDate = props.end ? ` - ${format(props.end, 'dd-MMM-yyyy')}` : ''
  const value = `${startDate}${endDate}`

  return (
    <TextField
      size='small'
      fullWidth
      inputRef={ref}
      label={null}
      value={value}
      placeholder='Select date range'
      InputProps={{ readOnly: true }}
    />
  )
})

const CommunityMapFilters = ({ filters, setFilters, minValue, maxValue, amenitiesData }) => {
  const [amenitiesOptions, setAmenitiesOptions] = useState([])
  const [amenitiesLoading, setAmenitiesLoading] = useState(true)

  useEffect(() => {
    let _amenities = []

    amenitiesData?.map(data => {
      data?.amenities?.forEach(feature => {
        if (feature?.FEATURES && !_amenities.some(a => a.value === feature.FEATURES_ID)) {
          _amenities.push({ label: feature.FEATURES, value: feature.FEATURES_ID })
        }
      })

      return null
    }, [])

    setAmenitiesOptions(_amenities || [])
    setAmenitiesLoading(false)
  }, [amenitiesData])

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
    setFilters(prev => ({ ...prev, dates: [start || null, end || null] }))
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
            displayEmpty
            size='small'
            value={filters.propertyType || []}
            onChange={handleTypeChange}
            input={<OutlinedInput />}
            renderValue={selected =>
              selected.length === 0 ? (
                <Typography variant='body2' color='text.disabled'>
                  Select property type
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => (
                    <Chip key={value} label={propertyTypes.find(t => t.value === value)?.label || value} />
                  ))}
                </Box>
              )
            }
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
              popperProps={{ strategy: 'fixed' }}
              customInput={
                <TextField fullWidth placeholder='Select a date range' start={startDate} end={endDate} size='small' />
              }
              dateFormat='dd-MMM-yyyy'
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
            displayEmpty
            size='small'
            value={filters.amenities || []}
            onChange={handleAmenitiesChange}
            input={<OutlinedInput />}
            renderValue={selected =>
              selected.length === 0 ? (
                <Typography variant='body2' color='text.disabled'>
                  {amenitiesLoading ? 'Loading...' : 'Select amenities'}
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(val => (
                    <Chip key={val} label={amenitiesOptions.find(a => a.value === val)?.label || val} />
                  ))}
                </Box>
              )
            }
            fullWidth
            disabled={amenitiesLoading}
          >
            {amenitiesOptions.map(a => (
              <MenuItem key={a.value} value={a.value}>
                {a.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
    </Card>
  )
}

export default CommunityMapFilters
