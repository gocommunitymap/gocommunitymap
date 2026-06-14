import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

export const columns = [
  { flex: 1, headerName: 'CODE', field: 'PARAMETER_CODE_3' },
  { flex: 1, minWidth: 400, headerName: 'DESCRIPTION', field: 'PARAMETER_DESCRIPTION_3' },
  { flex: 1, headerName: 'FREQUENCY DAYS', field: 'PARAMETER_CODE_4' },
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
