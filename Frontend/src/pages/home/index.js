import { Box, Container, Grid } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SeoHead from 'src/components/SeoHead'
import { useAuth } from 'src/hooks/useAuth'
import { getHotels } from 'src/store'
import { API_URL } from 'src/configs'
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
    id: `hotels-${row?.PROPERTY_ID}`,
    propertyId,
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
    amenities: []
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

// Filters an array of property cards by the current filter state.
// filterConfig is the active filter configuration array (from buildDynamicFilterConfig).
// Radio/checkbox groups use option.meta ("min:max") for numeric ranges so filters work
// with any option IDs set by the admin in the filter-config setup page.
const filterProperties = (cards, filterState, filterConfig = []) => {
  const getOption = (groupId, optionId) => {
    const group = filterConfig.find(g => g.id === groupId)

    return group?.options?.find(o => o.id === optionId) ?? null
  }

  return cards.filter(card => {
    const isRental = card.rentalType !== undefined

    if (!isRental) {
      // Counter: bedrooms / bathrooms
      const bedroomCount = filterState?.rooms?.bedrooms || 0
      if (bedroomCount > 0 && card.beds < bedroomCount) return false
      const bathroomCount = filterState?.rooms?.bathrooms || 0
      if (bathroomCount > 0 && card.baths < bathroomCount) return false

      // Radio: budget — option.meta stores "minPrice:maxPrice" (e.g. "0:100", "300:")
      const selectedBudgetId = filterState?.budget
      if (selectedBudgetId) {
        const budgetOpt = getOption('budget', selectedBudgetId)
        if (budgetOpt?.meta) {
          const { min, max } = parseMeta(budgetOpt.meta)
          if (min !== null && card.price < min) return false
          if (max !== null && card.price > max) return false
        }
      }

      // Radio: review-score — option.meta stores "minRating:" (e.g. "4.5:")
      const selectedScoreId = filterState?.['review-score']
      if (selectedScoreId) {
        const scoreOpt = getOption('review-score', selectedScoreId)
        if (scoreOpt?.meta) {
          const { min } = parseMeta(scoreOpt.meta)
          if (min !== null && card.rating < min) return false
        }
      }

      // Checkbox: room-facilities — option IDs must all appear in card.facilities
      const selectedFacilities = filterState?.['room-facilities'] || {}
      const requiredFacilities = Object.keys(selectedFacilities).filter(k => selectedFacilities[k])
      if (requiredFacilities.length > 0 && !requiredFacilities.every(f => card.facilities?.includes(f))) return false

      // Checkbox: fun-things — option IDs must all appear in card.amenities
      const selectedAmenities = filterState?.['fun-things'] || {}
      const requiredAmenities = Object.keys(selectedAmenities).filter(k => selectedAmenities[k])
      if (requiredAmenities.length > 0 && !requiredAmenities.every(a => card.amenities?.includes(a))) return false
    }

    if (isRental) {
      // Checkbox: rental-duration — option ID matches card.rentalType (or 'both')
      const selectedDurations = filterState?.['rental-duration'] || {}
      const requiredDurations = Object.keys(selectedDurations).filter(k => selectedDurations[k])
      if (requiredDurations.length > 0) {
        const match = requiredDurations.some(d => card.rentalType === d || card.rentalType === 'both')
        if (!match) return false
      }

      // Range: price-range slider
      const priceRange = filterState?.['price-range']
      if (priceRange?.length === 2) {
        if (card.price < priceRange[0] || card.price > priceRange[1]) return false
      }

      // Checkbox: property-type — option ID must equal card.propertyType
      const selectedPropertyTypes = filterState?.['property-type'] || {}
      const requiredPropertyTypes = Object.keys(selectedPropertyTypes).filter(k => selectedPropertyTypes[k])
      if (requiredPropertyTypes.length > 0 && !requiredPropertyTypes.includes(card.propertyType)) return false

      // Checkbox: bedrooms — option.meta stores bed range "min:max" (e.g. "1:1", "4:")
      // Falls back to parsing leading digit from option ID (e.g. "1-bed" → beds===1)
      const selectedBedrooms = filterState?.bedrooms || {}
      const requiredBedroomIds = Object.keys(selectedBedrooms).filter(k => selectedBedrooms[k])
      if (requiredBedroomIds.length > 0) {
        const bedroomMatch = requiredBedroomIds.some(key => {
          const opt = getOption('bedrooms', key)
          if (opt?.meta) {
            const { min, max } = parseMeta(opt.meta)
            if (min !== null && max !== null) return card.beds >= min && card.beds <= max
            if (min !== null) return card.beds >= min
          }

          // Fallback: parse leading digit from option ID
          const numMatch = String(key).match(/^(\d+)/)
          if (numMatch) {
            const n = Number(numMatch[1])

            return String(key).includes('+') ? card.beds >= n : card.beds === n
          }

          return false
        })
        if (!bedroomMatch) return false
      }

      // Range: property-size slider
      const sizeRange = filterState?.['property-size']
      if (sizeRange?.length === 2 && card.size) {
        if (card.size < sizeRange[0] || card.size > sizeRange[1]) return false
      }

      // Checkbox: amenities — option IDs must all appear in card.amenities
      const selectedRentalAmenities = filterState?.amenities || {}
      const requiredRentalAmenities = Object.keys(selectedRentalAmenities).filter(k => selectedRentalAmenities[k])
      if (requiredRentalAmenities.length > 0 && !requiredRentalAmenities.every(a => card.amenities?.includes(a)))
        return false

      // Switch: pets — group id is 'pets', card must have 'pets-allowed' in amenities
      if (filterState?.pets === true && !card.amenities?.includes('pets-allowed')) return false
    }

    return true
  })
}

// Build filter config by replacing hardcoded options with GlobalParams API data.
// Only replaces options for radio/checkbox groups that have a typeCode.
// Falls back to the hardcoded options when the API returns nothing.
const buildDynamicFilterConfig = (staticConfig, filterGroupApiData) => {
  return staticConfig.map(group => {
    if (!group.typeCode || (group.type !== 'radio' && group.type !== 'checkbox')) return group

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
  const [hotelsData, ftrBudget, ftrRevscr, ftrRmfac, ftrFunthng, ftrRntdur, ftrPrptype, ftrBdrm, ftrAmnt] =
    await Promise.all([
      serverGet(API_URL.GET_PROPERTIES, { LISTING_TYPE_ID: 1, PAGE_SIZE: DEFAULT_PAGE_SIZE, PAGE_NUMBER: 1 }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_BUDGET', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_REVSCR', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_RMFAC', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_FUNTHNG', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_RNTDUR', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_PRPTYPE', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_BDRM', ALLOWED: true }),
      serverGet(API_URL.GET_GLOBAL_PARAMETERS, { TYPE_CODE: 'FTR_AMNT', ALLOWED: true })
    ])

  return {
    props: {
      initialHotelsData: Array.isArray(hotelsData) ? hotelsData : [],
      filterGroupApiData: {
        FTR_BUDGET: Array.isArray(ftrBudget) ? ftrBudget : [],
        FTR_REVSCR: Array.isArray(ftrRevscr) ? ftrRevscr : [],
        FTR_RMFAC: Array.isArray(ftrRmfac) ? ftrRmfac : [],
        FTR_FUNTHNG: Array.isArray(ftrFunthng) ? ftrFunthng : [],
        FTR_RNTDUR: Array.isArray(ftrRntdur) ? ftrRntdur : [],
        FTR_PRPTYPE: Array.isArray(ftrPrptype) ? ftrPrptype : [],
        FTR_BDRM: Array.isArray(ftrBdrm) ? ftrBdrm : [],
        FTR_AMNT: Array.isArray(ftrAmnt) ? ftrAmnt : []
      }
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const Home = ({ initialHotelsData = [], filterGroupApiData = {} }) => {
  const dispatch = useDispatch()
  const { user } = useAuth()

  // Track whether SSR initial data has been consumed
  const ssrDataConsumed = useRef(false)
  const [activeTab, setActiveTab] = useState('hotels')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [hotelsCards, setHotelsCards] = useState([])
  const [hotelsPageNumber, setHotelsPageNumber] = useState(1)
  const [hasMoreHotels, setHasMoreHotels] = useState(true)
  const [isHotelsLoading, setIsHotelsLoading] = useState(true)
  const [isHotelsFetchingMore, setIsHotelsFetchingMore] = useState(false)
  const [hotelsSearchParams, setHotelsSearchParams] = useState({})

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
    ssrDataConsumed.current = false
  }, [user?.usercode])

  useEffect(() => {
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
  }, [dispatch, hotelsPageNumber, user?.usercode, hotelsSearchParams, initialHotelsData])

  const handleHeroSearch = useCallback(params => {
    setHotelsSearchParams({
      COUNTRY: params.toCountry || '',
      CITY: params.toCity || '',
      FROM_COUNTRY: params.fromCountry || '',
      FROM_CITY: params.fromCity || '',
      CHECK_IN: params.checkIn || '',
      CHECK_OUT: params.checkOut || '',
      GUESTS: params.guests || 0,
      ADULTS: params.adults || 1,
      CHILDREN: params.children || 0,
      ROOMS: params.rooms || 1
    })
    setHotelsCards([])
    setHotelsPageNumber(1)
    setHasMoreHotels(true)
  }, [])

  const handleLoadMoreHotels = useCallback(() => {
    if (isHotelsLoading || isHotelsFetchingMore || !hasMoreHotels) return
    setHotelsPageNumber(prevPage => prevPage + 1)
  }, [hasMoreHotels, isHotelsFetchingMore, isHotelsLoading])

  const hotelSections = useMemo(
    () => [
      {
        id: 'hotels-live',
        title: hotelPropertySections?.[0]?.title || 'Featured Properties',
        subtitle: hotelPropertySections?.[0]?.subtitle || 'Latest listings from GoCommunityMap',
        cards: hotelsCards
      }
    ],
    [hotelsCards]
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

  // Reset filter state when tab changes
  useEffect(() => {
    setFilterState(initialFilterState)
  }, [initialFilterState])

  const activePropertySections = useMemo(
    () => (activeTab === 'hotels' ? hotelSections : rentalPropertySections),
    [activeTab, hotelSections]
  )

  const filteredSections = useMemo(
    () =>
      activePropertySections.map(section => ({
        ...section,
        cards: filterProperties(section.cards, filterState, activeFilterConfig)
      })),
    [activePropertySections, filterState, activeFilterConfig]
  )

  const filteredProperties = useMemo(() => filteredSections.flatMap(s => s.cards), [filteredSections])

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
        />

        <Container maxWidth='xl' sx={{ py: { xs: 3, md: 6 } }}>
          <Box mt={10}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    position: 'sticky',
                    overflowY: { xs: 'inherit', md: 'scroll' },
                    maxHeight: { xs: 'fit-content', md: '70vh' },
                    bottom: { xs: 0, md: 200 },
                    top: { xs: 0, md: 200 }
                  }}
                >
                  <LandingFilterSidebar
                    filterConfig={activeFilterConfig}
                    filterState={filterState}
                    setFilterState={setFilterState}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                {viewMode === 'list' ? (
                  <LandingPropertySections
                    sections={filteredSections}
                    isLoading={activeTab === 'hotels' && isHotelsLoading}
                    hasMore={activeTab === 'hotels' && hasMoreHotels}
                    isFetchingMore={activeTab === 'hotels' && isHotelsFetchingMore}
                    onLoadMore={activeTab === 'hotels' ? handleLoadMoreHotels : undefined}
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
