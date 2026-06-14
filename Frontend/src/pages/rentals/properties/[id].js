import {
  Alert,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import {
  API_URL,
  getGlobalParametersAPI,
  getGlobalParametersGuestAPI,
  getRentalBookingCalendarAPI,
  listingTypes
} from 'src/configs'
import { serverGet, serverGetRaw } from 'src/configs/services/serverHttp'
import { NoRecordCard } from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import SeoHead from 'src/components/SeoHead'
import addDays from 'date-fns/addDays'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import format from 'date-fns/format'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import PropertyDetailHeader from 'src/views/components/PropertyDetailHeader'
import SwiperControls2 from 'src/views/components/swiper/SwiperControls2'
import {
  PropertyHighlights,
  PropertyAbout,
  PropertyFacilitiesCard,
  PropertyHouseRules,
  PropertyHost,
  PropertyImportantInfo,
  PropertyFAQ,
  PropertyReviews,
  PropertyMapCard,
  PropertyBookingWidget
} from 'src/views/pages/hotels/detail'
import PropertyAdministration from 'src/views/components/PropertyAdministration'
import { amountWithComma, dateConvert, getGlobalParametersLOV, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'
import Link from 'next/link'
import IconifyIcon from 'src/@core/components/icon'

const linkList = [{ title: 'Home', link: '/home' }]
const pageTitle = 'Detail'

const parsePropertyPayload = payload => {
  if (!payload) return null

  if (Array.isArray(payload)) return payload[0] || null
  if (Array.isArray(payload?.data)) return payload.data[0] || null

  if (typeof payload === 'object' && (payload.PROPERTY_ID || payload.PROPERTY_NUM_NAME || payload.SUMMARY)) {
    return payload
  }

  if (payload?.data && typeof payload.data === 'object') return payload.data

  return null
}

const fetchPropertyById = async PROPERTY_ID => {
  const requestParams = {
    PROPERTY_ID,
    LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID,
    PAGE_NUMBER: 1,
    PAGE_SIZE: 1
  }

  const rawData = await serverGetRaw(API_URL.GET_PROPERTIES_FULL_DETAILS, requestParams)
  const rawProperty = parsePropertyPayload(rawData)
  if (rawProperty) {
    return rawProperty
  }

  const guestData = await serverGet(API_URL.GET_PROPERTIES_FULL_DETAILS, requestParams)
  const guestProperty = parsePropertyPayload(guestData)
  if (guestProperty) {
    return guestProperty
  }

  return null
}

const safeParsePropertyArray = value => {
  if (!value) return []

  if (Array.isArray(value)) return value

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

const getFirstPicture = pictureLinks => {
  try {
    const pics = JSON.parse(pictureLinks || '[]')

    return (Array.isArray(pics) && pics[0]?.LINK) || (typeof pics[0] === 'string' ? pics[0] : '') || ''
  } catch {
    return ''
  }
}

export const getServerSideProps = async params => {
  const dynamicId = params?.params?.id
  const queryId = params?.query?.id
  const routeId = Array.isArray(dynamicId) ? dynamicId[0] : dynamicId
  const fallbackId = Array.isArray(queryId) ? queryId[0] : queryId
  const PROPERTY_ID = routeId || fallbackId

  if (!PROPERTY_ID) return { props: { property: null, propertyId: PROPERTY_ID, rooms: null } }

  const property = await fetchPropertyById(PROPERTY_ID)

  if (!property) return { props: { property: null, propertyId: PROPERTY_ID, rooms: null } }

  const _property = {
    ...property,
    AVAILABLE_QUANTITY: Number(property.AVAILABLE_QUANTITY) || 0
  }

  return { props: { property: _property, propertyId: PROPERTY_ID } }
}

const PropertyDetail = params => {
  const { property, propertyId } = params
  const router = useRouter()

  const resolvedPropertyId = property?.PROPERTY_ID || propertyId || null
  const seoTitle = property?.PROPERTY_TITLE || property?.PROPERTY_NUM_NAME || 'Property Rental'

  const [startDate, setStartDate] = useState(addDays(new Date(), 1))
  const [endDate, setEndDate] = useState(addDays(new Date(), 2))
  const [adults, setAdults] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [roomCount, setRoomCount] = useState(1)
  const [appsetParams, setAppsetParams] = useState([])
  const [bookingCalendar, setBookingCalendar] = useState([])

  const [priceMap, setPriceMap] = useState({
    [format(new Date(), 'yyyy-MM-dd')]: '0'
  })
  const [updatedProperty, setUpdatedProperty] = useState(property || [])

  const isAvailableBetweenSelectedDates = useMemo(() => {
    if (!bookingCalendar || bookingCalendar.length === 0) return true

    const unavailableDates = bookingCalendar
      .filter(item => item.PROPERTY_ID === updatedProperty.PROPERTY_ID && item.BALANCE === 0)
      .map(item => format(new Date(item.DATE), 'yyyy-MM-dd'))

    const selectedDates = []
    let currentDate = startDate
    while (currentDate <= endDate) {
      selectedDates.push(format(currentDate, 'yyyy-MM-dd'))
      currentDate = addDays(currentDate, 1)
    }

    return !selectedDates.some(date => unavailableDates.includes(date))
  }, [bookingCalendar, startDate, endDate, updatedProperty])

  const getBookingCalendar = async (from, to) => {
    if (from && to) {
      await getRentalBookingCalendarAPI({
        CHECK_IN: format(from, 'yyyy-MM-dd'),
        CHECK_OUT: format(to, 'yyyy-MM-dd'),
        PROPERTY_ID: resolvedPropertyId
      })
        .then(res => {
          const respData = res?.data || []

          const newPriceMap = respData.reduce((acc, item) => {
            const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
            const PRICE = (item.PRICE / property.RENTAL_FREQUENCY_DAYS) * totalDays

            acc[format(new Date(item.DATE), 'yyyy-MM-dd')] =
              PRICE > 0 ? (PRICE > 999 ? `${(PRICE / 1000).toString()}k` : PRICE.toString()) : '0'

            return acc
          }, {})
          setBookingCalendar(prev => [...prev, ...respData])

          setPriceMap(prev => ({
            ...prev,
            ...newPriceMap
          }))
        })
        .catch(err => {
          console.log('Error fetching booking calendar:', err)
        })
    } else {
      setPriceMap({})
    }
  }

  const updateAvailableQuantity = () => {
    if (!bookingCalendar || bookingCalendar.length === 0) return

    const balance =
      bookingCalendar.find(
        item =>
          item.PROPERTY_ID === updatedProperty.PROPERTY_ID &&
          format(new Date(item.DATE), 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd')
      )?.BALANCE || 0

    const AVAILABLE_QUANTITY = balance

    const updateProperty = { ...updatedProperty, AVAILABLE_QUANTITY }

    setUpdatedProperty(updateProperty)
  }

  useEffect(() => {
    const from = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : null
    const to = endDate ? new Date(endDate.getFullYear(), endDate.getMonth() + 2, 0) : null

    getBookingCalendar(from, to)
  }, [startDate, endDate, resolvedPropertyId])

  useEffect(() => {
    updateAvailableQuantity()
  }, [bookingCalendar])

  useEffect(() => {
    getGlobalParametersGuestAPI({ TYPE_CODE: GLOBAL_PARAMETER_TYPES.APPLICATION_SETTING })
      .then(res => setAppsetParams(res?.data || []))
      .catch(() => {})
  }, [])

  const facilities = useMemo(() => {
    const featureItems = safeParsePropertyArray(property?.PROPERTY_FEATURES)
      .map(item => ({ title: item?.FEATURES, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(item => item?.title)

    const utilityItems = safeParsePropertyArray(property?.PROPERTY_UTILITIES)
      .map(item => ({ title: item?.UTILITIES, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(item => item?.title)

    const uapItems = safeParsePropertyArray(property?.PROPERTY_UAP)
      .filter(item => {
        const value = `${item?.SELECT_VALUE || ''}`.trim().toLowerCase()

        return value && value !== '0' && value !== 'n' && value !== 'false'
      })
      .map(item => ({ title: item?.DESCRIPTION, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(item => item?.title)

    const customFeatureItems = safeParsePropertyArray(property?.CUSTOM_FEATURES)
      .map(item => ({ title: item?.DESCRIPTION, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(item => item?.title)

    return [...featureItems, ...utilityItems, ...uapItems, ...customFeatureItems]
  }, [property])

  const handleSearchChange = changes => {
    if ('startDate' in changes) setStartDate(changes.startDate)
    if ('endDate' in changes) setEndDate(changes.endDate)
    if ('adults' in changes) setAdults(changes.adults)
    if ('childCount' in changes) setChildCount(changes.childCount)
    if ('roomCount' in changes) setRoomCount(changes.roomCount)
  }

  const handleBeginBooking = () => {
    const nights = startDate && endDate ? Math.max(1, differenceInCalendarDays(endDate, startDate)) : 1

    const subtotal = (Number(property?.PRICE) || 0) * nights
    const feeLines = appsetParams.map(p => Math.round(subtotal * ((parseFloat(p.PARAMETER_DESCRIPTION_4) || 0) / 100)))
    const serviceFee = feeLines.reduce((sum, amount) => sum + amount, 0)
    const total = subtotal + serviceFee

    const params = new URLSearchParams({
      propertyId: property?.PROPERTY_ID || '',
      propertyName: property?.PROPERTY_TITLE || property?.PROPERTY_NUM_NAME || '',
      propertyImage: getFirstPicture(property?.PICTURE_LINKS),
      place: property?.PLACE || '',
      checkInTime: property?.CHECK_IN_TIMESLOT_DESC || '',
      checkOutTime: property?.CHECK_OUT_TIMESLOT_DESC || '',
      pricePerNight: String(Number(property?.PRICE) || 0),
      checkIn: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      checkOut: endDate ? format(endDate, 'yyyy-MM-dd') : '',
      nights: String(nights),
      adults: String(adults),
      children: String(childCount),
      rooms: String(roomCount),
      subtotal: String(subtotal),
      serviceFee: String(serviceFee),
      total: String(total),
      selectedRooms: '[]',
      listingTypeId: '2'
    })

    router.push(`/rentals/booking/details?${params.toString()}`)
  }

  return (
    <Container maxWidth='lg'>
      <SeoHead
        title={seoTitle}
        description={
          property?.SUMMARY ? property?.SUMMARY.substring(0, 155) : 'View full details of this rental property.'
        }
        ogImage={property?.PICTURE_LINK}
        ogType='article'
        canonical={`https://gocommunitymap.com/rentals/properties/${resolvedPropertyId || ''}`}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} pb={3}>
          <BreadCrumbs list={linkList} title={property?.PROPERTY_NUM_NAME || ''} />
        </Grid>
      </Grid>

      {property && property !== null && property !== undefined ? (
        <Grid container spacing={4}>
          <Grid item lg={8} xs={12}>
            <Alert severity={isAvailableBetweenSelectedDates ? 'success' : 'error'} sx={{ mb: 4 }}>
              {startDate &&
                endDate &&
                `${isAvailableBetweenSelectedDates ? 'Available' : 'Not Available'} between ${format(
                  startDate,
                  'dd MMM yyyy'
                )} and ${format(endDate, 'dd MMM yyyy')}`}
            </Alert>
            <PropertyDetailHeader
              property={property}
              title={property?.PROPERTY_TITLE || property?.PROPERTY_NUM_NAME}
              ratings={property?.STAR_RATING || 5}
              place={property?.PLACE}
            />
            <Box sx={{ mb: 4, overflow: 'hidden' }}>
              {property?.PICTURE_LINKS && (
                <SwiperControls2
                  ACTIVE={property?.SAVED}
                  PROPERTY_ID={property?.PROPERTY_ID}
                  data={JSON.parse(property?.PICTURE_LINKS || '[]')}
                />
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='h4' color='primary'>
                      {property.RENTAL_FREQUENCY_DESC} ${amountWithComma(property.RENTAL_PRICE)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>
                      {property.BEDROOMS_DESC} Bed {property.PROPERTY_TYPE_DESC} {property.LISTING_TYPE_DESC}
                    </Typography>
                    <Typography variant='h6'>{property.PROPERTY_NUM_NAME}</Typography>
                    {/* <Typography variant='subtitle1'>{property.STREET_NAME}</Typography> */}
                    {/* <Typography variant='subtitle2'>{property.PLACE}</Typography> */}
                  </Grid>
                  <Grid item xs={12} display='flex' alignItems='center' justifyContent='left' px={2}>
                    <Stack direction='row' spacing={4}>
                      <Typography
                        color='primary'
                        variant='subtitle2'
                        fontSize={16}
                        display='flex'
                        alignItems='center'
                        justifyContent='left'
                      >
                        <IconifyIcon icon='tabler:bed' style={{ fontSize: 24, marginRight: 5 }} />
                        {property.BEDROOMS_DESC}
                      </Typography>
                      <Typography
                        color='primary'
                        variant='subtitle2'
                        fontSize={16}
                        display='flex'
                        alignItems='center'
                        justifyContent='left'
                      >
                        <IconifyIcon icon='tabler:bath' style={{ fontSize: 24, marginRight: 5 }} />
                        {property.BATHROOMS_DESC}
                      </Typography>
                      <Typography
                        color='primary'
                        variant='subtitle2'
                        fontSize={16}
                        display='flex'
                        alignItems='center'
                        justifyContent='left'
                      >
                        <IconifyIcon icon='tabler:armchair' style={{ fontSize: 24, marginRight: 5 }} />
                        {property.RECEPTIONS_DESC}
                      </Typography>

                      <Typography
                        color='primary'
                        variant='subtitle2'
                        fontSize={16}
                        display='flex'
                        alignItems='center'
                        justifyContent='left'
                      >
                        <IconifyIcon icon='tabler:ruler' style={{ fontSize: 24, marginRight: 5 }} />
                        {property.SIZE} {property.UNITS_DESC}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} display='flex' alignItems='center' justifyContent='left' gap={2} my={5}>
                    <Chip
                      variant='filled'
                      color={property.ADDED_ON_DESC === 'Just Added' ? 'warning' : 'info'}
                      label={property.ADDED_ON_DESC}
                    />
                    <Typography variant='subtitle2'>Listed on {dateConvert(property.CREATEDON)}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider />
                <PropertyHighlights facilities={facilities} />
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <PropertyAbout summary={property?.FULLDESCRIPTION || property?.SUMMARY} />
              </Grid>

              {/* <Grid item xs={12} display='flex' px={2}>
                <Chip variant='outlined' color='secondary' label={property.TENURE_DESC?.toUpperCase()} />
              </Grid> */}
            </Grid>
            {/* ------------------------------- */}
            <PropertyFacilitiesCard facilities={facilities} />
            <PropertyAdministration
              letting_arrangements={property?.LETTING_ARRANGEMENTS_DESC}
              lettings_deposit_payable={property?.LETTINGS_DEPOSIT_PAYABLE_DESC}
              fee_apply={property?.FEE_APPLY_DESC}
            />
            <PropertyHouseRules rules={safeParsePropertyArray(property?.PROPERTY_RULES)} />
            <PropertyHost property={property} />
            <PropertyImportantInfo info={property?.IMPORTANT_INFO} />
            <PropertyFAQ faqs={safeParsePropertyArray(property?.PROPERTY_FAQS)} />
            <PropertyReviews />
          </Grid>

          <Grid item lg={4} xs={12}>
            <PropertyMapCard property={property} nearby={safeParsePropertyArray(property?.NEARBY_PLACES)} />
            <PropertyBookingWidget
              property={property}
              startDate={startDate}
              endDate={endDate}
              adults={adults}
              childCount={childCount}
              roomCount={roomCount}
              onSearchChange={handleSearchChange}
              selectedRooms={[]}
              onBeginBooking={handleBeginBooking}
              bookingCalendar={bookingCalendar}
              priceMap={priceMap}
              getBookingCalendar={getBookingCalendar}
              isAvailableBetweenSelectedDates={isAvailableBetweenSelectedDates}
            />
          </Grid>
        </Grid>
      ) : (
        <NoRecordCard
          title='Property not found'
          subtitle='This rental property does not exist or is no longer available.'
        />
      )}
    </Container>
  )
}

PropertyDetail.guestGuard = true

export default PropertyDetail
