import { Avatar, Box, Button, Card, Grid, LinearProgress, Rating, Typography } from '@mui/material'
import { HOTEL_DEFAULT_REVIEWS, HOTEL_RATING_BREAKDOWN } from 'src/@core/utils/constant'

const PropertyReviews = ({ reviews, totalReviews }) => {
  const list = reviews && reviews.length ? reviews : HOTEL_DEFAULT_REVIEWS
  const total = totalReviews || 124

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        Reviews
      </Typography>
      <Card variant='outlined' sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {HOTEL_RATING_BREAKDOWN.map((item, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant='subtitle2' sx={{ minWidth: 120 }}>
                  {item.label}
                </Typography>
                <LinearProgress variant='determinate' value={item.value} sx={{ flex: 1 }} />
                <Typography variant='caption'>{item.score}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {list.map((review, idx) => (
        <Card variant='outlined' sx={{ p: 3, mb: 2 }} key={idx}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, backgroundColor: '#27ae60' }}>{review.author.charAt(0)}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  {review.author}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly size='small' sx={{ mb: 1 }} />
              <Typography variant='body2' sx={{ color: '#666' }}>
                {review.comment}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}

      <Button variant='outlined' fullWidth sx={{ mt: 2, color: '#27ae60', borderColor: '#27ae60' }}>
        Show all {total} reviews
      </Button>
    </Box>
  )
}

export default PropertyReviews
