import { CheckBox, Logout, PersonAdd, Settings } from '@mui/icons-material'
import {
  Autocomplete,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  NativeSelect,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import { useTheme } from '@mui/material/styles'

import { LoadingButton } from '@mui/lab'
import { Autocomplete as GAutocomplete, useLoadScript } from '@react-google-maps/api'

import { Box, minHeight, useMediaQuery } from '@mui/system'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import IconifyIcon from 'src/@core/components/icon'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'

import {
  priceOptions,
  radiusOptions,
  mustHavesOptions,
  propertyStatusOptions,
  addedToSiteOptions,
  ieoOptions
} from 'src/configs'
import { getHotels } from 'src/store'
import { serverGet } from 'src/configs/services/serverHttp'
import { API_URL } from 'src/configs'
import SeoHead from 'src/components/SeoHead'
import {
  DiscoverSections,
  NewsSections,
  NoRecordCard,
  PropertyCard,
  SearchHotelsSectionCard,
  SecondSections
} from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import { useRouter } from 'next/router'
import FallbackSpinner from 'src/@core/components/spinner'
import LinkSaveButton from 'src/views/components/buttons/link-save-button'
import { countryISO, getGlobalParametersGroupsLOV, getOptionsByTypeCode, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'

const placesLibrary = ['places']
const pageTitle = 'Properties'

const linkList = [
  { title: 'Home', link: '/home' },
  { title: 'Hotels', link: '/hotels' }
]

const FilterBar = ({ setIsDrawerOpen, filteredCount, clearFIlter }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [searchResult, setSearchResult] = useState('Result: none')
  const [searchState, setSearchState] = useState()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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

      setSearchState({ name, status, formattedAddress })
    } else {
      alert('Please enter text')
    }
  }

  return (
    <Grid container>
      <Grid item xs={12} pb={3}>
        <BreadCrumbs list={linkList} title={pageTitle} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12} md={8}>
                {isLoaded ? (
                  <GAutocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                    <TextField
                      id='location'
                      size='small'
                      value={searchState?.formattedAddress}
                      placeholder='Search Location'
                      fullWidth
                    />
                  </GAutocomplete>
                ) : (
                  <CircularProgress color='secondary' />
                )}
              </Grid>
              <Grid
                item
                mt={{ xs: 1, md: 0 }}
                md={3}
                xs={12}
                display={{ md: 'flex', xs: 'block' }}
                alignItems='center'
                justifyContent={{ xs: 'end', md: 'start' }}
              >
                <Badge sx={{ mx: 1 }} color='primary' badgeContent={filteredCount}>
                  <Button variant='outlined' onClick={() => setIsDrawerOpen(true)}>
                    Advance Filter
                    <IconifyIcon icon='tabler:filter-search' />
                  </Button>
                </Badge>
                {filteredCount > 0 && (
                  <Tooltip title='Clear Filter' mx={1}>
                    <IconButton size='small' color='error' sx={{ height: 40, width: 40 }} onClick={() => clearFIlter()}>
                      <IconifyIcon fontSize={20} icon='tabler:filter-x' />
                    </IconButton>
                  </Tooltip>
                )}

                <LinkSaveButton TYPE='L' title='SAVE' variant='outlined' />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

const defaultValues = {
  radius: radiusOptions[0],
  minBeds: { value: '0', label: 'No Limit' },
  maxBeds: { value: '0', label: 'No Limit' },
  minPrice: priceOptions[0],
  maxPrice: priceOptions[0],
  propertyType: { value: '0', label: 'Show All' },
  newHomes: ieoOptions[0].value,
  retirementHomes: ieoOptions[0].value,
  sharedOwnership: ieoOptions[0].value,
  auction: ieoOptions[0].value,
  propertyStatus: null,
  addedToSite: addedToSiteOptions[0].value,
  keywords: null
}

const FilterDrawer = ({
  bedsOptions,
  propertyTypesOptions,
  isDrawerOpen,
  setIsDrawerOpen,
  filterState,
  setFilterState,
  dataList,
  setDataList,
  filteredCount,
  setFilteredCount,
  setFilterList,
  setSearchStates,
  filterList,
  control,
  handleSubmit,
  setValue,
  reset,
  watch,
  onSubmit,
  clearFIlter
}) => {
  const [showAllPropertyType, setShowAllPropertyType] = useState(false)

  useEffect(() => {
    if (filterState) {
      const obj = Object?.keys(filterState)
      for (let i = 0; i < obj.length; i++) {
        setValue(obj[i], filterState[obj[i]])
      }
    }
  }, [isDrawerOpen])

  return (
    <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Box m={5}>
          <Badge color='primary' badgeContent={filteredCount}>
            <Typography variant='h5' display='flex' alignItems='center'>
              Advance Filter
              <IconifyIcon icon='tabler:filter-search' style={{ fontSize: 30 }} />
            </Typography>
          </Badge>
        </Box>
        <Box px={5} sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <List sx={{ minWidth: 400 }}>
            <ListItem>
              <FormControl fullWidth size='small'>
                <Controller
                  name='radius'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        size='small'
                        options={radiusOptions}
                        disableClearable
                        value={field.value?.value ? field.value : null}
                        getOptionLabel={option => option.label}
                        onChange={(_, data) => field.onChange(data)}
                        renderInput={params => (
                          <TextField {...params} label='Radius' placeholder='select Radius' variant='outlined' />
                        )}
                      />
                    )
                  }}
                />
              </FormControl>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Bedrooms
                </Typography>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='minBeds'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={bedsOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Min' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='maxBeds'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={bedsOptions.filter(i => parseInt(i.value) >= parseInt(watch('minBeds')?.value))}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Max' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Price
                </Typography>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='minPrice'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={priceOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Min' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='maxPrice'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={priceOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Max' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Property type
                </Typography>
                <FormControl fullWidth size='small' variant='filled'>
                  <RadioGroup
                    row
                    aria-label='propertyTypes-label'
                    name='propertyTypes-group'
                    defaultValue='primary'
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Grid container>
                      {propertyTypesOptions.map((item, index) => {
                        if ((index <= 5 && !showAllPropertyType) || showAllPropertyType) {
                          return (
                            <Grid item key={item.value} md={6} xs={12}>
                              <Controller
                                name='propertyType'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <FormControlLabel
                                    sx={{ minWidth: 110 }}
                                    value={item.value}
                                    onChange={onChange}
                                    control={<Radio color='secondary' checked={item.value == value} />}
                                    label={item.label}
                                  />
                                )}
                              />
                            </Grid>
                          )
                        }
                      })}
                    </Grid>
                  </RadioGroup>
                  <Button
                    color='secondary'
                    variant='contained'
                    onClick={() => setShowAllPropertyType(!showAllPropertyType)}
                  >
                    {showAllPropertyType ? 'Less' : 'Show All Properties'}
                  </Button>
                </FormControl>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold' mb={3}>
                  Include, exclude & show only
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            New Homes:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='newHomes'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            Retirement Homes:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='retirementHomes'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            Shared Ownership:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='sharedOwnership'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            Auction:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='auction'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Must Have
                </Typography>
                <FormGroup>
                  <Grid container spacing={3}>
                    {mustHavesOptions.map((item, index) => (
                      <Grid key={index} item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={`mustHaves-${item.value}`}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              label={item.label}
                              control={<Checkbox color='secondary' checked={value} onChange={onChange} />}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Property Status
                </Typography>
                <FormGroup>
                  <Grid container spacing={3}>
                    {propertyStatusOptions.map((item, index) => (
                      <Grid key={index} item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={`propertyStatus-${item.value}`}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              label={item.label}
                              control={<Checkbox color='secondary' checked={value} onChange={onChange} />}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Added to site
                </Typography>
                <FormGroup>
                  <RadioGroup name='addedToSite-group' defaultValue={addedToSiteOptions[0]}>
                    <Grid container spacing={3}>
                      {addedToSiteOptions.map(item => (
                        <Controller
                          key={item.value}
                          name='addedToSite'
                          defaultValue={addedToSiteOptions[0]}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              label={item.label}
                              value={item.value}
                              onChange={onChange}
                              control={<Radio color='secondary' checked={item.value === value} />}
                            />
                          )}
                        />
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormGroup>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Keywords
                </Typography>

                <Controller
                  name='keywords'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      inputProps={{ maxLength: 100 }}
                      label='Keywords'
                      onChange={onChange}
                      placeholder='NAME'
                      size='small'
                    />
                  )}
                />
                <Typography variant='body2'>
                  Search for phrases by using quotation marks e.g. -œdouble garage-, or exclude terms by prefixing them
                  with a minus sign e.g. -studio.
                </Typography>
              </Box>
            </ListItem>
          </List>
        </Box>
        <Box textAlign='center' p={5}>
          <Button variant='outlined' onClick={() => clearFIlter()} sx={{ mr: 3 }}>
            Clear Filter
          </Button>
          <LoadingButton type='submit' variant='contained'>
            Apply Filter
          </LoadingButton>
        </Box>
      </form>
    </Drawer>
  )
}

const Properties = ({ initialProperties = [] }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })
  const dispatch = useDispatch()
  const { query, replace } = useRouter()
  const { user } = useAuth()
  const theme = useTheme()

  const breakpoint = useMediaQuery(theme => theme.breakpoints.down('md'))

  const store = useSelector(state => state.hotels)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filterState, setFilterState] = useState({})
  const [dataList, setDataList] = useState(initialProperties)
  const [filterList, setFilterList] = useState(initialProperties)
  const [sortby, setSortby] = useState('most_recent')
  const [filteredCount, setFilteredCount] = useState(0)
  const linkList = [{ title: 'Home', link: '/home' }]
  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [bedsOptions, setBedsOptions] = useState([])
  const [propertyTypesOptions, setPropertyTypesOptions] = useState([])

  const loadFilterOptions = async () => {
    const globalParametersLOVData = await getGlobalParametersGroupsLOV(
      `${GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE},${GLOBAL_PARAMETER_TYPES.BEDROOMS}`
    )

    const propertyTypes = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE)
    const bedrooms = getOptionsByTypeCode(globalParametersLOVData, GLOBAL_PARAMETER_TYPES.BEDROOMS)

    if (propertyTypes?.length > 0) {
      const options = [{ value: 0, label: 'Show All' }, ...propertyTypes]
      setPropertyTypesOptions(options)
    }

    if (bedrooms?.length > 0) {
      const options = [{ value: '0', label: 'No Limit' }, ...bedrooms]
      setBedsOptions(options)
    }
  }

  const initialized = async () => {
    loadFilterOptions()
  }

  useEffect(() => {
    initialized()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1)
  }

  const onSubmit = (data, dataset = []) => {
    let _data = dataset.length > 0 ? dataset : [...dataList]
    let _filteredCount = 0
    if (data?.location) {
      _data = _data.filter(i => i.PLACE.includes(data?.location.replace(', UK', '')))
    }
    if (data?.radius && data?.radius !== null && data?.radius.value > 1) {
      _filteredCount = _filteredCount + 1

      //*** To do link with Map Api ***///
    }
    if (data?.minBeds && data?.minBeds !== null && data?.minBeds.value !== '0') {
      _filteredCount = _filteredCount + 1
      if (data?.minBeds.value == '10') {
        _data = _data.filter(i => i.BEDROOMS_ID >= 10)
      } else {
        _data = _data.filter(i => i.BEDROOMS_ID >= parseInt(data.minBeds?.value))
      }
    }
    if (data?.maxBeds && data?.maxBeds !== null && data?.maxBeds.value !== '0') {
      _filteredCount = _filteredCount + 1
      if (data?.maxBeds.value == '10') {
        _data = _data.filter(i => i.BEDROOMS_ID >= 10)
      } else {
        _data = _data.filter(i => i.BEDROOMS_ID <= parseInt(data.maxBeds?.value))
      }
    }
    if (data?.minPrice && data?.minPrice !== null && data?.minPrice.value > 0) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.PRICE >= data.minPrice?.value)
    }
    if (data?.maxPrice && data?.maxPrice !== null && data?.maxPrice.value > 0) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.PRICE <= data.maxPrice?.value)
    }
    if (data?.propertyType && data?.propertyType > 0) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.PROPERTY_TYPE_ID == data.propertyType)
    }

    if (data?.newHomes && data?.newHomes === 'e') {
      _filteredCount = _filteredCount + 1
      _data = _data?.filter(i => i.NEW_BUILD === false)
    } else if (data?.newHomes && data.newHomes === 's') {
      _filteredCount = _filteredCount + 1
      _data = _data?.filter(i => i.NEW_BUILD === true)
    }
    if (data?.retirementHomes && data?.retirementHomes === 'e') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.RETIREMENT_HOME === false)
    } else if (data?.retirementHomes && data?.retirementHomes === 's') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.RETIREMENT_HOME === true)
    }

    if (data['mustHaves-1'] && data['mustHaves-1'] === true) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => {
        let isFind = false
        const isFeaturesFind = Boolean(i.PROPERTY_FEATURES.length > 0)
        if (isFeaturesFind) {
          const features = JSON.parse(i.PROPERTY_FEATURES)
          isFind = Boolean(features.find(i => i.FEATURES.includes('garden')))
        }

        return isFeaturesFind && isFind && i
      })
    }

    if (data['mustHaves-2'] && data['mustHaves-2'] === true) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => {
        let isFind = false
        const isFeaturesFind = Boolean(i.PROPERTY_FEATURES.length > 0)
        if (isFeaturesFind) {
          const features = JSON.parse(i.PROPERTY_FEATURES)
          isFind = Boolean(features.find(i => i.FEATURES.includes('parking') || i.FEATURES.includes('garage')))
        }

        return isFeaturesFind && isFind && i
      })
    }

    if (data['mustHaves-3'] && data['mustHaves-3'] === true) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => {
        let isFind = false
        const isFeaturesFind = Boolean(i.PROPERTY_FEATURES.length > 0)
        if (isFeaturesFind) {
          const features = JSON.parse(i.PROPERTY_FEATURES)
          isFind = Boolean(features.find(i => i.FEATURES.includes('balcony') || i.FEATURES.includes('terrace')))
        }

        return isFeaturesFind && isFind && i
      })
    }

    if (data?.addedToSite && data?.addedToSite === '24h') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.TOTAL_HOURS <= 24)
    } else if (data?.addedToSite && data?.addedToSite === '3d') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.TOTAL_DAYS <= 3)
    } else if (data?.addedToSite && data?.addedToSite === '7d') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.TOTAL_DAYS <= 7)
    } else if (data?.addedToSite && data?.addedToSite === '14d') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.TOTAL_DAYS <= 14)
    } else if (data?.addedToSite && data?.addedToSite === '30d') {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => i.TOTAL_DAYS <= 30)
    }

    if (data?.keywords !== null && data?.keywords?.trim().length > 0) {
      _filteredCount = _filteredCount + 1
      _data = _data.filter(i => {
        let filteredRow = []
        if (
          (i.FULLPOSTCODE !== null && i.FULLPOSTCODE.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.PROPERTY_NUM_NAME !== null && i.PROPERTY_NUM_NAME.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.STREET_NAME !== null && i.STREET_NAME.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.AREA_TOWN_CITY !== null && i.AREA_TOWN_CITY.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.OWN_REF !== null && i.OWN_REF.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.SIZE !== null && i.SIZE.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.SUMMARY !== null && i.SUMMARY.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.FULLDESCRIPTION !== null && i.FULLDESCRIPTION.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.PLANNING_CONSIDERATIONS !== null &&
            i.PLANNING_CONSIDERATIONS.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.PROPERTY_TYPE_DESC !== null && i.PROPERTY_TYPE_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.TENURE_DESC !== null && i.TENURE_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.COUNCIL_TAX_BAND_DESC !== null &&
            i.COUNCIL_TAX_BAND_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.PRICE_MODIFIER_DESC !== null &&
            i.PRICE_MODIFIER_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.BEDROOMS_DESC !== null && i.BEDROOMS_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.BATHROOMS_DESC !== null && i.BATHROOMS_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.RECEPTIONS_DESC !== null && i.RECEPTIONS_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.FLOORS_DESC !== null && i.FLOORS_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.UNITS_DESC !== null && i.UNITS_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.LISTING_TYPE_DESC !== null && i.LISTING_TYPE_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.CONTENT_TYPE_DESC !== null && i.CONTENT_TYPE_DESC.toLowerCase().includes(data.keywords.toLowerCase())) ||
          (i.PROPERTY_NUM_NAME !== null && i.PROPERTY_NUM_NAME.toLowerCase().includes(data.keywords.toLowerCase()))
        ) {
          return i
        }

        const _PROPERTY_FEATURES =
          i.PROPERTY_FEATURES.length > 0 &&
          JSON.parse(i.PROPERTY_FEATURES).filter(row =>
            row.FEATURES.toLowerCase().includes(data.keywords.toLowerCase())
          )

        const _CUSTOM_FEATURES =
          i.CUSTOM_FEATURES.length > 0 &&
          JSON.parse(i.CUSTOM_FEATURES).filter(row =>
            row.DESCRIPTION.toLowerCase().includes(data.keywords.toLowerCase())
          )

        if (_PROPERTY_FEATURES.length > 0) {
          return i
        }
        if (_CUSTOM_FEATURES.length > 0) {
          return i
        }
      })
    }

    setFilteredCount(_filteredCount)
    setFilterList(_data)
    setIsDrawerOpen(false)
    setFilterState(data)
  }
  useEffect(() => {
    setIsLoading(true)
    dispatch(getHotels({ user: user?.usercode || 0 })).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }
      setIsLoading(false)
      const { location, minBeds, maxPrice, newHomes } = query
      if (location) {
        setSearchStates({ ...searchStates, formattedAddress: location })
        let queryParams = { location }
        queryParams = minBeds ? { ...queryParams, minBeds: { value: minBeds } } : queryParams
        queryParams = maxPrice ? { ...queryParams, maxPrice: { value: maxPrice } } : queryParams
        queryParams = newHomes ? { ...queryParams, newHomes } : queryParams
        onSubmit(queryParams, response?.payload)

        setValue(
          'minBeds',
          bedsOptions.find(i => i.value == minBeds)
        )
        setValue(
          'maxPrice',
          priceOptions.find(i => i.value == maxPrice)
        )
        setValue('newHomes', newHomes)
        setSearchStates({
          name: location.substring(location.lastIndexOf(','), location.length),
          status: null,
          formattedAddress: location
        })

        //setValue()
        //setValue()
        //setValue()
        //keywords, , , newHomes
      } else {
        setDataList(response?.payload)
        setFilterList(response?.payload)
      }

      if (searchStates?.filteredData?.length > 0) {
        setSearchStates({ ...searchStates, filteredData: filteredRows })
      }
    })

    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query])

  const clearFIlter = () => {
    reset()
    setFilteredCount(0)
    setIsDrawerOpen(false)
    setFilterList(dataList)
    replace('/hotels/properties')
  }

  const handleSort = event => {
    const sortDataList = [...filterList]
    let _dataList = []
    setSortby(event.target.value)
    if (event.target.value === 'most_recent') {
      _dataList = sortDataList?.sort((a, b) => new Date(b.CREATEDON) - new Date(a.CREATEDON))
    } else if (event.target.value === 'lowest_price') {
      _dataList = sortDataList?.sort((a, b) => a.PRICE - b.PRICE)
    } else if (event.target.value === 'newest_listings') {
      _dataList = sortDataList?.sort((a, b) => b.PRICE - a.PRICE)
    }

    setFilterList(_dataList)
  }

  return (
    <>
      <SeoHead
        title='Properties Hotels'
        description='Browse all properties hotels. Filter by location, price, bedrooms and more.'
        canonical='https://gocommunitymaptymap.com/hotels/properties'
      />
      <Grid container>
        <Grid item xs={12}>
          <FilterBar setIsDrawerOpen={setIsDrawerOpen} filteredCount={filteredCount} clearFIlter={clearFIlter} />
        </Grid>
        <Grid item xs={12} pt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} display={{ md: 'flex', xs: 'block' }} justifyContent='space-between'>
              <Box>
                <Typography variant='h6'>
                  Properties Hotels <small>{searchStates.formattedAddress?.split(',')[0]}</small>
                </Typography>
                <Typography variant='subtitle2'>{filterList?.length ?? '0'} Record(s)</Typography>
              </Box>
              <Box display={{ md: 'flex', xs: 'block' }} alignItems='center'>
                <Typography variant='subtitle1' mr={2}>
                  Sort:
                </Typography>
                <NativeSelect size='small' id='demo-select-small' prefix='Sort:' onChange={handleSort}>
                  <option value='most_recent' selected={sortby === 'most_recent'}>
                    Most recent
                  </option>
                  <option value='newest_listings' selected={sortby === 'newest_listings'}>
                    Highest price
                  </option>
                  <option value='lowest_price' selected={sortby === 'lowest_price'}>
                    Lowest price
                  </option>
                </NativeSelect>
                <IconifyIcon icon='tabler:arrows-sort' />
              </Box>
            </Grid>
            <Grid item md={8} xs={12} p={5}>
              <Grid container spacing={3}>
                {isLoading ? (
                  <Grid item xs={12} display='flex' justifyContent='center' alignItems='center' sx={{ minHeight: 300 }}>
                    <CircularProgress color='secondary' />
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    {filterList?.length > 0 ? (
                      <Grid container>
                        <Grid item xs={12}>
                          {filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                            <PropertyCard key={row.PROPERTY_ID} data={row} />
                          ))}
                        </Grid>
                        <Grid item xs={12}>
                          <Card sx={{ p: 2 }}>
                            <Box
                              display={{ md: 'flex', xs: 'block' }}
                              justifyContent='space-between'
                              alignItems='center'
                            >
                              <Pagination
                                count={Math.ceil(filterList?.length / rowsPerPage)}
                                onChange={handleChangePage}
                                variant='text'
                                size={breakpoint ? 'small' : 'large'}
                                shape='rounded'
                                color='secondary'
                              />
                              <Typography variant='subtitle2' textAlign='right'>
                                {page + 1}-“{(page + 1) * rowsPerPage} of {filterList.length}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      </Grid>
                    ) : (
                      <NoRecordCard />
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item md={4} sx={{ display: { xs: 'none', sm: 'block' } }} xs={12}>
              <Card fullWidth sx={{ mt: 2, height: '95%' }}>
                <CardHeader title='Right Section' />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <FilterDrawer
        bedsOptions={bedsOptions}
        propertyTypesOptions={propertyTypesOptions}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        filterState={filterState}
        setFilterState={setFilterState}
        setDataList={setDataList}
        dataList={dataList}
        setFilterList={setFilterList}
        filterList={filterList}
        setFilteredCount={setFilteredCount}
        filteredCount={filteredCount}
        setSearchStates={setSearchStates}
        control={control}
        handleSubmit={handleSubmit}
        setValue={setValue}
        reset={reset}
        onSubmit={onSubmit}
        clearFIlter={clearFIlter}
        watch={watch}
      /> */}
    </>
  )
}

Properties.guestGuard = true

export const getServerSideProps = async () => {
  try {
    const data = await serverGet(API_URL.GET_PROPERTIES_FULL_DETAILS, { LISTING_TYPE_ID: 1 })

    return { props: { initialProperties: Array.isArray(data) ? data : [] } }
  } catch {
    return { props: { initialProperties: [] } }
  }
}

Properties.guestGuard = true

export default Properties
