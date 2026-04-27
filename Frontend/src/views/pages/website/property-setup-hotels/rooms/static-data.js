import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

export const columns = [
  { flex: 1, minWidth: 60, headerName: 'ID', field: 'ROOM_ID' },
  { flex: 2, minWidth: 150, headerName: 'ROOM NAME', field: 'ROOM_NAME' },
  { flex: 1, minWidth: 110, headerName: 'ROOM TYPE', field: 'ROOM_TYPE_DESC' },
  { flex: 1, minWidth: 100, headerName: 'BED TYPE', field: 'BED_TYPE_DESC' },
  { flex: 1, minWidth: 90, headerName: 'MAX GUESTS', field: 'MAX_GUESTS' },
  { flex: 1, minWidth: 80, headerName: 'PRICE', field: 'PRICE' },
  { flex: 1, minWidth: 70, headerName: 'SIZE', field: 'SIZE' },
  {
    flex: 1,
    minWidth: 80,
    align: 'center',
    headerName: 'ACTIVE',
    field: 'ACTIVE',
    renderCell: ({ row }) => {
      const p = getActiveProps(row.ACTIVE)

      return (
        <Chip
          size='small'
          sx={{ backgroundColor: p.backgroundColor, color: p.color }}
          label={p.label}
          variant='filled'
        />
      )
    }
  }
]
