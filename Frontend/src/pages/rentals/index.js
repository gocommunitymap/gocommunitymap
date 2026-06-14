import { Container, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import { DiscoverSections, NewsSections, SearchRentalSectionCard, SecondSections } from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import { API_URL } from 'src/configs'
import themeConfig from 'src/configs/themeConfig'
import { SmallPictureCard } from 'src/@core/components/picture-cards'
import { FindYourNext, OurExpertsAnswer } from 'src/views/pages/rental'
import { serverGet } from 'src/configs/services/serverHttp'
import SeoHead from 'src/components/SeoHead'

export const getServerSideProps = async () => {
  const [sectionData, newsData, discoverSectionsData] = await Promise.all([
    serverGet(API_URL.HOME_SECTIONS, { DISPLAY_TYPE: '3' }),
    serverGet(API_URL.GET_NEWS, { DISPLAY_TYPE: '3' }),
    serverGet(API_URL.DISCOVER_SECTION, { DISPLAY_TYPE: '3' })
  ])

  return {
    props: {
      sectionData: sectionData ?? [],
      newsData: newsData ?? [],
      discoverSectionsData: discoverSectionsData ?? []
    }
  }
}

const pageTitle = 'Rental'

const Rental = ({ sectionData, newsData, discoverSectionsData }) => {
  const [filterState, setFilterState] = useState({})
  const linkList = [{ title: 'Home', link: '/home' }]
  const [isFiltered, setIsFiltered] = useState(false)

  return (
    <>
      <SeoHead
        title='Properties Rental'
        description='Search thousands of flats and houses rental across the UK. Find your perfect rental property with advanced filters for price, bedrooms, and location.'
        canonical='https://gocommunitymaptymap.com/rentals'
      />
      <Grid container>
        <Grid item xs={12} pb={3}>
          <BreadCrumbs list={linkList} title={pageTitle} />
        </Grid>
        <Grid item xs={12} sx={{ position: 'absolute', top: 130, left: 0, width: '100%' }}>
          <SearchRentalSectionCard
            setFilterState={setFilterState}
            filterState={filterState}
            title='Properties rental'
            subtitle='Search flats and houses rental in the UK.'
          />
        </Grid>
        <Grid item xs={12} pb={3} mt={130}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} my={3}>
                <FindYourNext />
              </Grid>
              <Grid item xs={12}>
                <SecondSections data={sectionData} />
              </Grid>
              <Grid item xs={12}>
                <NewsSections data={newsData} />
              </Grid>
              <Grid item xs={12}>
                <OurExpertsAnswer />
              </Grid>
              <Grid item xs={12}>
                <DiscoverSections data={discoverSectionsData} />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </>
  )
}

Rental.guestGuard = true

export default Rental
