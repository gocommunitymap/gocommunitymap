// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { use, useEffect, useState } from 'react'
import { getDiscoverSectionsAPI, getHomeSectionsAPI } from 'src/configs'
import Link from 'next/link'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Avatar, Box, IconButton, Tab } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import IconifyIcon from 'src/@core/components/icon'

const TabSection = props => {
  const { discoverSection, sectionType, value } = props
  const [section, setSection] = useState([])

  useEffect(() => {
    setSection(discoverSection)
  }, [value, discoverSection])

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <Box
          borderRadius={1}
          sx={{ bgcolor: grey[200], color: blue[600], width: 80, height: 80, float: 'left', mr: 3, p: 1 }}
        >
          <IconifyIcon fontSize={72} icon={section[0]?.PICTURE_LINK} />
        </Box>
        <Typography variant='h6'>{section[0]?.SECTION_TITLE}</Typography>
        <Typography variant='subtitle1'>{section[0]?.SECTION_SUBTITLE}</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          {section?.length > 0 &&
            section?.map((item, index) => (
              <Grid key={index} item xs={12} md={6} display='flex' alignItems='center'>
                <Link href={item?.LINK_URL} style={{ textDecoration: 'none' }}>
                  <Button variant='text' size='small' color='secondary'>
                    <IconifyIcon icon='tabler:arrow-badge-right-filled' />
                    {item?.LINK_TITLE}
                  </Button>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export const DiscoverSections = ({ data }) => {
  const [discoverSection1, setDiscoverSection1] = useState({})
  const [discoverSection2, setDiscoverSection2] = useState({})
  const [sectionType, setSectionType] = useState(1)

  const initialize = () => {
    const _discoverSectionsResponse = data
    const discoverSections1 = _discoverSectionsResponse?.filter(i => i.SECTION_TYPE === 1)
    const discoverSections2 = _discoverSectionsResponse?.filter(i => i.SECTION_TYPE === 2)

    setDiscoverSection1(discoverSections1)
    setDiscoverSection2(discoverSections2)
  }

  useEffect(() => {
    initialize()
  }, [data])

  const handleSectionTypeChange = (event, newValue) => {
    setSectionType(newValue)
  }

  return discoverSection1?.length || discoverSection2?.length ? (
    <Card color='primary' sx={{ border: 0, boxShadow: 0 }}>
      <CardContent>
        <Typography variant='h5'>Discover towns and cities</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TabContext value={sectionType}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <TabList onChange={handleSectionTypeChange}>
                  <Tab label='Hotels' value={1} />
                  <Tab label='Rental' value={2} />
                </TabList>
              </Box>
              <>
                <TabPanel value={1}>
                  {discoverSection1?.length > 0 && sectionType === 1 && (
                    <TabSection discoverSection={discoverSection1} />
                  )}
                </TabPanel>
                <TabPanel value={2}>
                  {discoverSection2?.length > 0 && sectionType === 2 && (
                    <TabSection discoverSection={discoverSection2} />
                  )}
                </TabPanel>
                <Box></Box>
              </>
            </TabContext>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ) : (
    <></>
  )
}
