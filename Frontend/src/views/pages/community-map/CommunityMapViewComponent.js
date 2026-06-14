import React, { useEffect, useState, useMemo } from 'react'
import { Box, Stack, useMediaQuery, CircularProgress, Typography } from '@mui/material'
import CommunityMapFilters from './CommunityMapFilters'
import CommunityMapListPanel from './CommunityMapListPanel'
import CommunityMapMapView from './CommunityMapMapView'
import { fetchCommunityProperties } from './communityMapApi'

const CommunityMapViewComponent = () => {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMobile = useMediaQuery('(max-width:900px)')
  const [viewMode, setViewMode] = useState('map') // 'map' | 'list'

  useEffect(() => {
    setLoading(true)
    fetchCommunityProperties()
      .then(data => {
        setProperties(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load properties')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Filtering logic
    let filtered = [...properties]

    // Price range
    if (filters.priceRange) {
      filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    }

    // Property type
    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter(p => filters.propertyType.includes(p.type))
    }

    // Availability dates (assume p.availableDates is [start, end])
    if (filters.dates && filters.dates.length === 2) {
      filtered = filtered.filter(p => {
        const [start, end] = p.availableDates || []

        return (
          (!filters.dates[0] || new Date(start) <= new Date(filters.dates[0])) &&
          (!filters.dates[1] || new Date(end) >= new Date(filters.dates[1]))
        )
      })
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(p => {
        const propertyAmenities = p.amenities || []

        return filters.amenities.every(a => propertyAmenities.some(pa => pa.FEATURES_ID === a))
      })
    }
    setFilteredProperties(filtered)
  }, [filters, properties])

  // Sync highlight between map and list
  const handleSelectProperty = property => setSelectedProperty(property)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
        <CircularProgress />
      </Box>
    )
  }
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
        <Typography color='error'>{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, height: '80vh' }}>
      <Box sx={{ flex: isMobile ? 'none' : '0 0 350px', width: isMobile ? '100%' : 350, minWidth: 0 }}>
        <CommunityMapFilters
          filters={filters}
          setFilters={setFilters}
          minValue={Math.min(...properties.map(p => p.price))}
          maxValue={Math.max(...properties.map(p => p.price))}
          amenitiesData={properties}
        />
        {!isMobile && (
          <CommunityMapListPanel
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelect={handleSelectProperty}
          />
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
        {isMobile && (
          <Stack direction='row' spacing={2} mb={2}>
            <Typography
              variant='button'
              sx={{ cursor: 'pointer', fontWeight: viewMode === 'map' ? 700 : 400 }}
              onClick={() => setViewMode('map')}
            >
              Map
            </Typography>
            <Typography
              variant='button'
              sx={{ cursor: 'pointer', fontWeight: viewMode === 'list' ? 700 : 400 }}
              onClick={() => setViewMode('list')}
            >
              List
            </Typography>
          </Stack>
        )}
        {(!isMobile || viewMode === 'map') && (
          <CommunityMapMapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelect={handleSelectProperty}
          />
        )}
        {isMobile && viewMode === 'list' && (
          <CommunityMapListPanel
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelect={handleSelectProperty}
          />
        )}
      </Box>
    </Box>
  )
}

export default CommunityMapViewComponent
