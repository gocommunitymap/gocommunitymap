// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CircularProgress } from '@mui/material/'
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

  const handleSearch = () => {
    if (selected && searchState) {
      const _params = jsonToQueryString({
        location: searchState.formattedAddress
      })

      router.replace(`/${selected}/properties${_params}`)
    }
  }

  if (!isLoaded) {
    return (
      <Card
        sx={{
          position: 'relative',
          bgcolor: 'transparent',
          height: 500,
          minHeight: { xs: 610, md: 400 }
        }}
      >
        <CardContent
          sx={{ p: theme => `${theme.spacing(7, 7.5)} !important`, height: '100%' }}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          {' '}
          <CircularProgress color='secondary' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        height: '100vh',
        minHeight: { xs: 610, md: 400 }
      }}
      display='flex'
      justifyContent='center'
    >
      <Box pt={40}>
        <Grid container spacing={6} textAlign='center'>
          <Grid item xs={12}>
            <Typography variant='h4' fontWeight='bold' color='white'>
              Search, Find, Move with Go Community Map
            </Typography>
            <Typography variant='h6' color='white'>
              Find homes to buy or rent and check house prices
            </Typography>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <Card sx={{ p: 0, maxWidth: 700, width: { xs: '100%', md: 700 } }}>
              <CustomRadioWithImages selected={selected} setSelected={setSelected} data={data} />
              <Grid container>
                <Grid item xs={12} sx={{ p: 5, display: 'flex', justifyContent: 'flex-start' }}>
                  <Grid container>
                    <Grid item xs={12} sm={8}>
                      <Autocomplete
                        options={{
                          componentRestrictions: { country: countryISO }
                        }}
                        onPlaceChanged={onPlaceChanged}
                        onLoad={onLoad}
                      >
                        <TextField
                          id='icons-start-adornment'
                          size='small'
                          placeholder='Find Location'
                          sx={{ width: '100%' }} // Set your desired width here
                          //fullWidth
                          InputProps={{
                            endAdornment: !isLoaded && <CircularProgress color='secondary' />
                          }}
                        />
                      </Autocomplete>
                    </Grid>
                    <Grid item xs={12} sm={4} px={{ xs: 'inherit', md: 2 }} textAlign='center'>
                      {isLoaded && (
                        <Button
                          variant='contained'
                          size='small'
                          sx={{
                            width: '100%',
                            my: { xs: 1, md: 'inherit' },
                            py: 2.3,
                            px: 15
                          }}
                          onClick={handleSearch}
                        >
                          <IconifyIcon width='20' style={{ padding: 0 }} icon='tabler:home-search' />
                          Search
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
