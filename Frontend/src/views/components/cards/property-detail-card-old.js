import {
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import ReactHtmlParser from 'react-html-parser'

import IconifyIcon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'
import { amountWithComma, dateConvert } from 'src/@core/utils'
import SwiperControls2 from '../swiper/SwiperControls2'
import { Icon } from '@iconify/react'
import useClipboard from 'src/@core/hooks/useClipboard'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { getAgentInfoAPI } from 'src/configs'
import LinkSaveButton from '../buttons/link-save-button'
import { NoRecordCard } from './no-record-card'
import { ContactNoButton } from '../buttons/contact-no-button'
import { EmailButton } from '../buttons/email-button'
import { renderHTML } from '@iconify/iconify'

export const PropertyDetailCard = ({ data }) => {
  const clipboard = useClipboard()
  const [cardData, setCardData] = useState([])
  const [showCell, setShowCell] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  useEffect(() => {
    setCardData(data)
  }, [data])

  return cardData ? (
    <Card fullWidth variant='outlined' sx={{ my: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {cardData.PICTURE_LINKS && (
            <SwiperControls2
              ACTIVE={cardData.SAVED}
              PROPERTY_ID={cardData.PROPERTY_ID}
              data={JSON.parse(cardData.PICTURE_LINKS)}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} p={3}>
            <Grid item xs={12} display='flex' justifyContent='space-between' px={2}>
              <Chip
                variant='filled'
                color={cardData.ADDED_ON_DESC === 'Just Added' ? 'warning' : 'secondary'}
                label={cardData.ADDED_ON_DESC}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1' px={2}>
                £{amountWithComma(cardData.PRICE)}
                <NextLink href='/'>
                  <Link fontSize={14} ml={3}>
                    See how much I could borrow
                  </Link>
                </NextLink>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1'>
                {cardData.BEDROOMS_DESC} Bed {cardData.PROPERTY_TYPE_DESC} {cardData.LISTING_TYPE_DESC}
              </Typography>
              <Typography variant='subtitle2'>{cardData.PLACE}</Typography>
            </Grid>
            <Grid item xs={12} display='flex' alignItems='center' justifyContent='left' px={2}>
              <Typography variant='subtitle2' fontSize={16} display='flex' alignItems='center' justifyContent='left'>
                <IconifyIcon icon='tabler:bed' style={{ fontSize: 24, marginRight: 5 }} />
                {cardData.BEDROOMS_DESC}
              </Typography>
              <Typography variant='subtitle2' fontSize={16} display='flex' alignItems='center' justifyContent='left'>
                <IconifyIcon icon='tabler:bath' style={{ fontSize: 24, marginRight: 5 }} />
                {cardData.BATHROOMS_DESC}
              </Typography>
              <Typography variant='subtitle2' fontSize={16} display='flex' alignItems='center' justifyContent='left'>
                <IconifyIcon icon='tabler:armchair' style={{ fontSize: 24, marginRight: 5 }} />
                {cardData.RECEPTIONS_DESC}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>{cardData.PROPERTY_NUM_NAME}</Typography>
              <Typography variant='subtitle1'>{cardData.STREET_NAME}</Typography>
              <Typography variant='body2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.SUMMARY?.replaceAll('\\n', '<br>')
                  }}
                ></div>
              </Typography>
            </Grid>
            <Grid item xs={12} display='flex' px={2}>
              <Chip variant='outlined' color='secondary' label={cardData.TENURE_DESC?.toUpperCase()} />
            </Grid>
            <Grid item xs={12} display='flex' px={2}>
              <Typography variant='subtitle2'>Listed on {dateConvert(cardData.CREATEDON)}</Typography>
            </Grid>
            <Grid item xs={12} textAlign='end'>
              <Divider />
              <ContactNoButton PROPERTY_ID={cardData.PROPERTY_ID} />
              <EmailButton PROPERTY_ID={cardData.PROPERTY_ID} />
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ textDecoration: 'underline' }}>
                Features and Descriptions
              </Typography>
              <List>
                {cardData.PROPERTY_FEATURES &&
                  JSON.parse(cardData.PROPERTY_FEATURES)?.map((row, index) => (
                    <ListItem sx={{ p: 0 }} key={index}>
                      <ListItemIcon>
                        <Icon fontSize={12} icon='tabler:star-filled' />
                      </ListItemIcon>
                      <ListItemText fontSize={9} primary={row.FEATURES} />
                    </ListItem>
                  ))}
              </List>
              <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>
                Additional Features
              </Typography>
              <List>
                {cardData.PROPERTY_FEATURES &&
                  JSON.parse(cardData.CUSTOM_FEATURES)?.map((row, index) => (
                    <ListItem sx={{ p: 0 }} key={index}>
                      <ListItemIcon>
                        <Icon fontSize={12} icon='tabler:star-filled' />
                      </ListItemIcon>
                      <ListItemText fontSize={9} primary={row.DESCRIPTION} />
                    </ListItem>
                  ))}
              </List>
              <Typography variant='subtitle2' sx={{ textDecoration: 'underline' }}>
                Description
              </Typography>

              <Typography variant='body2'>
                <div dangerouslySetInnerHTML={{ __html: cardData?.FULLDESCRIPTION?.replaceAll('\\n', '<br>') }}></div>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  ) : (
    <NoRecordCard />
  )
}
