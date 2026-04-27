import { Box, Button, Card, CardContent, Chip, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'

import { defaultPageFont } from 'src/@core/utils'

const communities = [
  {
    id: 'japanese',
    name: 'Japanese Community',
    location: 'California, USA',
    members: '250K+',
    countryCode: 'JP',
    flag: '🇯🇵',
    image: '/images/banners/banner-1.jpg'
  },
  {
    id: 'spanish',
    name: 'Spanish Community',
    location: 'New York, USA',
    members: '500K+',
    countryCode: 'ES',
    flag: '🇪🇸',
    image: '/images/banners/banner-2.jpg'
  },
  {
    id: 'polish',
    name: 'Polish Community',
    location: 'Mexico City, Mexico',
    members: '50K+',
    countryCode: 'PL',
    flag: '🇵🇱',
    image: '/images/banners/banner-3.jpg'
  },
  {
    id: 'english',
    name: 'English Community',
    location: 'London, UK',
    members: '3M+',
    countryCode: 'GB',
    flag: '🇬🇧',
    image: '/images/banners/banner-4.jpg'
  },
  {
    id: 'brazilian',
    name: 'Brazilian Community',
    location: 'Vancouver, Canada',
    members: '120K+',
    countryCode: 'BR',
    flag: '🇧🇷',
    image: '/images/banners/banner-5.jpg'
  },
  {
    id: 'korean',
    name: 'Korean Community',
    location: 'Toronto, Canada',
    members: '200K+',
    countryCode: 'KR',
    flag: '🇰🇷',
    image: '/images/banners/banner-6.jpg'
  },
  {
    id: 'egyptian',
    name: 'Egyptian Community',
    location: 'New York, USA',
    members: '90K+',
    countryCode: 'EG',
    flag: '🇪🇬',
    image: '/images/banners/banner-7.jpg'
  },
  {
    id: 'syrian',
    name: 'Syrian Community',
    location: 'California, USA',
    members: '75K+',
    countryCode: 'SY',
    flag: '🇸🇾',
    image: '/images/banners/banner-8.jpg'
  },
  {
    id: 'argentine',
    name: 'Argentine Community',
    location: 'Austin, Texas, USA',
    members: '45K+',
    countryCode: 'AR',
    flag: '🇦🇷',
    image: '/images/banners/banner-9.jpg'
  },
  {
    id: 'german',
    name: 'German Community',
    location: 'Mexico City, Mexico',
    members: '60K+',
    countryCode: 'DE',
    flag: '🇩🇪',
    image: '/images/banners/banner-10.jpg'
  },
  {
    id: 'french',
    name: 'French Community',
    location: 'New York, USA',
    members: '150K+',
    countryCode: 'FR',
    flag: '🇫🇷',
    image: '/images/banners/banner-11.jpg'
  },
  {
    id: 'indian',
    name: 'Indian Community',
    location: 'San Francisco, USA',
    members: '300K+',
    countryCode: 'IN',
    flag: '🇮🇳',
    image: '/images/banners/banner-12.jpg'
  }
]

const regions = ['All Regions', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania']

// Map country codes to regions
const countryToRegion = {
  JP: 'Asia',
  KR: 'Asia',
  IN: 'Asia',
  ES: 'Europe',
  PL: 'Europe',
  GB: 'Europe',
  DE: 'Europe',
  FR: 'Europe',
  BR: 'Americas',
  AR: 'Americas',
  EG: 'Africa',
  SY: 'Africa'
}

const CommunityListViewComponent = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')

  const filteredCommunities = communities.filter(community => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by region
    const matchesRegion = selectedRegion === 'All Regions' || countryToRegion[community.countryCode] === selectedRegion

    return matchesSearch && matchesRegion
  })

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          sx={{
            fontSize: '1.1rem',
            color: '#6f7f98',
            fontFamily: defaultPageFont
          }}
        >
          Discover Your Community Around the World
        </Typography>
      </Box>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder='Search for a city or community...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconifyIcon icon='tabler:search' fontSize='1.5rem' color='#6f7f98' />
              </InputAdornment>
            )
          }}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            display: 'block',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              fontFamily: defaultPageFont,
              fontSize: '1rem',
              '& fieldset': {
                borderColor: '#e0e7ed'
              },
              '&:hover fieldset': {
                borderColor: '#10B981'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#10B981'
              }
            }
          }}
        />
      </Box>

      {/* Region Filter Pills */}
      <Stack
        direction='row'
        spacing={1.5}
        sx={{
          mb: 5,
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        {regions.map(region => (
          <Chip
            key={region}
            label={region}
            onClick={() => setSelectedRegion(region)}
            sx={{
              bgcolor: selectedRegion === region ? '#10B981' : 'white',
              color: selectedRegion === region ? 'white' : '#0b1730',
              fontFamily: defaultPageFont,
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
              height: 'auto',
              border: '1px solid',
              borderColor: selectedRegion === region ? '#10B981' : '#e0e7ed',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: selectedRegion === region ? '#059669' : '#f0f4f8',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
              }
            }}
          />
        ))}
      </Stack>

      {/* Communities Grid */}
      <Box
        key={`${selectedRegion}-${searchQuery}`}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          '@keyframes fadeInUp': {
            from: {
              opacity: 0,
              transform: 'translateY(20px)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        {filteredCommunities.map((community, index) => (
          <Card
            key={community.id}
            sx={{
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
              maxWidth: { xs: '100%', sm: 400, md: 380 },
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e8eff2',
              animation: 'fadeInUp 0.5s ease-out',
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'both',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 35px rgba(16, 185, 129, 0.2)',
                borderColor: '#10B981'
              }
            }}
          >
            {/* Community Image */}
            <Box
              sx={{
                position: 'relative',
                height: 180,
                backgroundImage: `url(${community.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                bgcolor: '#e0e7ed'
              }}
            >
              {/* Country Flag Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,

                  // bgcolor: 'white',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: defaultPageFont
                }}
              >
                {/* <span style={{ fontSize: '1.2rem' }}>{community.flag}</span> */}
                <span>{community.countryCode}</span>
              </Box>
            </Box>

            {/* Community Info */}
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0b1730',
                  fontFamily: defaultPageFont,
                  mb: 1.5
                }}
              >
                {community.name}
              </Typography>

              <Stack spacing={1} sx={{ mb: 2.5 }}>
                <Stack direction='row' alignItems='center' spacing={0.8}>
                  <IconifyIcon icon='tabler:map-pin' fontSize='1.1rem' color='#6f7f98' />
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#6f7f98',
                      fontFamily: defaultPageFont
                    }}
                  >
                    {community.location}
                  </Typography>
                </Stack>

                <Stack direction='row' alignItems='center' spacing={0.8}>
                  <IconifyIcon icon='tabler:users' fontSize='1.1rem' color='#6f7f98' />
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#6f7f98',
                      fontFamily: defaultPageFont
                    }}
                  >
                    {community.members} members
                  </Typography>
                </Stack>
              </Stack>

              <Button
                fullWidth
                variant='contained'
                sx={{
                  bgcolor: '#10B981',
                  color: 'white',
                  fontFamily: defaultPageFont,
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.2,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#059669',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }
                }}
              >
                Join Community
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* No Results */}
      {filteredCommunities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            sx={{
              fontSize: '1.2rem',
              color: '#6f7f98',
              fontFamily: defaultPageFont
            }}
          >
            No communities found. Try a different search.
          </Typography>
        </Box>
      )}
    </>
  )
}

export default CommunityListViewComponent
