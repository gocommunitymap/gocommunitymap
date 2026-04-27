import React from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Paper } from '@mui/material'

const CommunityMapListPanel = ({ properties, selectedProperty, onSelect }) => {
  return (
    <Paper elevation={1} sx={{ mt: 2, borderRadius: 3, overflow: 'auto', maxHeight: '70vh' }}>
      <List>
        {properties.map(property => (
          <ListItem
            key={property.id}
            button
            selected={selectedProperty && selectedProperty.id === property.id}
            onClick={() => onSelect(property)}
            sx={{
              bgcolor: selectedProperty && selectedProperty.id === property.id ? '#e0f7fa' : undefined,
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
          >
            <ListItemAvatar>
              <Avatar src={property.image} variant='rounded' />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography fontWeight={700}>{property.title}</Typography>}
              secondary={`$${property.price} | ${property.type}`}
            />
          </ListItem>
        ))}
        {properties.length === 0 && <Box sx={{ p: 3, textAlign: 'center', color: '#9ca3af' }}>No properties found</Box>}
      </List>
    </Paper>
  )
}

export default CommunityMapListPanel
