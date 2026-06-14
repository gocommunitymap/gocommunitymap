import { Box, Button, Container, debounce, Grid } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SeoHead from 'src/components/SeoHead'
import { useAuth } from 'src/hooks/useAuth'
import { getHotels, getRentals } from 'src/store'
import { API_URL, listingTypes } from 'src/configs'
import { serverGet } from 'src/configs/services/serverHttp'
import {
  LandingFilterSidebar,
  LandingHeroSearch,
  LandingPropertySections,
  LandingMapView
} from 'src/views/pages/home/landing'
import {
  hotelFilterConfig,
  rentalFilterConfig,
  hotelPropertySections,
  rentalPropertySections,
  landingSearchFields,
  landingTabs
} from 'src/@core/utils'
import themeConfig from 'src/configs/themeConfig'
import IconifyIcon from 'src/@core/components/icon'

const DEFAULT_PROPERTY_IMAGE = '/images/logo.png'
const DEFAULT_LAT = 51.5072
const DEFAULT_LNG = -0.1276
const DEFAULT_PAGE_SIZE = 20

// ── Helpers ──────────────────────────────────────────────────────────────────

const toNumber = value => {
  const num = Number(value)

  return Number.isFinite(num) ? num : null
}

const toIntFromText = value => {
  if (value === null || value === undefined) return null
  const matched = String(value).match(/\d+/)

  return matched ? Number(matched[0]) : null
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

const mapHotelsProperty = row => {
  const propertyId = row?.PROPERTY_ID

  return {
    id: row?.PROPERTY_ID,
    propertyId,
    listingType: row?.LISTING_TYPE_ID,
    isSaved: Boolean(row?.SAVED),
    detailPath: propertyId ? `/hotels/properties/${propertyId}` : null,
    title: row?.PROPERTY_NUM_NAME || row?.PROPERTY_TYPE_DESC || 'Property',
    district: row?.PLACE || row?.AREA_TOWN_CITY || '',
    image: getPropertyImage(row?.PICTURE_LINKS),
    beds: 0,
    baths: 0,
    guests: 0, // Assuming at least 1 guest if there's a bedroom
    rating: row?.STAR_RATING ?? 0,
    price: toNumber(row?.PRICE) ?? 0,
    lat: toNumber(row?.LATITUDE) ?? DEFAULT_LAT,
    lng: toNumber(row?.LONGITUDE) ?? DEFAULT_LNG,
    totalProperties: toNumber(row?.TOTAL_PROPERTIES) ?? 0,
    facilities: [],
    amenities: [],
    dataLength: row.DATA_LENGTH
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

const normalizeFilterToken = value => {
  if (value === null || value === undefined) return ''

  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const buildTokenSet = values => {
  const tokenSet = new Set()

  values.forEach(value => {
    if (value === null || value === undefined || value === '') return

    const raw = String(value)
    tokenSet.add(raw)

    const normalized = normalizeFilterToken(raw)
    if (normalized) tokenSet.add(normalized)
  })

  return tokenSet
}

const mapRentalsProperty = row => {
  const propertyId = row?.PROPERTY_ID
  const propertyFeatureNames = parseJsonArray(row?.PROPERTY_FEATURES).map(feature => feature?.FEATURES)
  const customFeatureNames = parseJsonArray(row?.CUSTOM_FEATURES).map(feature => feature?.DESCRIPTION)
  const amenityNames = [...propertyFeatureNames, ...customFeatureNames].filter(Boolean)

  const petsAllowed = [row?.PETS_ALLOWED, row?.ALLOW_PETS, row?.PETS].some(value => {
    const normalized = String(value || '').toLowerCase()

    return value === true || value === 1 || normalized === 'true' || normalized === 'yes'
  })

  const bedrooms = toNumber(row?.BEDROOMS_ID) ?? toIntFromText(row?.BEDROOMS_DESC) ?? 0
  const bathrooms = toNumber(row?.BATHROOMS_ID) ?? toIntFromText(row?.BATHROOMS_DESC) ?? 0

  const propertyTypeValues = [row?.PROPERTY_TYPE_ID, row?.PROPERTY_TYPE_CODE, row?.PROPERTY_TYPE_DESC].filter(Boolean)

  const rentalTypeValues = [
    row?.RENTAL_FREQUENCY_ID,
    row?.RENTAL_FREQUENCY_CODE,
    row?.RENTAL_FREQUENCY_DESC,
    row?.SHORT_LET ? 'short-let' : 'long-let',
    row?.RENTAL_TYPE
  ].filter(Boolean)

  const amenities = [...amenityNames]
  if (petsAllowed) amenities.push('pets-allowed')

  return {
    id: row.PROPERTY_ID,
    propertyId,
    listingType: row?.LISTING_TYPE_ID,
    isSaved: Boolean(row?.SAVED),
    detailPath: propertyId ? `/rentals/properties/${propertyId}` : null,
    title: row?.PROPERTY_NUM_NAME || row?.PROPERTY_TYPE_DESC || 'Property',
    district: row?.PLACE || row?.AREA_TOWN_CITY || '',
    image: getPropertyImage(row?.PICTURE_LINKS),
    beds: bedrooms,
    baths: bathrooms,
    rentalFrequency: row?.RENTAL_FREQUENCY_DESC,
    rentalPrice: toNumber(row?.RENTAL_PRICE) ?? 0,
    rentalFrequencyDays: toNumber(row?.RENTAL_FREQUENCY_DAYS) ?? 1,
    guests: toNumber(row?.MAX_GUESTS) ?? Math.max(0, bedrooms + 1),
    rating: row?.STAR_RATING ?? 0,
    price: toNumber(row?.PRICE) ?? 0,
    lat: toNumber(row?.LATITUDE) ?? DEFAULT_LAT,
    lng: toNumber(row?.LONGITUDE) ?? DEFAULT_LNG,
    totalProperties: toNumber(row?.TOTAL_PROPERTIES) ?? 0,
    rentalType: row.SHORT_LET ? 'short-let' : 'long-let',
    propertyType: propertyTypeValues,
    size: toNumber(row?.SIZE) ?? toNumber(row?.SQFT) ?? toIntFromText(row?.SIZE) ?? 0,
    amenities,
    dataLength: row.DATA_LENGTH
  }
}

// Parses a "min:max" metadata string into { min, max } numeric bounds.
// Either bound may be null (no limit). Examples: "0:100" → {min:0,max:100}, "300:" → {min:300,max:null}
const parseMeta = meta => {
  if (!meta) return { min: null, max: null }
  const parts = String(meta).split(':')

  return {
    min: parts[0] !== '' ? Number(parts[0]) : null,
    max: parts[1] !== undefined && parts[1] !== '' ? Number(parts[1]) : null
  }
}

// Build filter config by replacing hardcoded options with GlobalParams API data.
// Only replaces options for radio/checkbox groups that have a typeCode.
// Falls back to the hardcoded options when the API returns nothing.
const buildDynamicFilterConfig = (staticConfig, filterGroupApiData) => {
  return staticConfig.map(group => {
    // if (!group.typeCode || (group.type !== 'radio' && group.type !== 'checkbox')) return group

    if (group.type === 'range') {
      const apiGroupData = filterGroupApiData?.[group.typeCode]
      if (!Array.isArray(apiGroupData) || apiGroupData.length === 0) return group
      const activeRows = apiGroupData.filter(row => row.ACTIVE !== false)
      if (activeRows.length === 0) return group

      const _activeRows = activeRows.sort(
        (a, b) =>
          toNumber(parseMeta(a.PARAMETER_DESCRIPTION_3)?.min) - toNumber(parseMeta(b.PARAMETER_DESCRIPTION_3)?.min)
      )

      const min = toNumber(_activeRows[0]?.PARAMETER_DESCRIPTION_3) || 0
      const max = toNumber(_activeRows[1]?.PARAMETER_DESCRIPTION_3) || 0

      return { ...group, min, max }
    }

    const apiRows = filterGroupApiData?.[group.typeCode]
    if (!Array.isArray(apiRows) || apiRows.length === 0) return group

    const apiOptions = apiRows
      .filter(row => row.ACTIVE !== false)
      .map(row => ({
        id: row.PARAMETER_CODE_3,
        label: row.PARAMETER_DESCRIPTION_3,
        meta: row.PARAMETER_DESCRIPTION_4 ?? null
      }))

    return apiOptions.length > 0 ? { ...group, options: apiOptions } : group
  })
}

// ── SSR ───────────────────────────────────────────────────────────────────────

export const getServerSideProps = async () => {
  const [
    hotelsData,
    rentalsData,
    ftrBudget,
    ftrRevscr,
    ftrRmfac,
    ftrFunthng,
    ftrRntdur,
    ftrPrptype,
    ftrBdrm,
    ftrPrpsize,
    ftrPrcrng,
    ftrAmnt
  ] = await Promise.all([
    serverGet(API_URL.GET_PROPERTIES, {
      LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID,
      PAGE_SIZE: DEFAULT_PAGE_SIZE,
      PAGE_NUMBER: 1
    }),
    serverGet(API_URL.GET_PROPERTIES, {
      LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID,
      PAGE_SIZE: DEFAULT_PAGE_SIZE,
      PAGE_NUMBER: 1
    }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_BUDGET', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_REVSCR', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_RMFAC', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_FUNTHNG', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_RNTDUR', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'PROPTYPE', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_BDRM', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_PRPSIZE', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_PRCRNG', ALLOWED: true }),
    serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_AMNT', ALLOWED: true })
  ])

  return {
    props: {
      initialHotelsData: Array.isArray(hotelsData) ? hotelsData : [],
      initialRentalsData: Array.isArray(rentalsData) ? rentalsData : [],
      filterGroupApiData: {
        FTR_BUDGET: Array.isArray(ftrBudget) ? ftrBudget : [],
        FTR_REVSCR: Array.isArray(ftrRevscr) ? ftrRevscr : [],
        FTR_RMFAC: Array.isArray(ftrRmfac) ? ftrRmfac : [],
        FTR_FUNTHNG: Array.isArray(ftrFunthng) ? ftrFunthng : [],
        FTR_RNTDUR: Array.isArray(ftrRntdur) ? ftrRntdur : [],
        PROPTYPE: Array.isArray(ftrPrptype) ? ftrPrptype : [],
        FTR_BDRM: Array.isArray(ftrBdrm) ? ftrBdrm : [],
        FTR_PRPSIZE: Array.isArray(ftrPrpsize) ? ftrPrpsize : [],
        FTR_PRCRNG: Array.isArray(ftrPrcrng) ? ftrPrcrng : [],
        FTR_AMNT: Array.isArray(ftrAmnt) ? ftrAmnt : []
      }
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const Home = ({ initialHotelsData = [], initialRentalsData = [], filterGroupApiData = {} }) => {
  const dispatch = useDispatch()
  const { user } = useAuth()

  // Track whether SSR initial data has been consumed
  const ssrDataConsumed = useRef(false)
  const rentalsSsrDataConsumed = useRef(false)
  const [activeTab, setActiveTab] = useState('hotels') // 'hotels' or 'rentals'
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [hotelsCards, setHotelsCards] = useState([])
  const [hotelsPageNumber, setHotelsPageNumber] = useState(1)
  const [hasMoreHotels, setHasMoreHotels] = useState(true)
  const [isHotelsLoading, setIsHotelsLoading] = useState(true)
  const [isHotelsFetchingMore, setIsHotelsFetchingMore] = useState(false)
  const [hotelsSearchParams, setHotelsSearchParams] = useState({})
  const [rentalsCards, setRentalsCards] = useState([])
  const [rentalsPageNumber, setRentalsPageNumber] = useState(1)
  const [hasMoreRentals, setHasMoreRentals] = useState(true)
  const [isRentalsLoading, setIsRentalsLoading] = useState(true)
  const [isRentalsFetchingMore, setIsRentalsFetchingMore] = useState(false)
  const [rentalsSearchParams, setRentalsSearchParams] = useState({})
  const [filterParams, setFilterParams] = useState({})

  const mergeUniqueCards = (prevCards, nextCards) => {
    const seen = new Set(prevCards.map(card => card.id))
    const uniqueNextCards = nextCards.filter(card => !seen.has(card.id) && seen.add(card.id))

    return [...prevCards, ...uniqueNextCards]
  }

  useEffect(() => {
    setHotelsCards([])
    setHotelsPageNumber(1)
    setHasMoreHotels(true)
    setIsHotelsLoading(true)
    setIsHotelsFetchingMore(false)
    setHotelsSearchParams({})
    setRentalsCards([])
    setRentalsPageNumber(1)
    setHasMoreRentals(true)
    setIsRentalsLoading(true)
    setIsRentalsFetchingMore(false)
    setRentalsSearchParams({})
    ssrDataConsumed.current = false
    rentalsSsrDataConsumed.current = false
  }, [user?.usercode])

  useEffect(() => {
    if (activeTab !== 'hotels') {
      setIsHotelsLoading(false)
      setIsHotelsFetchingMore(false)

      return
    }

    let isMounted = true
    const isFirstPage = hotelsPageNumber === 1
    const isDefaultParams = Object.keys(hotelsSearchParams).length === 0

    // Use SSR data for the initial page-1 / no-search load to avoid a double-fetch
    if (isFirstPage && isDefaultParams && !ssrDataConsumed.current && initialHotelsData.length > 0) {
      ssrDataConsumed.current = true
      const mappedCards = initialHotelsData.map(mapHotelsProperty)
      setHotelsCards(mappedCards)
      setHasMoreHotels(mappedCards.length === DEFAULT_PAGE_SIZE)
      setIsHotelsLoading(false)

      return
    }

    if (isFirstPage) {
      setIsHotelsLoading(true)
    } else {
      setIsHotelsFetchingMore(true)
    }

    dispatch(
      getHotels({
        user: user?.usercode || 0,
        PAGE_SIZE: DEFAULT_PAGE_SIZE,
        PAGE_NUMBER: hotelsPageNumber,
        FILTERS: JSON.stringify(filterParams),
        ...hotelsSearchParams
      })
    )
      .then(response => {
        if (!isMounted) return
        const payload = Array.isArray(response?.payload) ? response.payload : []
        const mappedCards = payload.map(mapHotelsProperty)

        setHotelsCards(prevCards => (isFirstPage ? mappedCards : mergeUniqueCards(prevCards, mappedCards)))
        setHasMoreHotels(payload.length === DEFAULT_PAGE_SIZE)
        setIsHotelsLoading(false)
        setIsHotelsFetchingMore(false)
      })
      .catch(() => {
        if (!isMounted) return
        setIsHotelsLoading(false)
        setIsHotelsFetchingMore(false)
        if (isFirstPage) {
          setHotelsCards([])
        }
        setHasMoreHotels(false)
      })

    return () => {
      isMounted = false
    }
  }, [activeTab, dispatch, hotelsPageNumber, user?.usercode, hotelsSearchParams, initialHotelsData, filterParams])

  useEffect(() => {
    if (activeTab !== 'rentals') {
      setIsRentalsLoading(false)
      setIsRentalsFetchingMore(false)

      return
    }

    let isMounted = true
    const isFirstPage = rentalsPageNumber === 1
    const isDefaultParams = Object.keys(rentalsSearchParams).length === 0
    let seededWithSsrData = false

    // Seed the UI with SSR data on first load, but still refresh from API when rentals tab is opened.
    if (isFirstPage && isDefaultParams && !rentalsSsrDataConsumed.current && initialRentalsData.length > 0) {
      rentalsSsrDataConsumed.current = true
      const mappedCards = initialRentalsData.map(mapRentalsProperty)
      setRentalsCards(mappedCards)
      setHasMoreRentals(mappedCards.length === DEFAULT_PAGE_SIZE)
      setIsRentalsLoading(false)
      seededWithSsrData = true
    }

    if (isFirstPage && !seededWithSsrData) {
      setIsRentalsLoading(true)
    } else {
      setIsRentalsFetchingMore(true)
    }

    dispatch(
      getRentals({
        user: user?.usercode || 0,
        PAGE_SIZE: DEFAULT_PAGE_SIZE,
        PAGE_NUMBER: rentalsPageNumber,
        FILTERS: JSON.stringify(filterParams),
        ...rentalsSearchParams
      })
    )
      .then(response => {
        if (!isMounted) return

        const payload = Array.isArray(response?.payload) ? response.payload : []
        const mappedCards = payload.map(mapRentalsProperty)

        setRentalsCards(prevCards => (isFirstPage ? mappedCards : mergeUniqueCards(prevCards, mappedCards)))
        setHasMoreRentals(payload.length === DEFAULT_PAGE_SIZE)
        setIsRentalsLoading(false)
        setIsRentalsFetchingMore(false)
      })
      .catch(() => {
        if (!isMounted) return
        setIsRentalsLoading(false)
        setIsRentalsFetchingMore(false)
        if (isFirstPage && !seededWithSsrData) {
          setRentalsCards([])
        }
        if (!seededWithSsrData) {
          setHasMoreRentals(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activeTab, dispatch, rentalsPageNumber, user?.usercode, rentalsSearchParams, initialRentalsData, filterParams])

  const handleHeroSearch = useCallback(
    params => {
      if (activeTab === 'rentals') {
        setRentalsSearchParams({
          COUNTRY: params.toCountry || '',
          CITY: params.toCity || '',
          FROM_COUNTRY: params.fromCountryCode || '',
          FROM_CITY: params.fromCity || '',
          CHECK_IN: params.checkIn || '',
          CHECK_OUT: params.checkOut || '',
          GUESTS: params.guests || 0,
          ADULTS: params.adults || 1,
          CHILDREN: params.children || 0,
          ROOMS: params.rooms || 1,
          PETS_ALLOWED: params.pets || false
        })
        setRentalsCards([])
        setRentalsPageNumber(1)
        setHasMoreRentals(true)

        return
      }
      setHotelsSearchParams({
        COUNTRY: params.toCountry || '',
        CITY: params.toCity || '',
        FROM_COUNTRY: params.fromCountryCode || '',
        FROM_CITY: params.fromCity || '',
        CHECK_IN: params.checkIn || '',
        CHECK_OUT: params.checkOut || '',
        GUESTS: params.guests || 0,
        ADULTS: params.adults || 1,
        CHILDREN: params.children || 0,
        ROOMS: params.rooms || 1,
        PETS_ALLOWED: params.pets || false
      })
      setHotelsCards([])
      setHotelsPageNumber(1)
      setHasMoreHotels(true)
    },
    [activeTab]
  )

  const handleLoadMoreHotels = useCallback(() => {
    if (isHotelsLoading || isHotelsFetchingMore || !hasMoreHotels) return
    setHotelsPageNumber(prevPage => prevPage + 1)
  }, [hasMoreHotels, isHotelsFetchingMore, isHotelsLoading])

  const handleLoadMoreRentals = useCallback(() => {
    if (isRentalsLoading || isRentalsFetchingMore || !hasMoreRentals) return
    setRentalsPageNumber(prevPage => prevPage + 1)
  }, [hasMoreRentals, isRentalsFetchingMore, isRentalsLoading])

  const hotelSections = useMemo(
    () => [
      {
        id: 'hotels-live',
        title: hotelPropertySections?.[0]?.title || 'Featured Properties',
        subtitle: hotelPropertySections?.[0]?.subtitle || `Latest listings from ${themeConfig.templateName}`,
        cards: hotelsCards
      }
    ],
    [hotelsCards]
  )

  const rentalSections = useMemo(
    () => [
      {
        id: 'rentals-live',
        title: rentalPropertySections?.[0]?.title || 'Featured Rentals',
        subtitle: rentalPropertySections?.[0]?.subtitle || `Latest rental listings from ${themeConfig.templateName}`,
        cards: rentalsCards
      }
    ],
    [rentalsCards]
  )

  // Get active config based on selected tab, merged with any GlobalParams API options
  const activeFilterConfig = useMemo(
    () => buildDynamicFilterConfig(activeTab === 'hotels' ? hotelFilterConfig : rentalFilterConfig, filterGroupApiData),
    [activeTab, filterGroupApiData]
  )

  const initialFilterState = useMemo(() => {
    return activeFilterConfig.reduce((acc, group) => {
      if (group.type === 'checkbox') {
        acc[group.id] = group.options?.reduce((map, option) => {
          map[option.id] = Boolean(option.defaultChecked)

          return map
        }, {})
      }

      if (group.type === 'range') {
        acc[group.id] = [group.min, group.max]
      }

      if (group.type === 'switch') {
        acc[group.id] = Boolean(group.defaultChecked)
      }

      return acc
    }, {})
  }, [activeFilterConfig])

  const [filterState, setFilterState] = useState(initialFilterState)

  // Create debounced function once with useMemo
  const debouncedSetFilterParams = useMemo(() => debounce(setFilterParams, 1000), [])

  // Reset filter state when tab changes
  useEffect(() => {
    setFilterState(initialFilterState)
  }, [initialFilterState])

  useEffect(() => {
    const result = {}

    Object.keys(filterState).forEach(key => {
      const _key = key.replace('-', '_').toUpperCase()
      const value = filterState[key]
      if (key === 'rooms') {
        Object.keys(value).forEach(roomKey => {
          result[roomKey.toUpperCase()] = value[roomKey]
        })

        return
      }

      // check if object
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const selected = Object.keys(value)
          .filter(item => value[item] === true)
          .join(',')

        result[_key] = selected
      } else if (Array.isArray(value)) {
        result[_key] = value.join(',')
      } else {
        result[_key] = value
      }
    })
    debouncedSetFilterParams(result)
  }, [filterState, debouncedSetFilterParams])

  const isHotelsTab = activeTab === 'hotels'

  const activePropertySections = useMemo(
    () => (isHotelsTab ? hotelSections : rentalSections),
    [isHotelsTab, hotelSections, rentalSections]
  )

  const filteredSections = useMemo(
    () =>
      activePropertySections.map(section => ({
        ...section,
        cards: section.cards //filterProperties(section.cards, filterState, activeFilterConfig)
      })),
    [activePropertySections, filterState, activeFilterConfig]
  )

  const filteredProperties = useMemo(() => filteredSections.flatMap(s => s.cards), [filteredSections])

  const sectionsIsLoading = isHotelsTab ? isHotelsLoading : isRentalsLoading
  const sectionsHasMore = isHotelsTab ? hasMoreHotels : hasMoreRentals
  const sectionsIsFetchingMore = isHotelsTab ? isHotelsFetchingMore : isRentalsFetchingMore
  const sectionsLoadMore = isHotelsTab ? handleLoadMoreHotels : handleLoadMoreRentals

  return (
    <>
      <SeoHead
        title='Find Your Community'
        description="Experience the world's most sophisticated community mapping tool. Search properties hotels, rental, new homes and house prices across the UK."
        canonical='https://gocommunitymaptymap.com/home'
      />
      <Box sx={{ minHeight: '100vh', pt: { xs: 10, md: 0 } }}>
        <LandingHeroSearch
          tabs={landingTabs}
          fields={landingSearchFields}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSearch={handleHeroSearch}
          setHotelsSearchParams={setHotelsSearchParams}
        />

        <Container maxWidth='xl' sx={{ py: { xs: 3, md: 6 } }}>
          <Box mt={10}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={4}>
                <Box

                // sx={{
                //   position: 'sticky',
                //   overflowY: { xs: 'inherit', md: 'scroll' },
                //   maxHeight: { xs: 'fit-content', md: '70vh' },
                //   bottom: { xs: 0, md: 200 },
                //   top: { xs: 0, md: 200 }
                // }}
                >
                  <LandingFilterSidebar
                    filterConfig={activeFilterConfig}
                    filterState={filterState}
                    setFilterState={setFilterState}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </Box>
                {`${
                  filterParams &&
                  Object.keys(filterParams)
                    .map(key => filterParams[key]?.toString())
                    .filter(Boolean)
                    .join(', ')
                }`.length > 0 && (
                  <Button
                    fullWidth
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      setFilterParams({})
                      setFilterState(initialFilterState)
                    }}
                  >
                    Clear <IconifyIcon icon='mdi:filter-remove' width={15} />
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                {viewMode === 'list' ? (
                  <LandingPropertySections
                    sections={filteredSections}
                    isLoading={sectionsIsLoading}
                    hasMore={sectionsHasMore}
                    isFetchingMore={sectionsIsFetchingMore}
                    onLoadMore={sectionsLoadMore}
                    hotelsSearchParams={hotelsSearchParams}
                  />
                ) : (
                  <LandingMapView properties={filteredProperties} />
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  )
}

Home.guestGuard = true

export default Home
