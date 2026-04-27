import { Card, CardContent, Grid, Typography } from '@mui/material'

export const NoRecordCard = ({ title = 'Not Found!', subtitle = '', variant = 'elevation', borderLess = false }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card
          variant={variant}
          sx={{
            border: borderLess ? 'none' : '',
            minHeight: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4'>{title}</Typography>
            <Typography variant='subtitle1'>{subtitle}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
