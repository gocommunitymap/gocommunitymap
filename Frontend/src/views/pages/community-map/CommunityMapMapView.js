import React, { useCallback, useRef } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, MarkerClusterer } from '@react-google-maps/api'
import { Box, CircularProgress } from '@mui/material'

const DEFAULT_CENTER = { lat: 35.6762, lng: 139.6503 }
const DEFAULT_ZOOM = 10
const MAP_HEIGHT = '70vh'

const CommunityMapMapView = ({ properties, selectedProperty, onSelect }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'community-map-script',
    googleMapsApiKey: apiKey || 'dummy-key'
  })
  const mapRef = useRef(null)

  const handleMarkerClick = property => {
    onSelect(property)
  }

  const handleMapLoad = useCallback(
    map => {
      mapRef.current = map
      if (properties.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        properties.forEach(p => {
          if (p.lat && p.lng) bounds.extend({ lat: p.lat, lng: p.lng })
        })
        map.fitBounds(bounds)
      }
    },
    [properties]
  )

  if (loadError) {
    return (
      <Box sx={{ height: MAP_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Map failed to load
      </Box>
    )
  }
  if (!isLoaded) {
    return (
      <Box sx={{ height: MAP_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: MAP_HEIGHT, borderRadius: 16 }}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={handleMapLoad}
    >
      <MarkerClusterer>
        {clusterer =>
          properties.map(property => (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              clusterer={clusterer}
              onClick={() => handleMarkerClick(property)}
              icon={
                selectedProperty && selectedProperty.id === property.id
                  ? {
                      url: '/images/map-pin-selected.png',
                      scaledSize: new window.google.maps.Size(40, 40)
                    }
                  : undefined
              }
            >
              {selectedProperty && selectedProperty.id === property.id && (
                <InfoWindow onCloseClick={() => onSelect(null)}>
                  <Box sx={{ minWidth: 200 }}>
                    <img
                      src={property.image}
                      alt={property.title}
                      style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Box sx={{ mt: 1 }}>
                      <strong>${property.price}</strong> | Rating: {property.rating}
                    </Box>
                    <Box
                      sx={{ mt: 1, color: '#1976d2', cursor: 'pointer' }}
                      onClick={() => (window.location.href = `/${property.type}/properties/${property.id}`)}
                    >
                      View Details
                    </Box>
                  </Box>
                </InfoWindow>
              )}
            </Marker>
          ))
        }
      </MarkerClusterer>
    </GoogleMap>
  )
}

export default CommunityMapMapView
