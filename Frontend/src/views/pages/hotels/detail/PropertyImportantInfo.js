import { Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'

const TRUNCATE_LENGTH = 350

const PropertyImportantInfo = ({ info }) => {
  const [showMore, setShowMore] = useState(false)

  const text =
    info ||
    'Please note that local accommodation tax applies to applicable fee and must be paid upon check-in. In case of any requests or special requests during your stay, our team is happy to help. All guests and beddings must be declared in advance. Access to additional services and facilities beyond our standard listing is available upon request, please call our team for further details on additional charges.'

  const isTruncatable = text.length > TRUNCATE_LENGTH
  const displayed = showMore || !isTruncatable ? text : `${text.slice(0, TRUNCATE_LENGTH)}…`

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        Important Information
      </Typography>
      <Typography variant='body2' sx={{ mb: 2, lineHeight: 1.8, color: '#555' }}>
        {displayed}
      </Typography>
      {isTruncatable && (
        <Typography
          variant='body2'
          sx={{ color: '#27ae60', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => setShowMore(prev => !prev)}
        >
          {showMore ? 'Show less' : 'Show more'}
        </Typography>
      )}
    </Card>
  )
}

export default PropertyImportantInfo
