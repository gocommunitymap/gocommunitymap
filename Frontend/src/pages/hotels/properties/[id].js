import { Grid, Container, Tab } from '@mui/material'
import { Icon } from '@iconify/react'
import SeoHead from 'src/components/SeoHead'
import { useRouter } from 'next/router'
import { API_URL, getGlobalParametersAPI, getGlobalParametersGuestAPI, getHotelBookingCalendarAPI } from 'src/configs'
import { serverGet, serverGetRaw } from 'src/configs/services/serverHttp'
import { NoRecordCard } from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SwiperControls2 from 'src/views/components/swiper/SwiperControls2'
import { useEffect, useMemo, useState } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import PropertyDetailHeader from 'src/views/components/PropertyDetailHeader'
import Overview from 'src/views/pages/properties/details/tabs/Overview'
import OptionAndPrice from 'src/views/pages/properties/details/tabs/OptionAndPrice'
import Facilities from 'src/views/pages/properties/details/tabs/Facilities'
import Rules from 'src/views/pages/properties/details/tabs/Rules'
import ReviewsTab from 'src/views/pages/properties/details/tabs/Reviews'
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
import { Box } from '@mui/system'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { getGlobalParametersLOV, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

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

const fetchRoomsByPropertyId = async PROPERTY_ID => {
  try {
    const data = await serverGetRaw(API_URL.GET_ROOM_DETAIL, { PROPERTY_ID, USER: 1 })
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data

    return []
  } catch {
    return []
  }
}

const fetchPropertyById = async PROPERTY_ID => {
  const params = { PROPERTY_ID, LISTING_TYPE_ID: 1, PAGE_NUMBER: 1, PAGE_SIZE: 1 }

  const rawData = await serverGetRaw(API_URL.GET_PROPERTIES_FULL_DETAILS, params)
  const rawProperty = parsePropertyPayload(rawData)
  if (rawProperty) {
    return rawProperty
  }

  const guestData = await serverGet(API_URL.GET_PROPERTIES_FULL_DETAILS, params)
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

export const getServerSideProps = async context => {
  const dynamicId = context?.params?.id
  const queryId = context?.query?.id
  const routeId = Array.isArray(dynamicId) ? dynamicId[0] : dynamicId
  const fallbackId = Array.isArray(queryId) ? queryId[0] : queryId
  const PROPERTY_ID = routeId || fallbackId

  if (!PROPERTY_ID) return { props: { property: null, propertyId: PROPERTY_ID, rooms: null } }

  const [property, rooms] = await Promise.all([fetchPropertyById(PROPERTY_ID), fetchRoomsByPropertyId(PROPERTY_ID)])
  if (!property) return { props: { property: null, propertyId: PROPERTY_ID, rooms: null } }

  const _rooms = rooms.map(room => ({
    ...room,
    isAvailable: true,
    AVAILABLE_QUANTITY: Number(room.ROOMS_QUANTITY) || 0
  }))

  return { props: { property, propertyId: PROPERTY_ID, rooms: _rooms } }
}

const faqs = []
const reviews = []
const houseRules = []

const getFirstPicture = pictureLinks => {
  try {
    const pics = JSON.parse(pictureLinks || '[]')

    return (Array.isArray(pics) && pics[0]?.LINK) || (typeof pics[0] === 'string' ? pics[0] : '') || ''
  } catch {
    return ''
  }
}

const PropertyDetail = params => {
  const { property, propertyId, rooms = [] } = params

  const router = useRouter()

  const [roomsData, setRoomsData] = useState(rooms || [])
  const { CHECK_IN = null, CHECK_OUT = null, ADULTS = 0, CHILDREN = 0, ROOMS = 0, PETS_ALLOWED = false } = router.query
  const resolvedPropertyId = property?.PROPERTY_ID || propertyId || null
  const seoTitle = property?.PROPERTY_TITLE || 'Property Hotels'
  const [activeTab, setActiveTab] = useState('1')

  // ── Shared booking state ──────────────────────────────────
  const [startDate, setStartDate] = useState(CHECK_IN ? new Date(CHECK_IN) : addDays(new Date(), 1))
  const [endDate, setEndDate] = useState(CHECK_OUT ? new Date(CHECK_OUT) : addDays(new Date(), 2))
  const [adults, setAdults] = useState(Number(ADULTS) || 1)
  const [childCount, setChildCount] = useState(Number(CHILDREN) || 0)
  const [roomCount, setRoomCount] = useState(Number(ROOMS) || 1)
  const [selectedRooms, setSelectedRooms] = useState([]) // selected rooms from table
  const [appsetParams, setAppsetParams] = useState([])
  const [bookingCalendar, setBookingCalendar] = useState([])
  const [updatedRooms, setUpdatedRooms] = useState(roomsData)

  const [priceMap, setPriceMap] = useState({
    [format(new Date(), 'yyyy-MM-dd')]: '0'
  })

  const handleSearchChange = changes => {
    if ('startDate' in changes) setStartDate(changes.startDate)
    if ('endDate' in changes) setEndDate(changes.endDate)
    if ('adults' in changes) setAdults(changes.adults)
    if ('childCount' in changes) setChildCount(changes.childCount)
    if ('roomCount' in changes) setRoomCount(changes.roomCount)
    if ('startDate' in changes || ('endDate' in changes && (startDate == null || endDate == null))) return

    const resolvedStart = 'startDate' in changes ? changes.startDate : startDate
    const resolvedEnd = 'endDate' in changes ? changes.endDate : endDate

    // Wait until both dates are set before filtering
    if (!resolvedStart || !resolvedEnd) return

    const resolvedAdults = 'adults' in changes ? changes.adults : adults
    const resolvedChildren = 'childCount' in changes ? changes.childCount : childCount
    const resolvedRooms = 'roomCount' in changes ? changes.roomCount : roomCount

    // Build a set of dates in the selected range [startDate, endDate)
    const dateRange = []
    let cursor = new Date(resolvedStart)
    while (cursor < resolvedEnd) {
      dateRange.push(format(cursor, 'yyyy-MM-dd'))
      cursor = addDays(cursor, 1)
    }

    const updatedRooms = roomsData
      .map(room => {
        let updatedInfo = { ...room, isAvailable: true }

        // 1. Check max guest capacity
        if (room.MAX_GUESTS < resolvedAdults + resolvedChildren) {
          updatedInfo.isAvailable = false
        }

        // 2. Check availability from bookingCalendar across every night in range
        if (updatedInfo.isAvailable && bookingCalendar.length > 0) {
          const hasUnavailableNight = dateRange.some(date => {
            const entry = bookingCalendar.find(
              item => item.ROOM_ID === room.ROOM_ID && format(new Date(item.DATE), 'yyyy-MM-dd') === date
            )

            // If no entry found, assume unavailable; if found, check balance vs room count
            if (!entry) return false // no calendar entry = not blocked

            return entry.BALANCE < resolvedRooms
          })
          if (hasUnavailableNight) updatedInfo.isAvailable = false
        } else if (updatedInfo.isAvailable) {
          // Fallback: use static AVAILABLE_QUANTITY if calendar not loaded yet
          if (room.AVAILABLE_QUANTITY < resolvedRooms) {
            updatedInfo.isAvailable = false
          }
        }

        return updatedInfo
      })
      .filter(r => r.isAvailable)

    // setRoomsData(updaterRooms)
    setUpdatedRooms(updatedRooms)
    setSelectedRooms(prev => prev.filter(r => updatedRooms.some(ur => ur.ROOM_ID === r.roomId)))
  }

  const getBookingCalendar = async (from, to) => {
    if (from && to) {
      await getHotelBookingCalendarAPI({
        CHECK_IN: format(from, 'yyyy-MM-dd'),
        CHECK_OUT: format(to, 'yyyy-MM-dd'),
        PROPERTY_ID: resolvedPropertyId
      })
        .then(res => {
          const respData = res?.data || []

          const newPriceMap = respData.reduce((acc, item) => {
            const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))

            const PRICE = item.PRICE * totalDays

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

  const updateAvailableRoomQuantity = () => {
    if (!bookingCalendar || bookingCalendar.length === 0) return

    const updateRooms = updatedRooms.map(room => {
      const balance =
        bookingCalendar.find(
          item =>
            item.ROOM_ID === room.ROOM_ID &&
            format(new Date(item.DATE), 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd')
        )?.BALANCE || 0
      const AVAILABLE_QUANTITY = balance

      return { ...room, AVAILABLE_QUANTITY }
    })

    setUpdatedRooms(updateRooms)
  }

  useEffect(() => {
    const from = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : null
    const to = endDate ? new Date(endDate.getFullYear(), endDate.getMonth() + 2, 0) : null

    getBookingCalendar(from, to)
  }, [startDate, endDate, resolvedPropertyId])

  useEffect(() => {
    updateAvailableRoomQuantity()
  }, [bookingCalendar])

  const handleRoomSelect = (room, quantity) => {
    if (!room) return
    const roomId = room.ROOM_ID
    setSelectedRooms(prev => {
      if (quantity === 0) return prev.filter(r => r.roomId !== roomId)
      const existing = prev.find(r => r.roomId === roomId)
      if (existing) return prev.map(r => (r.roomId === roomId ? { ...r, quantity } : r))

      return [...prev, { roomId, quantity, room }]
    })
  }

  const buildRoomDetailsEntry = (roomData, quantity = 1) => ({
    roomId: roomData?.ROOM_ID || null,
    name: roomData?.ROOM_TYPE_DESC || roomData?.SUMMARY || 'Room',
    roomType: roomData?.ROOM_TYPE_DESC || roomData?.SUMMARY || 'Room',
    summary: roomData?.SUMMARY || '',
    price: Number(roomData?.PRICE) || 0,
    qty: Number(quantity) || 1,
    maxGuests: Number(roomData?.MAX_GUESTS) || 0,
    mealPlan: roomData?.MEAL_PLAN || null,
    cancellationPolicy: roomData?.CANCELLATION_POLICY || null
  })

  const handleBeginBooking = directRoom => {
    const nights = startDate && endDate ? Math.max(1, differenceInCalendarDays(endDate, startDate)) : 1

    let subtotal
    let roomsParam

    if (directRoom) {
      const qty = selectedRooms.find(r => r.roomId === directRoom.ROOM_ID)?.quantity || 1
      subtotal = (Number(directRoom.PRICE) || 0) * nights * qty
      roomsParam = JSON.stringify([buildRoomDetailsEntry(directRoom, qty)])
    } else if (selectedRooms.length > 0) {
      subtotal = selectedRooms.reduce((sum, s) => sum + (Number(s.room?.PRICE) || 0) * s.quantity * nights, 0)
      roomsParam = JSON.stringify(selectedRooms.map(s => buildRoomDetailsEntry(s.room, s.quantity)))
    } else {
      subtotal = (Number(property?.PRICE) || 0) * nights
      roomsParam = '[]'
    }

    const feeLines = appsetParams.map(p => Math.round(subtotal * ((parseFloat(p.PARAMETER_DESCRIPTION_4) || 0) / 100)))
    const serviceFee = feeLines.reduce((sum, a) => sum + a, 0)
    const total = subtotal + serviceFee

    const pricePerNight = directRoom
      ? Number(directRoom.PRICE) || 0
      : selectedRooms.length > 0
      ? Number(selectedRooms[0].room?.PRICE) || 0
      : Number(property?.PRICE) || 0

    const urlParams = new URLSearchParams({
      propertyId: property?.PROPERTY_ID || '',
      propertyName: property?.PROPERTY_TITLE || property?.PROPERTY_NUM_NAME || '',
      propertyImage: getFirstPicture(property?.PICTURE_LINKS),
      place: property?.PLACE || '',
      checkInTime: property?.CHECK_IN_TIMESLOT_DESC || '',
      checkOutTime: property?.CHECK_OUT_TIMESLOT_DESC || '',
      pricePerNight: String(pricePerNight),
      checkIn: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      checkOut: endDate ? format(endDate, 'yyyy-MM-dd') : '',
      nights: String(nights),
      adults: String(adults),
      children: String(childCount),
      rooms: String(roomCount),
      subtotal: String(subtotal),
      serviceFee: String(serviceFee),
      total: String(total),
      selectedRooms: roomsParam
    })
    router.push(`/hotels/booking/details?${urlParams.toString()}`)
  }

  const sharedSearchParams = {
    checkIn: startDate ? format(startDate, 'yyyy-MM-dd') : '',
    checkOut: endDate ? format(endDate, 'yyyy-MM-dd') : '',
    adults,
    children: childCount,
    rooms: roomCount
  }

  const tabList = [
    {
      label: 'Overview',
      value: '1',
      content: data => (
        <Overview
          data={data}
          rooms={updatedRooms}
          startDate={startDate}
          endDate={endDate}
          adults={adults}
          childCount={childCount}
          roomCount={roomCount}
          onSearchChange={handleSearchChange}
          onRoomSelect={handleRoomSelect}
          onReserve={handleBeginBooking}
          priceMap={priceMap}
          setPriceMap={setPriceMap}
          updatedRooms={updatedRooms}
          setUpdatedRooms={setUpdatedRooms}
          bookingCalendar={bookingCalendar}
          setBookingCalendar={setBookingCalendar}
          getBookingCalendar={getBookingCalendar}
        />
      )
    },
    {
      label: 'Option and price',
      value: '2',
      content: data => (
        <OptionAndPrice
          data={data}
          rooms={updatedRooms}
          searchParams={sharedSearchParams}
          onRoomSelect={handleRoomSelect}
          onReserve={handleBeginBooking}
        />
      )
    },
    { label: 'Facilities', value: '3', content: data => <Facilities data={data} /> },
    { label: 'Rules', value: '4', content: data => <Rules data={data} /> },
    { label: 'Reviews', value: '5', content: data => <ReviewsTab data={data} /> }
  ]

  const facilities = useMemo(() => {
    const featureItems = safeParsePropertyArray(property?.PROPERTY_FEATURES)
      .map(item => ({ title: item?.FEATURES, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(Boolean)

    const utilityItems = safeParsePropertyArray(property?.PROPERTY_UTILITIES)
      .map(item => ({ title: item?.UTILITIES, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(Boolean)

    const uapItems = safeParsePropertyArray(property?.PROPERTY_UAP)
      .filter(item => {
        const value = `${item?.SELECT_VALUE || ''}`.trim().toLowerCase()

        return value && value !== '0' && value !== 'n' && value !== 'false'
      })
      .map(item => ({ title: item?.DESCRIPTION, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(Boolean)

    const customFeatureItems = safeParsePropertyArray(property?.CUSTOM_FEATURES)
      .map(item => ({ title: item?.DESCRIPTION, icon: item?.ICON, highlighted: item?.IS_HIGHLIGHTED }))
      .filter(Boolean)

    return [...featureItems, ...utilityItems, ...uapItems, ...customFeatureItems]
  }, [property])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Container maxWidth='lg'>
      <SeoHead
        title={seoTitle}
        description={property?.SUMMARY ? property?.SUMMARY.substring(0, 155) : 'View full details of this property.'}
        ogImage={property?.PICTURE_LINK}
        ogType='article'
        canonical={`https://gocommunitymap.com/hotels/properties/${resolvedPropertyId || ''}`}
      />

      {/* Breadcrumbs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <BreadCrumbs list={linkList} title={property?.PROPERTY_NUM_NAME || ''} />
        </Grid>
      </Grid>

      {property && property !== null && property !== undefined ? (
        <>
          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Left Column - Main Content */}
            <Grid item lg={8} xs={12}>
              {/* Header with Title and Rating */}
              <PropertyDetailHeader
                property={property}
                title={property?.PROPERTY_TITLE || property?.PROPERTY_NUM_NAME}
                ratings={property?.STAR_RATING || 5}
                place={property?.PLACE}
              />

              {/* Image Gallery */}
              <Box sx={{ mb: 4, overflow: 'hidden' }}>
                {property?.PICTURE_LINKS && (
                  <SwiperControls2
                    ACTIVE={property?.SAVED}
                    PROPERTY_ID={property?.PROPERTY_ID}
                    data={JSON.parse(property?.PICTURE_LINKS || '[]')}
                  />
                )}
              </Box>

              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={activeTab}>
                  <Box sx={{ borderBottom: 1, borderColor: '#eee' }}>
                    <TabList aria-label='property tabs' onChange={handleTabChange}>
                      {tabList.map(item => (
                        <Tab key={item.value} label={item.label} value={item.value} />
                      ))}
                    </TabList>
                  </Box>
                  {tabList.map(item => (
                    <TabPanel key={item.value} value={item.value}>
                      {item.content(property)}
                    </TabPanel>
                  ))}
                </TabContext>
              </Box>

              <PropertyHighlights facilities={facilities} />
              <PropertyAbout summary={property?.FULLDESCRIPTION || property?.SUMMARY} />
              <PropertyFacilitiesCard facilities={facilities} />
              <PropertyHouseRules rules={safeParsePropertyArray(property?.PROPERTY_RULES)} />
              <PropertyHost property={property} />
              <PropertyImportantInfo info={property?.IMPORTANT_INFO} />
              <PropertyFAQ faqs={safeParsePropertyArray(property?.PROPERTY_FAQS)} />
              <PropertyReviews />
            </Grid>

            {/* Right Column */}
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
                selectedRooms={selectedRooms}
                onBeginBooking={handleBeginBooking}
                bookingCalendar={bookingCalendar}
                priceMap={priceMap}
                getBookingCalendar={getBookingCalendar}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <NoRecordCard title='Hotel not found' subtitle='This hotel does not exist or is no longer available.' />
      )}
    </Container>
  )
}
PropertyDetail.guestGuard = true

export default PropertyDetail
