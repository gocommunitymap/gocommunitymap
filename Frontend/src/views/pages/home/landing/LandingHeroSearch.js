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
import { City, Country, State } from 'country-state-city'
import IconifyIcon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { landingCountries, landingLocations } from 'src/@core/utils'

import { defaultPageFont } from 'src/@core/utils'

const LOCATION_POPPER_WIDTH = 460
const MAX_CITIES_PER_COUNTRY = 250
const WHERE_TO_COUNTRY_ISO = 'SO'
const VIRTUAL_LIST_PADDING = 8
const VIRTUAL_VISIBLE_ROWS = 6

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

const buildLocationOptionsByCountryISO = countryISO => {
  try {
    const selectedCountry = Country.getCountryByCode(countryISO)

    if (!selectedCountry) {
      return landingLocations
    }

    const countryStates = State.getStatesOfCountry(selectedCountry.isoCode)

    const stateNameByCode = countryStates.reduce((map, state) => {
      map[state.isoCode] = state.name

      return map
    }, {})

    const options = City.getCitiesOfCountry(selectedCountry.isoCode)
      .slice(0, MAX_CITIES_PER_COUNTRY)
      .map(city => ({
        id: `${selectedCountry.isoCode}-${city.stateCode || 'NA'}-${city.name}`,
        city: city.name,
        region: stateNameByCode[city.stateCode] || selectedCountry.name,
        country: selectedCountry.name,
        stateCode: city.stateCode || '',
        countryCode: selectedCountry.isoCode
      }))

    return options.length ? options : landingLocations
  } catch {
    return landingLocations
  }
}

const locationOptions = buildLocationOptionsByCountryISO(WHERE_TO_COUNTRY_ISO)

const buildCountryOptions = () => {
  try {
    return Country.getAllCountries().map(country => ({
      id: `country-${country.isoCode}`,
      city: '',
      region: '',
      country: country.name,
      stateCode: '',
      countryCode: country.isoCode
    }))
  } catch {
    return landingCountries.map(country => ({
      id: `country-${country}`,
      city: '',
      region: '',
      country,
      stateCode: '',
      countryCode: ''
    }))
  }
}

const countryOptions = buildCountryOptions()

const LandingHeroSearch = ({ tabs, fields = [], activeTab, setActiveTab, onSearch: onSearchCallback }) => {
  const router = useRouter()
  const [fromLocation, setFromLocation] = useState(countryOptions[0] || null)
  const [toLocation, setToLocation] = useState(locationOptions[2] || locationOptions[0] || null)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 6))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [travelingWithPets, setTravelingWithPets] = useState(false)
  const [guestAnchorEl, setGuestAnchorEl] = useState(null)

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

  const handleDateRangeChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const startDateValue = startDate ? format(startDate, 'yyyy-MM-dd') : ''
  const endDateValue = endDate ? format(endDate, 'yyyy-MM-dd') : ''
  const totalGuests = adults + children

  const guestSummary = `${adults} adult${adults > 1 ? 's' : ''} - ${children} children - ${rooms} room${
    rooms > 1 ? 's' : ''
  }`

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
      onSearchCallback({
        fromCountry: fromLocation?.country || '',
        fromCity: fromLocation?.city || '',
        toCountry: toLocation?.country || '',
        toCity: toLocation?.city || '',
        checkIn: startDateValue,
        checkOut: endDateValue,
        guests: totalGuests,
        adults,
        children,
        rooms,
        pets: travelingWithPets
      })

      return
    }

    const params = new URLSearchParams({
      from: fromCountry,
      to: toCountry,
      startDate: startDateValue,
      endDate: endDateValue,
      guests: String(totalGuests),
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
      pets: String(travelingWithPets)
    })

    params.set('fromCity', fromLocation?.city || '')
    params.set('fromCountry', fromLocation?.country || '')
    params.set('toCity', toLocation?.city || '')
    params.set('toCountry', toLocation?.country || '')

    router.push(`${tab?.route || '/rental/properties'}?${params.toString()}`)
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
  const toCountry = formatLocationLabel(toLocation)

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

  const renderLocationOption = (props, option) => {
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
          <IconifyIcon icon='tabler:map-pin' color='#2f3948' fontSize='1.35rem' />
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: '#07102b',
                fontFamily: defaultPageFont,
                lineHeight: 1.2,
                fontSize: '1.05rem'
              }}
            >
              {option.city}
            </Typography>
            <Typography
              sx={{ color: '#2f3d54', fontFamily: defaultPageFont, lineHeight: 1.2, fontSize: '0.95rem', mt: 0.2 }}
            >
              {option.region}, {option.country}
            </Typography>
          </Box>
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
                <Autocomplete
                  fullWidth
                  options={locationOptions}
                  value={toLocation}
                  onChange={(_, value) => setToLocation(value || locationOptions[2] || locationOptions[0] || null)}
                  getOptionLabel={option => `${option.city}, ${option.country}`}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={renderLocationOption}
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
                      startDate={startDate}
                      endDate={endDate}
                      selected={startDate}
                      onChange={handleDateRangeChange}
                      customInput={
                        <TextField
                          variant='standard'
                          value='DDD M - M'
                          InputProps={{
                            disableUnderline: true,
                            readOnly: true,
                            sx: {
                              fontWeight: 700,
                              color: '#0f1419',
                              fontFamily: defaultPageFont,
                              fontSize: { xs: '1rem', md: '1.05rem' },
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

          {/* Guests */}
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
                  Guests
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
                    {adults} Adult{adults > 1 ? 's' : ''}
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
                          spacing={0.6}
                          sx={{ border: '1px solid #cfd7e2', borderRadius: 1.2, px: 0.6, py: 0.3, minWidth: 156 }}
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
    </Box>
  )
}

export default LandingHeroSearch
