import { Card, Collapse, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'

const TRUNCATE_LENGTH = 400

const PropertyAbout = ({ summary }) => {
  const [expanded, setExpanded] = useState(false)

  const text =
    summary ||
    'Escape to the tranquility of this property, a meticulously restored traditional residence nestled in a peaceful location. The property combines traditional architecture with modern amenities to give you a unique and comfortable experience.'

  const isTruncatable = text.length > TRUNCATE_LENGTH
  const displayed = expanded || !isTruncatable ? text : `${text.slice(0, TRUNCATE_LENGTH)}…`

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
        About This Property
      </Typography>
      <Typography variant='body2' sx={{ lineHeight: 1.8, mb: 2, color: '#555' }}>
        {displayed}
      </Typography>
      {isTruncatable && (
        <Typography
          variant='body2'
          sx={{ color: '#27ae60', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded ? 'Read less ↑' : 'Read more →'}
        </Typography>
      )}
    </Card>
  )
}

export default PropertyAbout
