import { CircularProgress, Grid } from '@mui/material'
import { useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useState } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

const MapContainer = withScriptjs(
  withGoogleMap(props => (
    <Grid container>
      <GoogleMap defaultZoom={props.zoom ?? 14} center={{ lat: props.data.LATITUDE, lng: props.data.LONGITUDE }}>
        <Marker position={{ lat: props.data.LATITUDE, lng: props.data.LONGITUDE }} />
      </GoogleMap>
    </Grid>
  ))
)

const Map = ({ data, height = '400px', width = '100%', zoom = 14 }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY
  })

  return (
    <>
      {isLoaded ? (
        <MapContainer
          data={{ LATITUDE: data.LATITUDE, LONGITUDE: data.LONGITUDE }}
          zoom={zoom}
          googleMapURL={data?.MAP_URL || 'https://www.google.com/maps'}
          loadingElement={<div style={{ height, width }} />}
          containerElement={<div style={{ height, width }} />}
          mapElement={<div style={{ height, width }} />}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  )
}

export default Map
