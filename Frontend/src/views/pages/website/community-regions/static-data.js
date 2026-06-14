import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

export const columns = [
  { flex: 1, minWidth: 180, headerName: 'REGION CODE', field: 'PARAMETER_CODE_3' },
  { flex: 1, minWidth: 420, headerName: 'REGION NAME', field: 'PARAMETER_DESCRIPTION_3' },
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
          sx={{ backgroundColor: activeProps.backgroundColor, color: activeProps.color }}
          label={activeProps.label}
          variant='filled'
        />
      )
    }
  }
]
