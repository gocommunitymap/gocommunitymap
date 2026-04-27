import { Avatar, Box, Button, Card, Grid, LinearProgress, Rating, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const sampleReviews = [
  {
    author: 'Sarah Jenkins',
    rating: 5,
    comment: 'Lovely stay, the garden is beautiful. Very spacious and cozy throughout.',
    date: 'March 2026'
  },
  {
    author: 'Emily Towada',
    rating: 5,
    comment: 'Modern amenities and perfect for my family. Highly recommend for a relaxing vacation.',
    date: 'February 2026'
  },
  { author: 'Elena Rodriguez', rating: 5, comment: 'Great space and very welcoming hosts.', date: 'January 2026' },
  {
    author: 'David Miller',
    rating: 5,
    comment: 'Clean, spacious and beautiful. We had a wonderful time here. Lovely garden setup!',
    date: 'December 2025'
  }
]

const ratingCategories = [
  { label: 'Cleanliness', value: 85, score: '4.3' },
  { label: 'Accuracy', value: 90, score: '4.5' },
  { label: 'Communication', value: 98, score: '4.9' },
  { label: 'Location', value: 92, score: '4.6' },
  { label: 'Check-in', value: 94, score: '4.7' },
  { label: 'Value', value: 88, score: '4.4' }
]

const Reviews = ({ data }) => {
  const [showAll, setShowAll] = useState(false)
  const displayedReviews = showAll ? sampleReviews : sampleReviews.slice(0, 4)

  return (
    <Box>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
        Guest Reviews
      </Typography>
      <Card variant='outlined' sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {ratingCategories.map((cat, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  {cat.label}
                </Typography>
                <LinearProgress variant='determinate' value={cat.value} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                <Typography variant='caption' sx={{ minWidth: 28 }}>
                  {cat.score}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {displayedReviews.map((review, idx) => (
        <Card variant='outlined' sx={{ p: 3, mb: 2 }} key={idx}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, backgroundColor: '#27ae60' }}>{review.author.charAt(0)}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant='subtitle2' fontWeight={600}>
                  {review.author}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {review.date}
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

      {sampleReviews.length > 4 && (
        <Button
          variant='outlined'
          fullWidth
          sx={{ mt: 2, color: '#27ae60', borderColor: '#27ae60' }}
          onClick={() => setShowAll(p => !p)}
        >
          {showAll ? 'Show fewer reviews' : `Show all ${sampleReviews.length} reviews`}
        </Button>
      )}
    </Box>
  )
}

export default Reviews
