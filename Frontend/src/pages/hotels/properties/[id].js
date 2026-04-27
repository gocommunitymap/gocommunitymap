import { Grid, Container, Tab } from '@mui/material'
import { Icon } from '@iconify/react'
import SeoHead from 'src/components/SeoHead'
import { useRouter } from 'next/router'
import { API_URL, getGlobalParametersAPI } from 'src/configs'
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

const linkList = [
  { title: 'Home', link: '/home' },
  { title: 'Hotels', link: '/hotels' },
  { title: 'Properties', link: '/hotels/properties' }
]
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

  if (!PROPERTY_ID) return { notFound: true }

  const [property, rooms] = await Promise.all([fetchPropertyById(PROPERTY_ID), fetchRoomsByPropertyId(PROPERTY_ID)])
  if (!property) return { notFound: true }

  return { props: { property, propertyId: PROPERTY_ID, rooms } }
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
  const resolvedPropertyId = property?.PROPERTY_ID || propertyId || null
  const seoTitle = property?.PROPERTY_TITLE || 'Property Hotels'
  const [activeTab, setActiveTab] = useState('1')

  // ── Shared booking state ──────────────────────────────────
  const [startDate, setStartDate] = useState(addDays(new Date(), 1))
  const [endDate, setEndDate] = useState(addDays(new Date(), 4))
  const [adults, setAdults] = useState(2)
  const [childCount, setChildCount] = useState(0)
  const [roomCount, setRoomCount] = useState(1)
  const [selectedRooms, setSelectedRooms] = useState([]) // selected rooms from table
  const [appsetParams, setAppsetParams] = useState([])

  useEffect(() => {
    getGlobalParametersAPI({ TYPE_CODE: 'APPSET' })
      .then(res => setAppsetParams(res?.data || []))
      .catch(() => {})
  }, [])

  const handleSearchChange = changes => {
    if ('startDate' in changes) setStartDate(changes.startDate)
    if ('endDate' in changes) setEndDate(changes.endDate)
    if ('adults' in changes) setAdults(changes.adults)
    if ('childCount' in changes) setChildCount(changes.childCount)
    if ('roomCount' in changes) setRoomCount(changes.roomCount)
  }

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

  const handleBeginBooking = directRoom => {
    const nights = startDate && endDate ? Math.max(1, differenceInCalendarDays(endDate, startDate)) : 1

    let subtotal
    let roomsParam

    if (directRoom) {
      const qty = selectedRooms.find(r => r.roomId === directRoom.ROOM_ID)?.quantity || 1
      subtotal = (Number(directRoom.PRICE) || 0) * nights * qty
      roomsParam = JSON.stringify([{ name: directRoom.ROOM_TYPE_DESC, price: directRoom.PRICE, qty }])
    } else if (selectedRooms.length > 0) {
      subtotal = selectedRooms.reduce((sum, s) => sum + (Number(s.room?.PRICE) || 0) * s.quantity * nights, 0)
      roomsParam = JSON.stringify(
        selectedRooms.map(s => ({
          name: s.room?.ROOM_TYPE_DESC,
          price: s.room?.PRICE,
          qty: s.quantity
        }))
      )
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
          rooms={rooms}
          startDate={startDate}
          endDate={endDate}
          adults={adults}
          childCount={childCount}
          roomCount={roomCount}
          onSearchChange={handleSearchChange}
          onRoomSelect={handleRoomSelect}
          onReserve={handleBeginBooking}
        />
      )
    },
    {
      label: 'Option and price',
      value: '2',
      content: data => (
        <OptionAndPrice
          data={data}
          rooms={rooms}
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
        description={property?.SUMMARY ? property.SUMMARY.substring(0, 155) : 'View full details of this property.'}
        ogImage={property?.PICTURE_LINK}
        ogType='article'
        canonical={`https://gocommunitymap.com/hotels/properties/${resolvedPropertyId || ''}`}
      />

      {/* Breadcrumbs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <BreadCrumbs list={linkList} title={pageTitle} />
        </Grid>
      </Grid>

      {property ? (
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
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <NoRecordCard title='Property not found' subtitle='This property does not exist or is no longer available.' />
      )}
    </Container>
  )
}
PropertyDetail.guestGuard = true

export default PropertyDetail
