import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

export const columns = [
  { flex: 1, minWidth: 70, headerName: 'FOOTER LINK ID', field: 'NAV_ID' },
  { flex: 1, minWidth: 300, headerName: 'DESCRIPTION', field: 'NAV_DESCRIPTION' },
  { flex: 1, minWidth: 300, headerName: 'LINK', field: 'LINK' },
  { flex: 1, minWidth: 100, headerName: 'SORT ORDER', field: 'SORT_ORDER' },

  {
    flex: 1,
    minWidth: 120,
    align: 'center',
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
