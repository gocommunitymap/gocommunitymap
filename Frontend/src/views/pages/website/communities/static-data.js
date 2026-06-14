import { Button, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { getActiveProps } from 'src/@core/utils'
import { Modal } from 'src/views/components'

const ViewComponent = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Typography display='flex' justifyContent='left' alignItems='center'>
        <Tooltip title='View Image' placement='top'>
          <IconButton size='small' onClick={() => setIsOpen(true)}>
            <img
              src={row.PICTURE_LINK || '/images/default/default-news.jpg'}
              alt='community'
              style={{
                cursor: 'pointer',
                borderRadius: '50%',
                borderWidth: 2,
                borderRightStyle: 'solid',
                borderColor: 'gray'
              }}
              width={30}
              height={30}
            />
          </IconButton>
        </Tooltip>
      </Typography>

      {isOpen ? (
        <Modal onClose={() => setIsOpen(false)} isOpen={isOpen} title='COMMUNITY IMAGE'>
          <Grid container spacing={10}>
            <Grid item xs={12} display='flex' justifyContent='left'>
              <img
                className='rounded me-50'
                src={row.PICTURE_LINK || '/images/default/default-news.jpg'}
                alt='community'
                style={{ padding: 50, cursor: 'pointer' }}
                width='100%'
              />
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='center'>
              <Button type='reset' size='large' color='secondary' variant='outlined' onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Modal>
      ) : null}
    </>
  )
}

export const columns = [
  {
    sortable: false,
    filterable: false,
    flex: 1,
    minWidth: 100,
    innerHeight: 60,
    align: 'center',
    headerName: 'PICTURE',
    field: 'PICTURE_LINK',
    renderCell: ({ row }) => <ViewComponent row={row} />
  },
  { flex: 1, minWidth: 70, headerName: 'COMMUNITY ID', field: 'COMMUNITY_ID' },
  { flex: 1, minWidth: 220, headerName: 'NAME', field: 'COMMUNITY_NAME' },
  { flex: 1, minWidth: 260, headerName: 'LOCATION', field: 'LOCATION' },
  { flex: 1, minWidth: 140, headerName: 'MEMBERS', field: 'MEMBERS' },
  { flex: 1, minWidth: 160, headerName: 'REGION', field: 'REGION' },
  { flex: 1, minWidth: 140, headerName: 'COUNTRY CODE', field: 'COUNTRY_CODE' },
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
