import { Card, CardContent, Chip, Container, Grid, Typography, useTheme } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { displayTypes, getDiscoverSectionsAPI, getHomeSectionsAPI, getNewsSectionsAPI } from 'src/configs'
import { DiscoverSections, NewsSections, SearchHomeSectionCard, SecondSections } from 'src/views/components'
import { StyledGrid } from 'src/@core/components/styled-grid'
import { Img } from 'src/@core/components/styled-img'

const Discover = () => {
  const theme = useTheme()
  const [sectionData, setSectionData] = useState([])
  const [newsData, setNewsData] = useState([])
  const [discoverSectionsData, setDiscoverSectionsData] = useState([])

  const init = async () => {
    const sectionResponse = await getHomeSectionsAPI({ DISPLAY_TYPE: displayTypes.DISCOVER })
    const newsResponse = await getNewsSectionsAPI({ DISPLAY_TYPE: displayTypes.DISCOVER })
    const discoverSectionsResponse = await getDiscoverSectionsAPI({ DISPLAY_TYPE: displayTypes.DISCOVER })
    setSectionData(sectionResponse?.data)
    setNewsData(newsResponse?.data)
    setDiscoverSectionsData(discoverSectionsResponse?.data)
  }
  useEffect(() => {
    init()
  }, [])

  return (
    <Grid container sx={{ bgcolor: 'white', minHeight: '100vh', width: '100%', bgcolor: 'transparent' }}>
      <StyledGrid item xs={12}>
        <img
          style={{
            top: 0, // ← anchor to top, not bottom
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: -1,
            objectFit: 'cover', // ← fills without distorting, clips overflow
            objectPosition: 'center center'
          }}
          alt=''
          src={`/images/pages/discover-background.png`}
        />
      </StyledGrid>
      <Grid container sx={{ position: 'relative', minHeight: 'auto', width: '100%' }}>
        <Grid container>
          <Grid item xs={12}>
            <SearchHomeSectionCard />
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <br></br>
      <br></br>
      <Container sx={{ zIndex: '1', position: 'relative' }}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <SecondSections data={sectionData} />
          </Grid>
          <Grid item xs={12}>
            <NewsSections data={newsData} />
          </Grid>
          <Grid item xs={12}>
            <DiscoverSections data={discoverSectionsData} />
          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
}

Discover.guestGuard = true

export default Discover
