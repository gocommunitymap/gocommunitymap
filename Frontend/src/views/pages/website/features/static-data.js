import { Chip } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { getActiveProps } from 'src/@core/utils'

export const columns = [
  { minWidth: 120, headerName: 'FEATURES ID', field: 'FEATURES_ID' },
  { minWidth: 200, headerName: 'FEATURE TYPE', field: 'FEATURES_TYPE' },
  { minWidth: 170, headerName: 'ALLOWED IN', field: 'ALLOWED' },
  { flex: 1, minWidth: 250, headerName: 'FEATURE NAME', field: 'FEATURES' },
  {
    minWidth: 120,
    headerName: 'HIGHLIGHTED',
    field: 'IS_HIGHLIGHTED',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      const activeProps = getActiveProps(row.IS_HIGHLIGHTED)

      return activeProps.icon
    }
  },
  {
    flex: 1,
    minWidth: 250,
    headerName: 'ICON',
    field: 'ICON',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => <IconifyIcon icon={`tabler:${row.ICON}`} />
  },
  {
    minWidth: 120,
    headerName: 'ACTIVE',
    field: 'ACTIVE',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => {
      const activeProps = getActiveProps(row.ACTIVE)

      return activeProps.icon
    }
  }
]
