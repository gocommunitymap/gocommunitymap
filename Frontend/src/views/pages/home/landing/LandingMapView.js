import { Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { Circle, GoogleMap, InfoWindow, Marker, OverlayView, useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'
import CompanyLogo from 'src/@core/components/company-logo'
import IconifyIcon from 'src/@core/components/icon'
import { defaultPageFont } from 'src/@core/utils'

const DEFAULT_PROPERTY_IMAGE = '/images/logo.png'
const USER_RADIUS_METERS = 50000

const mapContainerStyle = {
  width: '100%',
  height: '700px',
  borderRadius: '16px'
}

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503
}

const PropertyInfoWindow = ({ property, onClose }) => {
  return (
    <InfoWindow position={{ lat: property.lat, lng: property.lng }} onCloseClick={onClose}>
      <Card elevation={0} sx={{ minWidth: 250, maxWidth: 300 }}>
        <Box sx={{ position: 'relative', height: 150 }}>
          <img
            src={property.image || DEFAULT_PROPERTY_IMAGE}
            alt={property.title}
            onError={event => {
              event.currentTarget.onerror = null
              event.currentTarget.src = DEFAULT_PROPERTY_IMAGE
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <CardContent sx={{ p: 2 }}>
          <Typography
            sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b1730', fontFamily: defaultPageFont, mb: 0.5 }}
          >
            {property.title}
          </Typography>
          <Typography sx={{ color: '#6f7f98', fontFamily: defaultPageFont, fontSize: '0.85rem', mb: 1.5 }}>
            {property.district}
          </Typography>

          <Stack
            direction='row'
            spacing={1.5}
            mb={1.5}
            sx={{ fontSize: '0.75rem', color: '#6f7f98', fontFamily: defaultPageFont }}
          >
            <Stack direction='row' spacing={0.3} alignItems='center'>
              <IconifyIcon icon='tabler:bed' fontSize='0.8rem' />
              <span>{property.beds}</span>
            </Stack>
            <Stack direction='row' spacing={0.3} alignItems='center'>
              <IconifyIcon icon='tabler:bath' fontSize='0.8rem' />
              <span>{property.baths}</span>
            </Stack>
            <Stack direction='row' spacing={0.3} alignItems='center'>
              <IconifyIcon icon='tabler:users' fontSize='0.8rem' />
              <span>{property.guests}</span>
            </Stack>
          </Stack>

          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Stack direction='row' spacing={0.4} alignItems='center'>
              <IconifyIcon icon='tabler:star-filled' fontSize='0.85rem' color='#f3b11d' />
              <Typography sx={{ color: '#0b1730', fontFamily: defaultPageFont, fontWeight: 600, fontSize: '0.9rem' }}>
                {property.rating}
              </Typography>
            </Stack>
            <Typography sx={{ color: '#0b1730', fontFamily: defaultPageFont, fontWeight: 800, fontSize: '1.3rem' }}>
              ${property.price}
              <Typography component='span' sx={{ ml: 0.5, color: '#8d9bb1', fontWeight: 600, fontSize: '0.7rem' }}>
                / night
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </InfoWindow>
  )
}

const LandingMapView = ({ properties = [] }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || 'dummy-key' // Provide dummy key to prevent hook error
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator?.geolocation) return

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      () => {
        setUserLocation(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }, [])

  const onLoad = useCallback(loadedMap => {
    setMap(loadedMap)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const focusRadiusOnLocation = useCallback(
    center => {
      if (!map || !isLoaded || !center?.lat || !center?.lng) return

      const bounds = new window.google.maps.LatLngBounds()
      const radiusCircle = new window.google.maps.Circle({ center, radius: USER_RADIUS_METERS })
      const circleBounds = radiusCircle.getBounds()

      if (circleBounds) {
        bounds.union(circleBounds)
        map.fitBounds(bounds)

        return
      }

      map.setCenter(center)
      map.setZoom(10)
    },
    [isLoaded, map]
  )

  if (loadError) {
    console.error('Google Maps Load Error:', loadError)
  }

  useEffect(() => {
    if (!map || !isLoaded) return

    if (userLocation) {
      const bounds = new window.google.maps.LatLngBounds()
      const locationCircle = new window.google.maps.Circle({ center: userLocation, radius: USER_RADIUS_METERS })
      const circleBounds = locationCircle.getBounds()

      if (circleBounds) {
        bounds.union(circleBounds)
      } else {
        bounds.extend(userLocation)
      }

      map.fitBounds(bounds)

      return
    }

    if (!properties || properties.length === 0) return

    if (properties.length === 1) {
      map.setCenter({ lat: properties[0].lat, lng: properties[0].lng })
      map.setZoom(14)

      return
    }

    const bounds = new window.google.maps.LatLngBounds()
    properties.forEach(property => {
      if (property.lat && property.lng) {
        bounds.extend({ lat: property.lat, lng: property.lng })
      }
    })
    map.fitBounds(bounds)
  }, [isLoaded, map, properties, userLocation])

  // Check if API key is missing
  if (!apiKey) {
    return (
      <Box
        sx={{
          height: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 4,
          flexDirection: 'column',
          gap: 2,
          p: 4,
          textAlign: 'center'
        }}
      >
        <IconifyIcon icon='tabler:key-off' fontSize='3rem' color='#f59e0b' />
        <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.2rem' }}>
          Google Maps API Key Missing
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 500 }}>
          The environment variable NEXT_PUBLIC_GOOGLE_MAP_KEY is not set
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fef3c7', borderRadius: 2, maxWidth: 600 }}>
          <Typography sx={{ color: '#92400e', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>To fix this:</Typography>
          <Typography component='div' sx={{ color: '#92400e', fontSize: '0.75rem', textAlign: 'left' }}>
            1. Add NEXT_PUBLIC_GOOGLE_MAP_KEY to your .env file
            <br />
            2. Get an API key from Google Cloud Console
            <br />
            3. Enable "Maps JavaScript API"
            <br />
            4. Restart your development server
          </Typography>
        </Box>
      </Box>
    )
  }

  if (loadError) {
    return (
      <Box
        sx={{
          height: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 4,
          flexDirection: 'column',
          gap: 2,
          p: 4,
          textAlign: 'center'
        }}
      >
        <IconifyIcon icon='tabler:alert-circle' fontSize='3rem' color='#ef4444' />
        <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem' }}>
          Error Loading Google Maps
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 500 }}>
          {loadError.message || 'Failed to load Google Maps'}
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 2, maxWidth: 600 }}>
          <Typography sx={{ color: '#856404', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
            Common Solutions:
          </Typography>
          <Typography component='div' sx={{ color: '#856404', fontSize: '0.75rem', textAlign: 'left' }}>
            1. Check if NEXT_PUBLIC_GOOGLE_MAP_KEY is set in .env file
            <br />
            2. Enable "Maps JavaScript API" in Google Cloud Console
            <br />
            3. Enable billing for your Google Cloud Project
            <br />
            4. Check API key restrictions (HTTP referrers)
            <br />
            5. Restart your development server after changing .env
          </Typography>
        </Box>
      </Box>
    )
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 4
        }}
      >
        <CircularProgress sx={{ color: '#10B981' }} />
      </Box>
    )
  }

  if ((!properties || properties.length === 0) && !userLocation) {
    return (
      <Box
        sx={{
          height: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 4,
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography sx={{ color: '#6b7280', fontWeight: 600 }}>No properties to display</Typography>
        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Adjust your filters to see properties on the map
        </Typography>
      </Box>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={
        userLocation || (properties.length > 0 ? { lat: properties[0].lat, lng: properties[0].lng } : defaultCenter)
      }
      zoom={userLocation ? 10 : properties.length === 1 ? 14 : 10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      }}
    >
      {userLocation ? (
        <>
          <Circle
            center={userLocation}
            radius={USER_RADIUS_METERS}
            options={{
              fillColor: '#10B981',
              fillOpacity: 0.1,
              strokeColor: '#10B981',
              strokeOpacity: 0.45,
              strokeWeight: 2,
              clickable: false
            }}
          />
          <Marker
            position={userLocation}
            title='My Location'
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#2563EB',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }}
          />
        </>
      ) : null}

      {properties.map(property => (
        <OverlayView
          key={property.id}
          position={{ lat: property.lat, lng: property.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={() => {
              setSelectedProperty(property)
              focusRadiusOnLocation({ lat: property.lat, lng: property.lng })
            }}
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {/* Price label */}
            <div
              style={{
                backgroundColor: 'white',
                border: '2px solid #10B981',
                borderRadius: '10px',
                padding: '3px 8px',
                fontSize: '9px',
                fontWeight: 'bold',
                color: '#10B981',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }}
            >
              ${property.price}
            </div>

            {/* Pinpoint marker with logo */}
            <div
              style={{
                position: 'relative',
                width: '32px',
                height: '42px'
              }}
            >
              {/* Green pinpoint background */}
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#10B981',
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg)',
                  top: '0',
                  left: '0',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.3)'
                }}
              />

              {/* Logo inside pinpoint */}
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
              >
                <img
                  src='/images/logo.png'
                  alt='logo'
                  style={{
                    width: '14px',
                    height: '14px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
        </OverlayView>
      ))}

      {selectedProperty && <PropertyInfoWindow property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
    </GoogleMap>
  )
}

export default LandingMapView
