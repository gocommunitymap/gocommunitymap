// ** MUI Imports
import { Box, Card, Typography, Grid } from '@mui/material'

export const SearchAgentValuationCard = () => {
  // ** Hook

  return (
    <Card sx={{ height: { xs: '100%', md: 270 } }}>
      <Grid container>
        <Grid item md={6} xs={12} bgcolor='#f7f6f5'>
          <Box p={10}>
            <Typography variant='h4' color='black'>
              Get a free valuation
            </Typography>
            <Typography variant='subtitle1' color='black' mt={4}>
              Get the most accurate valuation from local agents based on:
              <ul style={{ marginTop: 0 }}>
                <li>Your unique property features</li>
                <li>Their in-depth knowledge of the area</li>
                <li>The latest changes in the local market</li>
              </ul>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <img
            alt=''
            style={{
              height: 'auto' /* Sets the image height to 100% of the container's height */,
              width: '100%',
              objectFit: 'cover' /* Ensures the image covers the entire container */
            }}
            src={`/images/pages/value-your-home.jpg`}
          />
        </Grid>
      </Grid>
    </Card>
  )
}
