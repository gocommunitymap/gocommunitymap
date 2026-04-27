import ShareButton from '../buttons/share-button'
import SaveToggle from '../SaveToggle'

const { Typography, Rating, Button } = require('@mui/material')
const { Box } = require('@mui/system')

const PropertyDetailHeader = ({ property, title, ratings, place }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'top' }}>
      <Box xs={{ maxWidth: 300 }}>
        <Typography variant='h6' fontWeight='bold' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant='body2'>{place}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 34 }}>
        <Rating size='small' value={ratings} readOnly />
        <ShareButton />

        <SaveToggle propertyId={property?.PROPERTY_ID} title={property.PROPERTY_NUM_NAME} isSaved={property?.SAVED} />
        <Button variant='contained' size='small' sx={{ fontSize: 9, width: 100, height: 34 }}>
          Reserve Now
        </Button>
      </Box>
    </Box>
  )
}

export default PropertyDetailHeader
