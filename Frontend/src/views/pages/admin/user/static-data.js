import { Chip } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { dateConvert } from 'src/@core/utils'

export const statusOptions = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' },
  { value: 2, label: 'Locked' }
]

export const columns = [
  { minWidth: 80, headerName: 'User CODE', field: 'USER_CODE' },
  { minWidth: 200, headerName: 'User Name', field: 'USER_NAME' },
  { minWidth: 200, headerName: 'User Role', field: 'ROLE_NAME', renderCell: ({ row }) => row.ROLE_NAME },
  { minWidth: 120, headerName: 'User Type', field: 'USER_TYPE_DESC' },
  { minWidth: 200, headerName: 'Email', field: 'EMAIL' },
  { minWidth: 150, headerName: 'Contact No.', field: 'CONTACT_NO' },
  {
    minWidth: 120,
    align: 'center',
    headerName: 'STATUS',
    field: 'status',
    renderCell: ({ row }) => (
      <Chip
        size='small'
        sx={{
          width: 80,
          backgroundColor: row.STATUS === 1 ? green[100] : red[100],
          color: row.STATUS === 1 ? green[500] : red[500]
        }}
        label={statusOptions.find(i => i.value == row.STATUS).label}
        variant='filled'
      />
    )
  },
  {
    minWidth: 150,
    headerName: 'CREATED DATE',
    field: 'CREATED_ON',
    type: 'date',
    valueGetter: ({ row }) => row.CREATED_ON && new Date(row.CREATED_ON),
    renderCell: ({ row }) => dateConvert(row.CREATED_ON)
  }
]
