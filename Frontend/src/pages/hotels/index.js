import { Card, CardContent, Container, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import { DiscoverSections, NewsSections, SearchHotelsSectionCard, SecondSections } from 'src/views/components'
import BreadCrumbs from 'src/views/components/breadcrumbs'
import { API_URL } from 'src/configs'
import themeConfig from 'src/configs/themeConfig'
import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/system'
import { serverGet } from 'src/configs/services/serverHttp'
import SeoHead from 'src/components/SeoHead'

export const getServerSideProps = async () => {
  const [sectionData, newsData, discoverSectionsData] = await Promise.all([
    serverGet(API_URL.HOME_SECTIONS, { DISPLAY_TYPE: '2' }),
    serverGet(API_URL.GET_NEWS, { DISPLAY_TYPE: '2' }),
    serverGet(API_URL.DISCOVER_SECTION, { DISPLAY_TYPE: '2' })
  ])

  return {
    props: {
      sectionData: sectionData ?? [],
      newsData: newsData ?? [],
      discoverSectionsData: discoverSectionsData ?? []
    }
  }
}

const pageTitle = 'Hotels'

const Hotels = ({ sectionData, newsData, discoverSectionsData }) => {
  const [filterState, setFilterState] = useState({})
  const linkList = [{ title: 'Home', link: '/home' }]
  const [isFiltered, setIsFiltered] = useState(false)
  const theme = useTheme()

  return (
    <>
      <SeoHead
        title='Properties Hotels'
        description='Browse thousands of properties hotels across the UK. Filter by price, bedrooms, location and more. Find your perfect home today.'
        canonical='https://gocommunitymaptymap.com/hotels'
      />
      <Grid container>
        <Grid item xs={12}>
          <BreadCrumbs list={linkList} title={pageTitle} />
        </Grid>
        <Grid item xs={12} sx={{ position: 'absolute', top: 130, left: 0, width: '100%' }}>
          <SearchHotelsSectionCard
            setFilterState={setFilterState}
            filterState={filterState}
            setIsFiltered={setIsFiltered}
            title='Properties hotels'
            subtitle='Search flats and houses hotels in the UK.'
          />
        </Grid>
        <Grid item xs={12} pb={3} mt={120}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={7} display='flex' alignItems='center'>
                    <Box>
                      <Typography variant='h5' color={theme.palette.primary.main}>
                        Simplify buying a home with {themeConfig.templateName}
                      </Typography>
                      <Typography variant='h6' color={theme.palette.primary.dark}>
                        Find the perfect property with:
                      </Typography>
                      <Typography variant='subtitle1' color={theme.palette.primary.dark}>
                        <ul>
                          <li>
                            Advanced search filters:
                            <small>To quickly narrow down your options</small>
                          </li>
                          <li>
                            Trusted local agents: <small>To secure those first viewings</small>
                          </li>
                          <li>
                            Instant alerts: <small>So you-™ll never miss a new property listing</small>
                          </li>
                          <li>
                            Exclusive {themeConfig.templateName} estimates:{' '}
                            <small>To see how much your home is worth</small>
                          </li>
                          <li>
                            Recently sold prices: <small>So you can make the winning offer</small>
                          </li>
                        </ul>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={5} textAlign='end'>
                    <img
                      style={{ borderRadius: 10, boxShadow: 10 }}
                      src='/images/banners/banner-24.jpg'
                      alt='image'
                      width='80%'
                      height='auto'
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <SecondSections data={sectionData} />
              </Grid>
              <Grid item xs={12}>
                <NewsSections data={newsData} />
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

Hotels.guestGuard = true

export default Hotels
