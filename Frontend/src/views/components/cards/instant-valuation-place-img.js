// ** MUI Imports
import { Box, Card, Typography, Grid } from '@mui/material'

export const InstantValuationPlaceImg = () => {
  // ** Hook

  return (
    <Card sx={{ height: 270 }}>
      <Grid container>
        <Grid item xs={12}>
          <img
            alt=''
            style={{
              height: '100%' /* Sets the image height to 100% of the container's height */,
              width: '100%',
              objectFit: 'cover'
            }}
            src={`/images/banners/banner-12.jpg`}
          />
        </Grid>
      </Grid>
    </Card>
  )
}
