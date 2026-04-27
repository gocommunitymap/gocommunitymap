// ** MUI Imports
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  TextField,
  InputLabel,
  Box,
  Typography,
  Chip,
  Divider,
  Alert,
  AlertTitle,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import { useTheme } from '@mui/material/styles'

import { blue, green, grey, red } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { decUserData } from 'src/@core/utils'
import { changePasswordAPI, getUserAPI } from 'src/configs'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import { statusOptions } from 'src/views/pages/admin/user/static-data'
import { NoRecordCard, PropertyCard, PropertySmallCard } from 'src/views/components'
import { useDispatch } from 'react-redux'
import { getPropertiesByUser } from 'src/store/guest/property/savedproperties'

const pageTitle = 'Saved Properties'

const SavedProperties = () => {
  const dispatch = useDispatch()
  const [savedProperties, setSavedProperties] = useState({ data: [], isLoading: false })

  useEffect(() => {
    setSavedProperties({ ...savedProperties, isLoading: true })
    dispatch(getPropertiesByUser()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }

      setSavedProperties({ data: response?.payload, isLoading: false })
    })

    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box display='flex' alignItems='center'>
                Saved listings
              </Box>
            }
          />
          <CardContent>
            {savedProperties?.data?.length > 0 ? (
              savedProperties?.data?.map((row, index) => (
                <Grid item xs={12} key={row.PROPERTY_ID}>
                  <PropertyCard data={row} />
                </Grid>
              ))
            ) : (
              <NoRecordCard
                title='No listings saved'
                subtitle='Hit the ❤︎︎ to save your favorite properties and find them faster next time.'
                variant='outlined'
                borderLess={true}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SavedProperties
