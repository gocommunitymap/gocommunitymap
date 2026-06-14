import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, MarkerClusterer } from '@react-google-maps/api'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { StarRating } from 'src/views/components'
import { GoogleMapProvider } from 'src/@core/context/MapContext'

const FALLBACK_CENTER = { lat: null, lng: null }
const DEFAULT_ZOOM = 10
const MAP_HEIGHT = '70vh'

const CommunityMapMapView = ({ properties, selectedProperty, onSelect }) => {
  const router = useRouter()
  const [userCenter, setUserCenter] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 5000 }
    )
  }, [])

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
      } else if (userCenter) {
        map.panTo(userCenter)
        map.setZoom(13)
      }
    },
    [properties, userCenter]
  )

  return (
    <GoogleMapProvider
      mapLoaded={mapLoaded}
      setMapLoaded={setMapLoaded}
      mapProps={{
        mapContainerStyle: { width: '100%', height: MAP_HEIGHT, borderRadius: 16 },
        center: userCenter || FALLBACK_CENTER,
        zoom: DEFAULT_ZOOM,
        onLoad: handleMapLoad
      }}
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
                  <Box
                    sx={{ minWidth: 200, cursor: 'pointer' }}
                    onClick={() => router.push(`/hotels/properties/${property.id}`)}
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Box sx={{ mt: 1 }}>
                      <Typography variant='body2'>{property.type}</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0b1730' }}>
                        {property.title}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#10B981' }}>
                        ${property.price} {property.type === 'rental' ? `/${property.frequency}` : '/night'}
                      </Typography>
                      <StarRating value={property.rating} />
                    </Box>
                    <Box
                      sx={{
                        mt: 1,
                        textAlign: 'center',
                        color: '#fff',
                        bgcolor: '#10B981',
                        borderRadius: 1,
                        py: 0.5,
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
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
    </GoogleMapProvider>
  )
}

export default CommunityMapMapView
