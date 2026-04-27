import { Button, Card, CardMedia, Chip, Grid, IconButton, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'

import SwiperControls from '../swiper/SwiperControls'
import IconifyIcon from 'src/@core/components/icon'
import useClipboard from 'src/@core/hooks/useClipboard'
import { toast } from 'react-hot-toast'

import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { amountWithComma, dateConvert } from 'src/@core/utils'
import { useEffect, useState } from 'react'
import { getListingType, listingTypes } from 'src/configs'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%'
}))

export const PropertySmallCard = ({ data }) => {
  const clipboard = useClipboard()
  const [showCell, setShowCell] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  const handleClipboard = value => {
    if (value?.length > 0) {
      clipboard.copy(value)
    }
    toast.success('copied!', {
      duration: 2000
    })
  }
  useEffect(() => {
    if (showCell) {
      setTimeout(() => {
        setShowCell(false)
      }, 10000)
    }
  }, [showCell])
  useEffect(() => {
    if (showEmail) {
      setTimeout(() => {
        setShowEmail(false)
      }, 10000)
    }
  }, [showEmail])

  return (
    <Link
      href={`/${getListingType(data.LISTING_TYPE_ID)?.ROUTE}/properties/${data.PROPERTY_ID}`}
      style={{ textDecoration: 'none' }}
    >
      <Card fullWidth sx={{ my: 2, height: '100%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CardMedia component='img' height='150' image={JSON.parse(data.PICTURE_LINKS)[0].LINK} alt='' />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} p={3}>
              <Grid item xs={12} display='flex' justifyContent='space-between' px={2}>
                <Typography variant='h5'>${amountWithComma(data.PRICE)}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle1'>
                  {data.BEDROOMS_DESC} Bed {data.PROPERTY_TYPE_DESC} {data.LISTING_TYPE_DESC}
                </Typography>
                <Typography variant='subtitle2'>{data.PLACE}</Typography>
              </Grid>
              <Grid item xs={12} display='flex' alignItems='center' justifyContent='left' px={2}>
                <Typography variant='subtitle2' fontSize={16} display='flex' alignItems='center' justifyContent='left'>
                  <IconifyIcon icon='tabler:bed' style={{ fontSize: 24, marginRight: 5 }} />
                  {data.BEDROOMS_DESC}
                </Typography>
                <Typography variant='subtitle2' fontSize={16} display='flex' alignItems='center' justifyContent='left'>
                  <IconifyIcon icon='tabler:bath' style={{ fontSize: 24, marginRight: 5 }} />
                  {data.BATHROOMS_DESC}
                </Typography>
                <Typography variant='subtitle2' fontSize={16} display='flex' alignItems='center' justifyContent='left'>
                  <IconifyIcon icon='tabler:armchair' style={{ fontSize: 24, marginRight: 5 }} />
                  {data.RECEPTIONS_DESC}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Link>
  )
}
