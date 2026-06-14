import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { cloneElement, forwardRef, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import ReactDatePicker from 'react-datepicker'
import { FixedSizeList } from 'react-window'
import { Country } from 'country-state-city'
import { useLoadScript, Autocomplete as GAutocomplete } from '@react-google-maps/api'
import IconifyIcon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { defaultPageFont } from 'src/@core/utils'

const LOCATION_POPPER_WIDTH = 460
const VIRTUAL_LIST_PADDING = 8
const VIRTUAL_VISIBLE_ROWS = 6
const placesLibrary = ['places']

const renderVirtualRow = ({ data, index, style }) => {
  const row = data[index]

  return cloneElement(row, {
    style: {
      ...style,
      top: style.top + VIRTUAL_LIST_PADDING
    }
  })
}

const VirtualizedListbox = forwardRef(function VirtualizedListbox(props, ref) {
  const { children, ...other } = props
  const itemData = useMemo(() => (Array.isArray(children) ? children : [children]).filter(Boolean), [children])
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
  const itemSize = isDesktop ? 76 : 72
  const itemCount = itemData.length
  const listHeight = Math.min(itemCount, VIRTUAL_VISIBLE_ROWS) * itemSize + VIRTUAL_LIST_PADDING * 2

  return (
    <div ref={ref} {...other}>
      <FixedSizeList
        itemData={itemData}
        height={Math.max(listHeight, itemSize + VIRTUAL_LIST_PADDING * 2)}
        width='100%'
        itemSize={itemSize}
        overscanCount={8}
        itemCount={itemCount}
        innerElementType='ul'
      >
        {renderVirtualRow}
      </FixedSizeList>
    </div>
  )
})

const buildCountryOptions = () => {
  return Country.getAllCountries().map(country => ({
    id: `country-${country.isoCode}`,
    city: '',
    region: '',
    country: country.name,
    stateCode: '',
    countryCode: country.isoCode
  }))
}

const countryOptions = buildCountryOptions()

const LandingHeroSearch = ({
  tabs,
  fields = [],
  activeTab,
  setActiveTab,
  onSearch: onSearchCallback,
  setHotelsSearchParams
}) => {
  const router = useRouter()
  const [fromLocation, setFromLocation] = useState(countryOptions.find(option => option.default) || null)
  const [toPlace, setToPlace] = useState({ city: '', country: '', formattedAddress: '' })
  const [placesSearchRef, setPlacesSearchRef] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(0)
  const [travelingWithPets, setTravelingWithPets] = useState(false)
  const [guestAnchorEl, setGuestAnchorEl] = useState(null)
  const isRentalTab = activeTab === 'rentals'
  const [toPlaceKey, setToPlaceKey] = useState(0)

  const searchIsNotNull =
    fromLocation || toPlace?.country || startDate || endDate || adults + children > 0 || rooms > 0 || travelingWithPets

  const DateRangeInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <TextField
        fullWidth
        inputRef={ref}
        value={value}
        onClick={onClick}
        size='small'
        InputProps={{ readOnly: true }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiOutlinedInput-input': {
            px: 0,
            fontWeight: 800,
            color: '#0d1831',
            fontFamily: defaultPageFont,
            fontSize: '1rem',
            cursor: 'pointer'
          }
        }}
      />
    )
  })

  DateRangeInput.displayName = 'DateRangeInput'

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries: placesLibrary
  })

  const onPlaceChanged = () => {
    if (placesSearchRef) {
      const place = placesSearchRef.getPlace()
      let city = ''
      let country = ''
      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes('locality') && !city) city = component.long_name
          if (component.types.includes('postal_town') && !city) city = component.long_name
          if (component.types.includes('country')) country = component.long_name
        }
      }
      setToPlace({
        city: city || place.name || '',
        country,
        formattedAddress: place.formatted_address || ''
      })
    }
  }

  const handleDateRangeChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const startDateValue = startDate ? format(startDate, 'yyyy-MM-dd') : ''
  const endDateValue = endDate ? format(endDate, 'yyyy-MM-dd') : ''
  const totalGuests = adults + children

  const fieldMeta = fields.reduce((map, field) => {
    map[field.id] = field

    return map
  }, {})

  const handleSearch = () => {
    const tab = tabs.find(item => item.id === activeTab)

    // For community and furniture tabs, navigate directly without search params
    if (tab?.id === 'community' || tab?.id === 'furniture') {
      router.push(tab.route)

      return
    }

    // If a callback is provided (e.g. home page filters in-place), call it and stay on the page
    if (onSearchCallback) {
      const payload = {
        fromCountry: fromLocation?.country || '',
        fromCountryCode: fromLocation?.countryCode || '',
        fromCity: fromLocation?.city || '',
        toCountry: toPlace.country,
        toCity: toPlace.city,
        checkIn: startDateValue,
        checkOut: endDateValue
      }

      payload.guests = totalGuests
      payload.adults = adults
      payload.children = children
      payload.rooms = rooms
      payload.pets = travelingWithPets

      onSearchCallback({
        ...payload
      })

      return
    }

    const paramsObject = {
      from: fromCountry,
      to: toCountry,
      startDate: startDateValue,
      endDate: endDateValue
    }

    paramsObject.guests = String(totalGuests)
    paramsObject.adults = String(adults)
    paramsObject.children = String(children)
    paramsObject.rooms = String(rooms)
    paramsObject.pets = String(travelingWithPets)

    const params = new URLSearchParams(paramsObject)

    params.set('fromCity', fromLocation?.city || '')
    params.set('fromCountry', fromLocation?.country || '')
    params.set('fromCountryCode', fromLocation?.countryCode || '')
    params.set('toCity', toPlace.city)
    params.set('toCountry', toPlace.country)

    router.push(`${tab?.route || '/rentals/properties'}?${params.toString()}`)
  }

  const formatLocationLabel = location => {
    if (!location) {
      return ''
    }

    if (!location.city) {
      return location.country
    }

    return `${location.city}, ${location.country}`
  }

  const fromCountry = formatLocationLabel(fromLocation)
  const toCountry = toPlace.formattedAddress || [toPlace.city, toPlace.country].filter(Boolean).join(', ')

  const renderCountryOption = (props, option) => {
    const { key, ...rest } = props

    return (
      <Box
        key={key}
        component='li'
        {...rest}
        sx={{
          width: { xs: 'calc(100vw - 56px)', sm: LOCATION_POPPER_WIDTH },
          maxWidth: '100%',
          boxSizing: 'border-box',
          py: 1.2,
          px: 1.25,
          borderBottom: '1px solid #e7edf3',
          '&:last-of-type': { borderBottom: 'none' }
        }}
      >
        <Stack direction='row' spacing={1.1} alignItems='center' sx={{ width: '100%' }}>
          <IconifyIcon icon='mdi:world' color='#2f3948' fontSize='1.35rem' />
          <Typography
            sx={{
              fontWeight: 800,
              color: '#07102b',
              fontFamily: defaultPageFont,
              lineHeight: 1.2,
              fontSize: '1.05rem'
            }}
          >
            {option.country}
          </Typography>
        </Stack>
      </Box>
    )
  }

  const updateGuestCount = (type, delta) => {
    if (type === 'adults') {
      setAdults(prev => Math.max(1, prev + delta))
    }
    if (type === 'children') {
      setChildren(prev => Math.max(0, prev + delta))
    }
    if (type === 'rooms') {
      setRooms(prev => Math.max(1, prev + delta))
    }
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        pt: { xs: 6 },
        pb: { xs: 5, md: 6 },
        textAlign: 'center'
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '2.1rem', md: '4rem' },
          lineHeight: 1.08,
          fontWeight: 800,
          color: '#07102b',
          fontFamily: defaultPageFont
        }}
      >
        We Find Your
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '4rem' },
          lineHeight: 1.08,
          fontWeight: 800,
          fontFamily: defaultPageFont
        }}
        color='primary.main'
      >
        Community Area
      </Typography>
      <Typography
        sx={{
          fontSize: 16,
          mt: 2,
          color: '#64748B',
          fontWeight: 500,
          fontFamily: defaultPageFont,
          maxWidth: 780,
          mx: 'auto'
        }}
      >
        Experience the world&apos;s most sophisticated community mapping tool for
        <br />
        modern living across the globe.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          mt: 10,
          p: 1,
          borderRadius: 999,
          backgroundColor: '#f7fbfa',
          border: '1px solid #d5e3de',
          display: 'inline-block'
        }}
      >
        <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='center'>
          {tabs.map(tab => (
            <Chip
              key={tab.id}
              label={tab.label}
              icon={<IconifyIcon icon={tab.icon} fontSize='1rem' />}
              onClick={() => {
                if ((tab.id === 'community' || tab.id === 'furniture') && tab.route) {
                  router.push(tab.route)
                } else {
                  setActiveTab(tab.id)
                }
              }}
              sx={{
                px: 1,
                height: 42,
                borderRadius: 999,
                fontFamily: defaultPageFont,
                fontWeight: 700,
                backgroundColor: activeTab === tab.id ? '#11B981' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#7a8799',
                '& .MuiChip-icon': {
                  color: activeTab === tab.id ? '#fff' : '#7a8799'
                }
              }}
            />
          ))}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: { xs: 2.5, md: 3 },
          mx: 'auto',
          maxWidth: 896,
          borderRadius: '20px 20px 28px 28px',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(14, 30, 37, 0.12)'
        }}
      >
        {/* Fields Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            backgroundColor: '#ffffff',
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 }
          }}
        >
          {/* Where From */}
          <Box
            sx={{
              flex: 1,
              px: { xs: 0, md: 2 },
              py: { xs: 1.5, md: 0 },
              borderBottom: { xs: '1px solid #e8f0f2', md: 'none' }
            }}
          >
            <Stack direction='row' spacing={8} alignItems='center'>
              <IconifyIcon icon='mdi:world' color='#8b97a8' fontSize='1.5rem' sx={{ mt: 0.3 }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    color: '#7a8799',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    mb: 0.8,
                    fontFamily: defaultPageFont
                  }}
                >
                  Where from?
                </Typography>
                <Autocomplete
                  fullWidth
                  options={countryOptions}
                  value={fromLocation}
                  onChange={(_, value) => setFromLocation(value || countryOptions[0] || null)}
                  getOptionLabel={option => option.country || ''}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={renderCountryOption}
                  ListboxComponent={VirtualizedListbox}
                  slotProps={{
                    popper: {
                      sx: {
                        '& .MuiAutocomplete-paper': {
                          width: { xs: 'calc(100vw - 32px)', sm: LOCATION_POPPER_WIDTH },
                          maxWidth: '100vw'
                        }
                      }
                    }
                  }}
                  ListboxProps={{
                    sx: {
                      width: { xs: 'calc(100vw - 56px)', sm: LOCATION_POPPER_WIDTH },
                      maxWidth: '100%',
                      maxHeight: 'none',
                      p: 0,
                      overflowX: 'hidden',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      '&::-webkit-scrollbar': { display: 'none' }
                    }
                  }}
                  disableClearable
                  popupIcon={null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant='standard'
                      placeholder='--Select--'
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiInputBase-root': { p: 0 },
                    '& .MuiAutocomplete-input': {
                      fontWeight: 700,
                      color: '#0f1419',
                      fontFamily: defaultPageFont,
                      fontSize: { xs: '1rem', md: '1.05rem' },
                      p: 0,
                      cursor: 'pointer'
                    }
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Where To */}
          <Box
            sx={{
              flex: 1,
              px: { xs: 0, md: 2 },
              py: { xs: 1.5, md: 0 },
              borderBottom: { xs: '1px solid #e8f0f2', md: 'none' }
            }}
          >
            <Stack direction='row' spacing={8} alignItems='center'>
              <IconifyIcon icon='mdi:map-marker-outline' color='#8b97a8' fontSize='1.5rem' sx={{ mt: 0.3 }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    color: '#7a8799',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    mb: 0.8,
                    fontFamily: defaultPageFont
                  }}
                >
                  Where to?
                </Typography>
                {isLoaded ? (
                  <GAutocomplete
                    key={toPlaceKey}
                    onLoad={setPlacesSearchRef}
                    onPlaceChanged={onPlaceChanged}
                    options={{ fields: ['address_components', 'formatted_address', 'geometry', 'name'] }}
                  >
                    <TextField
                      variant='standard'
                      placeholder='--Select--'
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': { p: 0 },
                        '& .MuiInputBase-input': {
                          fontWeight: 700,
                          color: '#0f1419',
                          fontFamily: defaultPageFont,
                          fontSize: { xs: '1rem', md: '1.05rem' },
                          p: 0
                        }
                      }}
                    />
                  </GAutocomplete>
                ) : (
                  <TextField
                    variant='standard'
                    placeholder='Loading...'
                    disabled
                    InputProps={{ disableUnderline: true }}
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-root': { p: 0 },
                      '& .MuiInputBase-input': {
                        fontWeight: 700,
                        color: '#0f1419',
                        fontFamily: defaultPageFont,
                        fontSize: { xs: '1rem', md: '1.05rem' },
                        p: 0
                      }
                    }}
                  />
                )}
              </Box>
            </Stack>
          </Box>

          {/* Dates */}
          <Box
            sx={{
              flex: 1,
              px: { xs: 0, md: 2 },
              py: { xs: 1.5, md: 0 },
              borderBottom: { xs: '1px solid #e8f0f2', md: 'none' }
            }}
          >
            <Stack direction='row' spacing={8} alignItems='center'>
              <IconifyIcon icon='mdi:calendar-range' color='#8b97a8' fontSize='1.5rem' sx={{ mt: 0.3 }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    color: '#7a8799',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    mb: 0.8,
                    fontFamily: defaultPageFont
                  }}
                >
                  Dates
                </Typography>
                <Box onClick={() => {}} sx={{ cursor: 'pointer', textAlign: 'left' }}>
                  <DatePickerWrapper>
                    <ReactDatePicker
                      selectsRange
                      monthsShown={2}
                      shouldCloseOnSelect={false}
                      dateFormat='MMM, d'
                      minDate={new Date()}
                      startDate={startDate}
                      endDate={endDate}
                      selected={startDate}
                      placeholderText='--Select Dates--'
                      onChange={handleDateRangeChange}
                      customInput={
                        <TextField
                          variant='standard'
                          value='DDD M - M'
                          placeholder='select Dates'
                          InputProps={{
                            disableUnderline: true,
                            readOnly: true,
                            sx: {
                              fontWeight: 700,
                              color: '#0f1419',
                              fontFamily: defaultPageFont,
                              fontSize: { xs: '1rem', md: '0.9rem' },
                              cursor: 'pointer',
                              p: 0
                            }
                          }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Box>
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              flex: 1,
              px: { xs: 0, md: 2 },
              py: { xs: 1.5, md: 0 }
            }}
          >
            <Stack direction='row' spacing={8} alignItems='center'>
              <IconifyIcon icon='mdi:person-outline' color='#8b97a8' fontSize='1.5rem' sx={{ mt: 0.3 }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    color: '#7a8799',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    mb: 0.8,
                    fontFamily: defaultPageFont
                  }}
                >
                  Guests/Rooms
                </Typography>
                <Box
                  onClick={event => setGuestAnchorEl(event.currentTarget)}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#0f1419',
                      fontFamily: defaultPageFont,
                      fontSize: { xs: '1rem', md: '1.05rem' }
                    }}
                  >
                    {adults + children == 0 ? (
                      <Typography
                        variant='subtitle2'
                        color='secondary.main'
                        sx={{ fontFamily: defaultPageFont, fontSize: '1.1rem', fontWeight: 500 }}
                      >
                        --Select--
                      </Typography>
                    ) : (
                      <Typography sx={{ fontFamily: defaultPageFont, fontSize: '0.9rem', fontWeight: 500 }}>
                        {totalGuests > 0 && `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}`}{' '}
                        {rooms > 0 && `${totalGuests > 0 && ', '}${rooms} Room${rooms > 1 ? 's' : ''}`}
                      </Typography>
                    )}
                    {/* {adults} Adult{adults > 1 ? 's' : ''} */}
                  </Typography>
                </Box>

                <Popover
                  open={Boolean(guestAnchorEl)}
                  anchorEl={guestAnchorEl}
                  onClose={() => setGuestAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  slotProps={{
                    paper: {
                      sx: {
                        width: { xs: 320, sm: 360 },
                        mt: 1,
                        borderRadius: 2,
                        p: 2,
                        border: '1px solid #dce3eb',
                        boxShadow: '0 18px 36px rgba(12, 22, 38, 0.16)'
                      }
                    }
                  }}
                >
                  <Stack spacing={1.2}>
                    {[
                      { key: 'adults', label: 'Adults', value: adults, min: 1 },
                      { key: 'children', label: 'Children', value: children, min: 0 },
                      { key: 'rooms', label: 'Rooms', value: rooms, min: 1 }
                    ].map(item => (
                      <Stack key={item.key} direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography sx={{ fontFamily: defaultPageFont, fontSize: '1.05rem', color: '#07102b' }}>
                          {item.label}
                        </Typography>
                        <Stack
                          direction='row'
                          alignItems='center'
                          justifyContent='space-between'
                          spacing={0.6}
                          sx={{
                            border: '1px solid #cfd7e2',
                            borderRadius: 1.2,
                            px: 0.6,
                            py: 0.3,
                            minWidth: 156
                          }}
                        >
                          <IconButton
                            size='small'
                            onClick={() => updateGuestCount(item.key, -1)}
                            disabled={item.value <= item.min}
                            sx={{ color: item.value <= item.min ? '#aab4c2' : 'primary.main' }}
                          >
                            <IconifyIcon icon='tabler:minus' fontSize='1rem' />
                          </IconButton>
                          <Typography
                            sx={{
                              width: 28,
                              textAlign: 'center',
                              fontWeight: 800,
                              color: '#0d1831',
                              fontFamily: defaultPageFont,
                              fontSize: '1.05rem'
                            }}
                          >
                            {item.value}
                          </Typography>
                          <IconButton
                            size='small'
                            onClick={() => updateGuestCount(item.key, 1)}
                            sx={{ color: 'primary.main' }}
                          >
                            <IconifyIcon icon='tabler:plus' fontSize='1rem' />
                          </IconButton>
                        </Stack>
                      </Stack>
                    ))}

                    <Divider sx={{ my: 0.6 }} />

                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                      <Typography sx={{ fontFamily: defaultPageFont, fontSize: '1.03rem', color: '#07102b' }}>
                        Traveling with pets?
                      </Typography>
                      <Switch
                        checked={travelingWithPets}
                        onChange={event => setTravelingWithPets(event.target.checked)}
                      />
                    </Stack>

                    <Typography sx={{ fontSize: '0.92rem', color: '#5c6c82', fontFamily: defaultPageFont }}>
                      Assistance animals are not considered pets.
                    </Typography>
                    <Typography
                      component='a'
                      href='#'
                      sx={{
                        fontSize: '0.95rem',
                        color: 'primary.main',
                        fontFamily: defaultPageFont,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Read more about traveling with assistance animals
                    </Typography>

                    <Button
                      fullWidth
                      variant='outlined'
                      onClick={() => setGuestAnchorEl(null)}
                      sx={{ mt: 0.8, textTransform: 'none', fontWeight: 700, fontFamily: defaultPageFont, py: 1 }}
                    >
                      Done
                    </Button>
                  </Stack>
                </Popover>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Search Button */}
        <Button
          fullWidth
          variant='contained'
          onClick={handleSearch}
          startIcon={<IconifyIcon icon='tabler:search' fontSize='1.3rem' />}
          sx={{
            height: { xs: 56, md: 64 },
            borderRadius: 0,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: defaultPageFont,
            fontSize: { xs: '1rem', md: '1.15rem' },
            letterSpacing: '1px',
            backgroundColor: '#10B981',
            '&:hover': { backgroundColor: '#0ea06e' }
          }}
        >
          Search
        </Button>
      </Paper>
      {searchIsNotNull && (
        <Button
          variant='text'
          color='error'
          sx={{
            fontWeight: 700,
            fontFamily: defaultPageFont,
            selfAlign: 'center'
          }}
          onClick={() => {
            setFromLocation(null)
            setPlacesSearchRef(null)
            onPlaceChanged()
            setToPlace({ city: null, country: null, formattedAddress: null })
            setStartDate(null)
            setEndDate(null)
            setAdults(0)
            setChildren(0)
            setRooms(0)
            setTravelingWithPets(false)
            setToPlaceKey(prev => prev + 1)
            setHotelsSearchParams({})

            // Implementation for clear button
          }}
        >
          Clear <IconifyIcon icon='tabler:x' fontSize='1rem' sx={{ ml: 0.5 }} />
        </Button>
      )}
    </Box>
  )
}

export default LandingHeroSearch
