// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { TextField, Typography } from '@mui/material'
import { CompanySettings, ApplicationSettings } from 'src/views/pages/admin/applicationsetup'

const ApplicationSetup = () => {
  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
      <Card sx={{width:'100%'}}>
        <CardHeader title='Company Settings' />
        <CardContent>
        <CompanySettings />
        </CardContent>
      </Card>
      </Grid> */}
      <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
        <Card sx={{ width: '100%' }}>
          <CardHeader title='Application Settings' />
          <CardContent>
            <ApplicationSettings />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ApplicationSetup
