import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material'
import { Circle, GoogleMap, InfoWindow, Marker, OverlayView, useJsApiLoader } from '@react-google-maps/api'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import CompanyLogo from 'src/@core/components/company-logo'
import IconifyIcon from 'src/@core/components/icon'
import { defaultPageFont } from 'src/@core/utils'
import { GoogleMapProvider } from 'src/@core/context/MapContext'

const DEFAULT_PROPERTY_IMAGE = '/images/logo.png'
const USER_RADIUS_METERS = 50000

const mapContainerStyle = {
  width: '100%',
  height: '700px',
  borderRadius: '16px'
}

const defaultCenter = {
  lat: null,
  lng: null
}

const PropertyInfoWindow = ({ property, onClose }) => {
  return (
    <InfoWindow position={{ lat: property.lat, lng: property.lng }} onCloseClick={onClose}>
      <Card elevation={0} sx={{ p: 0, minWidth: 250, maxWidth: 300 }}>
        <Box sx={{ position: 'relative', height: 130 }}>
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
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0b1730', fontFamily: defaultPageFont, mb: 0.5 }}>
            {property.title}
          </Typography>
          <Typography sx={{ color: '#6f7f98', fontFamily: defaultPageFont, fontSize: 9, mb: 1.5 }}>
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
            <Typography sx={{ color: '#0b1730', fontFamily: defaultPageFont, fontWeight: 800, fontSize: '0.8rem' }}>
              ${property.price}
              <Typography component='span' sx={{ ml: 0.5, color: '#8d9bb1', fontWeight: 600, fontSize: '0.7rem' }}>
                / night
              </Typography>
            </Typography>
          </Stack>
          <Link href={property.detailPath}>
            <Button
              size='small'
              sx={{
                width: '100%',
                color: '#10B981',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none'
              }}
            >
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </InfoWindow>
  )
}

const LandingMapView = ({ properties = [] }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [map, setMap] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

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
      if (!map || !mapLoaded || !center?.lat || !center?.lng) return

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
    [mapLoaded, map]
  )

  useEffect(() => {
    if (!map || !mapLoaded) return

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
  }, [mapLoaded, map, properties, userLocation])

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
    <GoogleMapProvider
      mapLoaded={mapLoaded}
      setMapLoaded={setMapLoaded}
      mapProps={{
        mapContainerStyle,
        center:
          userLocation || (properties.length > 0 ? { lat: properties[0].lat, lng: properties[0].lng } : defaultCenter),

        zoom: userLocation ? 10 : properties.length === 1 ? 14 : 10,
        onLoad,
        onUnmount,
        options: {
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }
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
    </GoogleMapProvider>
  )
}

export default LandingMapView
