import RoomsDetailTable from '../../RoomsDetailTable'
import { Box, Typography } from '@mui/material'

const OptionAndPrice = ({ data, rooms = [], searchParams = {}, onRoomSelect, onReserve }) => {
  return (
    <Box>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
        Room Options & Pricing
      </Typography>
      <RoomsDetailTable
        data={data}
        rooms={rooms}
        searchParams={searchParams}
        onRoomSelect={onRoomSelect}
        onReserve={onReserve}
      />
    </Box>
  )
}

export default OptionAndPrice
