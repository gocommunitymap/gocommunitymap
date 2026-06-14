// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, Paper } from '@mui/material/'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import { TextField } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomRadioWithImages from '../radio/custom-radio'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { countryISO, encParams, jsonToQueryString } from 'src/@core/utils'
import { position } from 'stylis'
import themeConfig from 'src/configs/themeConfig'

const placesLibrary = ['places']

const data = [
  {
    value: 'hotels',
    isSelected: true,
    title: 'Hotels'
  },
  {
    value: 'rental',
    isSelected: false,
    title: 'To Let'
  }

  //{
  //  value: 'houseprice',
  //  isSelected: false,
  //  title: 'House Price'
  //}
]
const initialSelected = data.filter(item => item.isSelected)[data.filter(item => item.isSelected)?.length - 1].value

export const SearchHomeSectionCard = () => {
  // ** Hook
  const router = useRouter()
  const [searchResult, setSearchResult] = useState('Result: none')
  const [searchState, setSearchState] = useState()
  const [selected, setSelected] = useState()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries: placesLibrary
  })

  function onLoad(autocomplete) {
    setSearchResult(autocomplete)
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace()
      const name = place.name
      const status = place.business_status
      const formattedAddress = place.formatted_address

      setSearchState({ name, status, formattedAddress })
    } else {
      alert('Please enter text')
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        height: 'auto', // ← was '100vh'
        minHeight: 'unset', // ← remove fixed minHeight
        py: 10 // ← use padding for breathing room instead
        // remove: top: { md: -140, xs: -10 }
      }}
      display='flex'
      justifyContent='center'
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            backgroundColor: '#0000003a',
            p: 10,
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant='h1' fontWeight='bold' color='white'>
            Discover
          </Typography>

          <Typography variant='h6' color='white'>
            Discover the world through your community. Explore hotels, vacation rentals, and unique stays organized
            around cultural community zones worldwide. Whether you are looking for a familiar neighborhood in a new city
            or a place that matches your culture and lifestyle — find your community first, then find your perfect stay.
            Use our smart filters to search by region, budget, amenities, and more.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
