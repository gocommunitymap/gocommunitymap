import { Button, Card, Chip, Grid, Icon, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { dateConvert, getActiveProps } from 'src/@core/utils'
import { Modal } from 'src/views/components'

const ViewComponent = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Typography display='flex' justify-content='left' alignItems='center'>
        {/* {renderClient(row)} */}
        <Tooltip title='View Detail' placement='top'>
          <IconButton size='small' onClick={() => setIsOpen(true)}>
            <img
              src={row.PICTURE_LINK}
              alt='image'
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

      {isOpen === true ? (
        <Modal onClose={() => setIsOpen(false)} isOpen={isOpen} title='PICTURE'>
          <Grid container spacing={10}>
            <Grid item xs={12} display='flex' justifyContent='left'>
              <img
                className='rounded me-50'
                src={row.PICTURE_LINK}
                alt='image'
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
      ) : (
        <></>
      )}
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
  { flex: 1, minWidth: 70, headerName: 'ID', field: 'NEWS_ID' },
  { flex: 1, minWidth: 300, headerName: 'TITLE', field: 'NEWS_TITLE' },
  {
    flex: 1,
    minWidth: 130,
    headerName: 'DATE',
    field: 'NEWS_DATE',
    valueGetter: ({ row }) => row.NEWS_DATE && new Date(row.NEWS_DATE),
    renderCell: ({ row }) => dateConvert(row.NEWS_DATE)
  },
  { flex: 1, minWidth: 100, headerName: 'SORT ORDER', field: 'SORT_ORDER' },
  {
    flex: 1,
    minWidth: 130,
    headerName: 'ACTIVE FROM',
    field: 'ACTIVE_FROM',
    valueGetter: ({ row }) => row.ACTIVE_FROM && new Date(row.ACTIVE_FROM),
    renderCell: ({ row }) => dateConvert(row.ACTIVE_FROM)
  },
  {
    flex: 1,
    minWidth: 130,
    headerName: 'ACTIVE TO',
    field: 'ACTIVE_TO',
    valueGetter: ({ row }) => row.ACTIVE_TO && new Date(row.ACTIVE_TO),
    renderCell: ({ row }) => dateConvert(row.ACTIVE_TO)
  },
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
  },
  {
    flex: 1,
    minWidth: 150,
    headerName: 'CREATED DATE',
    field: 'CREATED_ON',
    type: 'date',
    valueGetter: ({ row }) => row.CREATED_ON && new Date(row.CREATED_ON),
    renderCell: ({ row }) => dateConvert(row.CREATED_ON)
  }
]
