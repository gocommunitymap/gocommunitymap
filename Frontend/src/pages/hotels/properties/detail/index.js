import { Card, CardContent, CircularProgress, Grid } from '@mui/material'
import { Container } from '@mui/system'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import { getPropertiesFullDetailsAPI } from 'src/configs'
import { PropertyDetailCard } from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import Map from 'src/views/components/map'

const linkList = [
  { title: 'Home', link: '/home' },
  { title: 'Hotels', link: '/hotels' },
  { title: 'Properties', link: '/hotels/properties' }
]
const pageTitle = 'Detail'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const PropertyDetail = () => {
  const [data, setData] = useState([])
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const initialize = async () => {
    const urlParams = new URLSearchParams(window.location.search)

    const search = urlParams.get('p')

    await getPropertiesAPI({ PROPERTY_ID: search }).then(response => {
      setData(response?.data[0])
    })
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} pb={3}>
          <BreadCrumbs list={linkList} title={pageTitle} />
        </Grid>
        <Grid item md={8} xs={12}>
          <PropertyDetailCard data={data} />
          <Map data={{ LATITUDE: data.LATITUDE, LONGITUDE: data.LONGITUDE }} />
        </Grid>
        <Grid item md={4} xs={12}></Grid>
      </Grid>
    </Container>
  )
}

PropertyDetail.guestGuard = true

export default PropertyDetail
