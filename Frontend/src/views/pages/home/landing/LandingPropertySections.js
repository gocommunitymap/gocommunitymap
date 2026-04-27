import { Box, Button, Card, Grid, Skeleton, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import { amountWithComma } from 'src/@core/utils'
import { postSavedLinksAPI } from 'src/configs'
import { useAuth } from 'src/hooks/useAuth'
import { MapModal, StarRating } from 'src/views/components'

import { defaultPageFont } from 'src/@core/utils'

const DEFAULT_PROPERTY_IMAGE = '/images/logo.png'

const skeletonSx = {
  bgcolor: '#e6edf4',
  '&::after': {
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.78), transparent)'
  }
}

const StayCard = ({ item }) => {
  const { asPath } = useRouter()
  const { user } = useAuth()
  const [isSaved, setIsSaved] = useState(Boolean(item?.isSaved))
  const [mapOpen, setMapOpen] = useState(false)

  const handleSaveToggle = async event => {
    event.stopPropagation()
    if (!item?.propertyId) return

    if (!user?.usercode) {
      // replace(`/login/?returnUrl=${asPath}`)
      alert('Please login to save properties')

      return
    }

    try {
      const response = await postSavedLinksAPI({
        PROPERTY_ID: item.propertyId,
        ACTIVE: !isSaved,
        LINK: asPath,
        TYPE: 'P',
        DESCRIPTION: item.title
      })

      if (response?.data?.[0]?.MESSAGE?.includes('SUCCESSFULLY')) {
        setIsSaved(!isSaved)
        toast.success(!isSaved ? 'Saved!' : 'Un Saved!')
      }
    } catch {
      toast.error('Failed to Saved!')
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid #dfe9e4',
        overflow: 'hidden',
        backgroundColor: '#fff',
        height: '100%'
      }}
    >
      <Box sx={{ position: 'relative', height: 260 }}>
        <img
          src={item.image || DEFAULT_PROPERTY_IMAGE}
          alt={item.title}
          onError={event => {
            event.currentTarget.onerror = null
            event.currentTarget.src = DEFAULT_PROPERTY_IMAGE
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Card
          onClick={handleSaveToggle}
          elevation={2}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 34,
            height: 34,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconifyIcon icon={isSaved ? 'tabler:heart-filled' : 'tabler:heart'} fontSize='1rem' color='#8090a7' />
        </Card>
      </Box>
      <Box
        sx={{
          p: 2.2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'top',
          justifyContent: 'space-between'
        }}
      >
        <Stack direction='row' spacing={2} justifyContent='space-between' alignItems='top'>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0b1730', fontFamily: defaultPageFont }}>
              {item.title}
            </Typography>
            <Typography sx={{ color: '#6f7f98', fontFamily: defaultPageFont, fontSize: 9 }}>{item.district}</Typography>
          </Box>
          <Button
            color='secondary'
            variant='text'
            size='small'
            onClick={e => {
              e.stopPropagation()
              setMapOpen(true)
            }}
            sx={{ px: 0.6, py: 0.2, height: 28, width: 80, borderRadius: 1 }}
          >
            <Typography sx={{ fontSize: 7, fontWeight: 700, fontFamily: defaultPageFont }}>Show on Map</Typography>
          </Button>

          <MapModal
            open={mapOpen}
            onClose={() => setMapOpen(false)}
            title={item.title}
            subtitle={item.district}
            lat={item.lat}
            lng={item.lng}
            mapUrl={item.mapUrl}
          />
        </Stack>

        <Stack
          direction='row'
          spacing={2}
          mt={1.5}
          color='#6f7f98'
          sx={{ fontFamily: defaultPageFont, fontSize: '0.75rem', fontWeight: 600 }}
        >
          {item.beds > 0 && (
            <Stack direction='row' spacing={0.4} alignItems='center'>
              <IconifyIcon icon='tabler:bed' fontSize='0.8rem' />
              <span>
                {item.beds} Bedroom{item.beds !== 1 ? 's' : ''}
              </span>
            </Stack>
          )}
          {item.baths > 0 && (
            <Stack direction='row' spacing={0.4} alignItems='center'>
              <IconifyIcon icon='tabler:bath' fontSize='0.8rem' />
              <span>
                {item.baths} Bathroom{item.baths !== 1 ? 's' : ''}
              </span>
            </Stack>
          )}
          {item.guests > 0 && (
            <Stack direction='row' spacing={0.4} alignItems='center'>
              <IconifyIcon icon='tabler:users' fontSize='0.8rem' />
              <span>{item.guests} Guests</span>
            </Stack>
          )}
        </Stack>

        <Stack direction='row' justifyContent='space-between' alignItems='center' mt={2}>
          <StarRating value={item.rating} />
          <Typography sx={{ color: '#0b1730', fontFamily: defaultPageFont, fontWeight: 800, fontSize: '1rem' }}>
            ${amountWithComma(item.price)}
            <Typography component='span' sx={{ ml: 0.5, color: '#8d9bb1', fontWeight: 700, fontSize: '0.7rem' }}>
              / night
            </Typography>
          </Typography>
        </Stack>
        <Box mt={2} textAlign='end' sx={{ mt: 8, position: 'relative' }}>
          <Button
            variant='contained'
            fullWidth
            component={item?.detailPath ? Link : 'button'}
            href={item?.detailPath || undefined}
            disabled={!item?.detailPath}
            sx={{
              position: 'absolute',
              left: -10,
              bottom: -10,
              width: 'calc(100% + 30px)',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}
          >
            See details
            <IconifyIcon icon='tabler:arrow-right' style={{ marginLeft: 6 }} />
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

const LandingPropertySections = ({
  sections,
  isLoading = false,
  hasMore = false,
  isFetchingMore = false,
  onLoadMore
}) => {
  const loadMoreRef = useRef(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading || isFetchingMore) return
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          onLoadMore()
        }
      },
      { root: null, rootMargin: '220px 0px', threshold: 0 }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isFetchingMore, isLoading, onLoadMore])

  if (isLoading) {
    return (
      <Grid container spacing={2.5}>
        {[1, 2, 3, 4].map(row => (
          <Grid item xs={12} md={6} key={`skeleton-${row}`}>
            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #dfe9e4', overflow: 'hidden' }}>
              <Skeleton variant='rectangular' height={260} animation='wave' sx={skeletonSx} />
              <Box sx={{ p: 2.2 }}>
                <Skeleton variant='rectangular' width='70%' height={38} animation='wave' sx={skeletonSx} />
                <Skeleton variant='rectangular' width='45%' height={26} animation='wave' sx={skeletonSx} />
                <Skeleton variant='rectangular' width='80%' height={24} animation='wave' sx={skeletonSx} />
                <Skeleton variant='rectangular' width='60%' height={24} animation='wave' sx={skeletonSx} />
                <Box mt={2} display='flex' justifyContent='space-between'>
                  <Skeleton variant='rectangular' width='25%' height={30} animation='wave' sx={skeletonSx} />
                  <Skeleton variant='rectangular' width='30%' height={34} animation='wave' sx={skeletonSx} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  const allEmpty = sections.every(section => section.cards.length === 0)

  if (allEmpty) {
    return (
      <Box
        sx={{
          py: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 2,
          color: '#8d9bb1'
        }}
      >
        <IconifyIcon icon='tabler:building-community' fontSize='4rem' />
        <Typography variant='h6' fontWeight={800} sx={{ color: '#0b1730', fontFamily: defaultPageFont }}>
          No properties found
        </Typography>
        <Typography sx={{ fontFamily: defaultPageFont, fontSize: '0.95rem', maxWidth: 340 }}>
          Try adjusting your filters or search criteria to find available properties.
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={5}>
      {sections.map(section => {
        if (section.cards.length === 0) return null

        return (
          <Box key={section.id}>
            <Stack direction='row' justifyContent='space-between' alignItems='end' mb={2.2}>
              <Box>
                <Typography variant='h5' fontWeight={800} sx={{ color: '#0b1730', fontFamily: defaultPageFont }}>
                  {section.title}
                </Typography>
                <Typography variant='body2' fontWeight={800} sx={{ color: '#74849b', fontFamily: defaultPageFont }}>
                  {section.subtitle}
                </Typography>
              </Box>
              <Typography sx={{ color: '#11B981', fontWeight: 800, fontFamily: defaultPageFont, fontSize: '1rem' }}>
                Showing {section.cards.length} result(s)
              </Typography>
            </Stack>
            <Grid container spacing={2.5}>
              {section.cards.map(item => (
                <Grid item xs={12} md={6} key={item.id}>
                  <StayCard item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      })}

      {isFetchingMore ? (
        <Grid container spacing={2.5}>
          {[1, 2].map(row => (
            <Grid item xs={12} md={6} key={`loading-more-${row}`}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #dfe9e4', overflow: 'hidden' }}>
                <Skeleton variant='rectangular' height={260} animation='wave' sx={skeletonSx} />
                <Box sx={{ p: 2.2 }}>
                  <Skeleton variant='rectangular' width='70%' height={38} animation='wave' sx={skeletonSx} />
                  <Skeleton variant='rectangular' width='45%' height={26} animation='wave' sx={skeletonSx} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      {hasMore && !isLoading ? <Box ref={loadMoreRef} sx={{ height: 1 }} /> : null}
    </Stack>
  )
}

export default LandingPropertySections
