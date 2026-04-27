import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

export const columns = [
  { flex: 1, headerName: 'UTILITY ID ', field: 'UTILITY_ID' },
  { flex: 1, minWidth: 400, headerName: 'UTILITIES', field: 'UTILITIES' },
  { flex: 1, minWidth: 400, headerName: 'UTILITY TYPE', field: 'UTILITY_TYPE' },
  {
    flex: 1,
    minWidth: 120,
    headerName: 'ACTIVE',
    field: 'ACTIVE',
    renderCell: ({ row }) => {
      const activeProps = getActiveProps(row.ACTIVE)

      return (
        <Chip
          size='small'
          sx={{
            backgroundColor: activeProps.backgroundColor,
            color: activeProps.color
          }}
          label={activeProps.label}
          variant='filled'
        />
      )
    }
  }
]
