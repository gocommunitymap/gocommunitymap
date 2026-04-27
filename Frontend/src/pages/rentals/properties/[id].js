import { Grid } from '@mui/material'
import { Container } from '@mui/system'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import { API_URL } from 'src/configs'
import { serverGet } from 'src/configs/services/serverHttp'
import { PropertyDetailCard } from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import Map from 'src/views/components/map'
import SeoHead from 'src/components/SeoHead'

const linkList = [
  { title: 'Home', link: '/home' },
  { title: 'Rental', link: '/rental' },
  { title: 'Properties', link: '/rental/properties' }
]
const pageTitle = 'Detail'

export const getServerSideProps = async params => {
  const { query } = params
  console.log('Query Params:', query)

  const PROPERTY_ID = query?.id
  if (!PROPERTY_ID) return { notFound: true }

  const data = await serverGet(API_URL.GET_PROPERTIES_FULL_DETAILS, { PROPERTY_ID })
  const property = Array.isArray(data) ? data[0] : null
  if (!property) return { notFound: true }

  return { props: { property } }
}

const PropertyDetail = params => {
  const { property } = params
  console.log('Property Data:', property)

  return (
    <Container>
      <SeoHead
        title={property.PROPERTY_TITLE || 'Property Rental'}
        description={
          property.SUMMARY ? property.SUMMARY.substring(0, 155) : 'View full details of this rental property.'
        }
        ogImage={property.PICTURE_LINK}
        ogType='article'
        canonical={`https://gocommunitymap.com/rental/properties/${property.PROPERTY_ID}`}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} pb={3}>
          <BreadCrumbs list={linkList} title={pageTitle} />
        </Grid>
        <Grid item md={8} xs={12}>
          <PropertyDetailCard data={property} />
          <Map data={{ LATITUDE: property.LATITUDE, LONGITUDE: property.LONGITUDE }} />
        </Grid>
        <Grid item md={4} xs={12}></Grid>
      </Grid>
    </Container>
  )
}

PropertyDetail.guestGuard = true

export default PropertyDetail
