import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

const getFlagLabel = value => {
  return String(value || '').toUpperCase() === 'Y' ? 'Yes' : 'No'
}

export const columns = [
  { flex: 1, headerName: 'CODE', field: 'PARAMETER_CODE_3' },
  { flex: 1, minWidth: 400, headerName: 'DESCRIPTION', field: 'PARAMETER_DESCRIPTION_3' },
  {
    flex: 1,
    minWidth: 120,
    headerName: 'HOTELS',
    field: 'PARAMETER_CODE_1',
    renderCell: ({ row }) => getFlagLabel(row.PARAMETER_CODE_1)
  },
  {
    flex: 1,
    minWidth: 120,
    headerName: 'RENTAL',
    field: 'PARAMETER_CODE_2',
    renderCell: ({ row }) => getFlagLabel(row.PARAMETER_CODE_2)
  },
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
