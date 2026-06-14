import { green, red } from '@mui/material/colors'
import { dateConvert, dateconvert, getActiveProps } from 'src/@core/utils'
import { Chip } from '@mui/material'

export const columns = [
  { minWidth: 200, headerName: 'ROLE CODE', field: 'role_code' },
  { flex: 1, minWidth: 200, headerName: 'ROLE NAME', field: 'role_name' },
  {
    headerName: 'ACTIVE',
    field: 'activeLabel',
    renderCell: ({ row }) => {
      const activeProps = getActiveProps(row.active)

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
  },

  {
    minWidth: 120,
    headerName: 'CREATED DATE',
    field: 'created_on',
    type: 'date',
    valueGetter: ({ row }) => row?.created_on && new Date(row.created_on),
    renderCell: ({ row }) => dateConvert(row.created_on)
  }
]
