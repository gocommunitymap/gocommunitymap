import { Chip, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { fieldTypeOptions, getActiveProps, getFieldTypeOptions } from 'src/@core/utils'

export const columns = [
  { flex: 1, headerName: 'ID ', field: 'UAP_ID' },
  { flex: 1, headerName: 'DESCRIPTION', field: 'DESCRIPTION' },
  { flex: 1, headerName: 'TYPE', field: 'UAP_TYPE_DESC' },
  { flex: 1, headerName: 'TOOLTIP TEXT', field: 'TOOLTIP_TEXT' },
  {
    flex: 1,
    headerName: 'FIELD TYPE',
    field: 'FIELD_TYPE',
    renderCell: ({ row }) => (
      <Typography display='flex' alignItems='center'>
        <IconifyIcon icon={fieldTypeOptions.find(i => i.value == row.FIELD_TYPE)?.icon} />

        {fieldTypeOptions.find(i => i.value == row.FIELD_TYPE)?.label}
      </Typography>
    )
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
