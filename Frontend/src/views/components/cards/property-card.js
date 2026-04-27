import { Button, Card, Chip, Grid, IconButton, Typography } from '@mui/material'
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
import LinkSaveButton from '../buttons/link-save-button'
import { ContactNoButton } from '../buttons/contact-no-button'
import { EmailButton } from '../buttons/email-button'
import { useRouter } from 'next/router'

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

export const PropertyCard = ({ data }) => {
  const clipboard = useClipboard()
  const [showCell, setShowCell] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const { asPath } = useRouter()

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
    <Card fullWidth sx={{ my: 2 }}>
      <Grid container spacing={3}>
        <Grid item sm={5} xs={12}>
          <SwiperControls data={JSON.parse(data.PICTURE_LINKS)} />
        </Grid>
        <Grid item sm={7} xs={12}>
          <Grid container spacing={2} p={1}>
            <Grid item xs={12} display='flex' justifyContent='space-between' px={2}>
              <Box>
                <Chip
                  sx={{ mb: 1, mr: 1 }}
                  variant='filled'
                  color={data.ADDED_ON_DESC === 'Just Added' ? 'warning' : 'info'}
                  label={data.ADDED_ON_DESC}
                />
                {data.NEW_BUILD && <Chip sx={{ mb: 1, mr: 1 }} variant='filled' color={'success'} label='New Home' />}
                {data.RETIREMENT_HOME && (
                  <Chip sx={{ mb: 1, mr: 1 }} variant='filled' color={'secondary'} label='Retirement Home' />
                )}
              </Box>

              <LinkSaveButton ACTIVE={data.SAVED} PROPERTY_ID={data.PROPERTY_ID} />
            </Grid>
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
            <Grid item xs={12}>
              <Typography variant='h6'>{data.PROPERTY_NUM_NAME}</Typography>
              <Typography variant='subtitle1'>{data.STREET_NAME}</Typography>
              <Typography variant='body2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: (data.SUMMARY?.length > 150
                      ? `${data.SUMMARY.substring(1, 120)}...`
                      : data.SUMMARY
                    )?.replaceAll('\\n', '<br>')
                  }}
                ></div>
              </Typography>
            </Grid>
            <Grid item xs={12} display='flex' px={2}>
              <Chip variant='outlined' color='secondary' label={data.TENURE_DESC?.toUpperCase()} />
            </Grid>
            <Grid item xs={12} display='flex' px={2}>
              <Typography variant='subtitle2'>Listed on {dateConvert(data?.CREATEDON)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} textAlign='end' p={1} sx={{ borderTop: 'solid 1px #ccc' }}>
          <ContactNoButton PROPERTY_ID={data.PROPERTY_ID} />
          <EmailButton PROPERTY_ID={data.PROPERTY_ID} />
          <Link href={`/${asPath.split('/')[1]}/properties/${data.PROPERTY_ID}`}>
            <Button sx={{ fontSize: 12, textDecoration: 'underline' }}>
              See Detail
              <IconifyIcon fontSize={12} icon='tabler:arrow-right' />
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Card>
  )
}
