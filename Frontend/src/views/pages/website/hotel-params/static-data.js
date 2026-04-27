import { Chip } from '@mui/material'
import { getActiveProps } from 'src/@core/utils'

const activeColumn = {
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

export const baseColumns = [
  { flex: 1, headerName: 'CODE', field: 'PARAMETER_CODE_3' },
  { flex: 1, minWidth: 400, headerName: 'DESCRIPTION', field: 'PARAMETER_DESCRIPTION_3' },
  activeColumn
]

export const getColumns = (extraLabel = null) => {
  if (!extraLabel) return baseColumns

  return [
    baseColumns[0],
    baseColumns[1],
    { flex: 1, minWidth: 200, headerName: extraLabel, field: 'PARAMETER_DESCRIPTION_4' },
    activeColumn
  ]
}
