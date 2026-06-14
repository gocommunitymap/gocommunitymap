import { getPropertiesAPI, getPropertiesForMapAPI } from 'src/configs'
import { listingTypes } from 'src/configs'

const DEFAULT_PROPERTY_IMAGE = '/images/logo.png'

const getDefaultCoords = () =>
  new Promise(resolve => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return resolve(null)
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    )
  })

const toNumber = value => {
  const num = Number(value)

  return Number.isFinite(num) ? num : null
}

const getPropertyImage = pictureLinks => {
  if (!pictureLinks) return DEFAULT_PROPERTY_IMAGE
  try {
    const parsed = typeof pictureLinks === 'string' ? JSON.parse(pictureLinks) : pictureLinks
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PROPERTY_IMAGE
    const firstImage = parsed[0]
    if (typeof firstImage === 'string' && firstImage.trim().length > 0) return firstImage
    if (firstImage?.LINK) return firstImage.LINK

    return DEFAULT_PROPERTY_IMAGE
  } catch {
    return DEFAULT_PROPERTY_IMAGE
  }
}

const parseJsonArray = value => {
  if (!value) return []
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const mapHotel = (row, defaultCoords) => ({
  id: row?.PROPERTY_ID,
  title: row?.PROPERTY_NUM_NAME || row?.PROPERTY_TYPE_DESC || 'Property',
  district: row?.PLACE || row?.AREA_TOWN_CITY || '',
  image: getPropertyImage(row?.PICTURE_LINKS),
  price: toNumber(row?.PRICE) ?? 0,
  rating: row?.STAR_RATING ?? 0,
  lat: toNumber(row?.LATITUDE) ?? defaultCoords?.lat ?? null,
  lng: toNumber(row?.LONGITUDE) ?? defaultCoords?.lng ?? null,
  type: 'hotel',
  typeDesc: 'Hotel',
  listingType: row?.LISTING_TYPE_ID,
  bathrooms: toNumber(row?.BATHROOMS_DESC) ?? 0,
  bedrooms: toNumber(row?.BEDROOMS_DESC) ?? 0,
  guest: toNumber(row?.MAX_GUESTS) ?? 0,
  amenities: row?.ROOM_FEATURES?.length > 0 ? JSON.parse(row.ROOM_FEATURES) : []
})

const mapRental = (row, defaultCoords) => {
  const propertyFeatureNames = parseJsonArray(row?.PROPERTY_FEATURES).map(f => f?.FEATURES)
  const customFeatureNames = parseJsonArray(row?.CUSTOM_FEATURES).map(f => f?.DESCRIPTION)
  const amenities = [...propertyFeatureNames, ...customFeatureNames].filter(Boolean)

  return {
    id: row?.PROPERTY_ID,
    title: row?.PROPERTY_NUM_NAME || row?.PROPERTY_TYPE_DESC || 'Property',
    district: row?.PLACE || row?.AREA_TOWN_CITY || '',
    image: getPropertyImage(row?.PICTURE_LINKS),
    price: toNumber(row?.RENTAL_PRICE) ?? 0,
    frequency: row?.RENTAL_FREQUENCY_DESC || '',
    rating: row?.STAR_RATING ?? 0,
    lat: toNumber(row?.LATITUDE) ?? defaultCoords?.lat ?? null,
    lng: toNumber(row?.LONGITUDE) ?? defaultCoords?.lng ?? null,
    type: 'rental',
    typeDesc: 'Rental',
    listingType: row?.LISTING_TYPE_ID,
    bathrooms: toNumber(row?.BATHROOMS_DESC) ?? 0,
    bedrooms: toNumber(row?.BEDROOMS_DESC) ?? 0,
    guest: toNumber(row?.MAX_GUESTS) ?? 0,
    amenities: row?.PROPERTY_FEATURES?.length > 0 ? JSON.parse(row.PROPERTY_FEATURES) : []
  }
}

export async function fetchCommunityProperties() {
  const [defaultCoords, data] = await Promise.all([getDefaultCoords(), getPropertiesForMapAPI()])

  const _data = data?.data || []
  const hotelsRes = _data?.filter(item => item.LISTING_TYPE_ID === listingTypes.HOTELS.LISTING_TYPE_ID)
  const rentalsRes = _data?.filter(item => item.LISTING_TYPE_ID === listingTypes.RENTAL.LISTING_TYPE_ID)

  const hotels = Array.isArray(hotelsRes) ? hotelsRes.map(row => mapHotel(row, defaultCoords)) : []
  const rentals = Array.isArray(rentalsRes) ? rentalsRes.map(row => mapRental(row, defaultCoords)) : []

  return [...hotels, ...rentals]
}
