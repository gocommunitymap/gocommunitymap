import { Card, Collapse, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'

const TRUNCATE_LENGTH = 400

const PropertyAbout = ({ summary }) => {
  const [expanded, setExpanded] = useState(false)

  const text = summary || ''

  const isTruncatable = text.length > TRUNCATE_LENGTH

  return (
    <Card variant='outlined' sx={{ p: 3, mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
        About This Property
      </Typography>
      <Typography variant='body2' sx={{ lineHeight: 1.8, mb: 2, color: '#555' }}>
        <div
          dangerouslySetInnerHTML={{
            __html: text?.replaceAll('\\n', '<br>')
          }}
        ></div>
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
