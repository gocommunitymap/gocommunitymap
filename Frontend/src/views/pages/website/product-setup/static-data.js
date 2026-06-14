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

const headerStyle = {
  whiteSpace: 'normal',
  lineHeight: '1.2',
  wordBreak: 'break-word'
}

export const columns = [
  // {
  //   sortable: false,
  //   filterable: false,
  //   flex: 1,
  //   minWidth: 100,
  //   innerHeight: 60,
  //   align: 'center',
  //   headerName: 'PICTURE',
  //   field: 'PICTURE_LINK',
  //   renderCell: ({ row }) => <ViewComponent row={row} />
  // },
  {
    flex: 1,
    minWidth: 110,
    headerName: 'PRODUCT ID',
    field: 'PRODUCT_ID',
    renderHeader: () => <span style={headerStyle}>PRODUCT ID</span>
  },
  {
    flex: 1,
    minWidth: 100,
    headerName: 'TITLE',
    field: 'TITLE'
  },
  {
    flex: 1,
    minWidth: 100,
    headerName: 'POST STATUS',
    field: 'POST_STATUS_DESC',
    renderHeader: () => <span style={headerStyle}>POST STATUS</span>
  },
  {
    flex: 1,
    minWidth: 100,
    headerName: 'CATEGORY',
    field: 'CATEGORY_NAME'
  },
  {
    flex: 1,
    minWidth: 100,
    headerName: 'SUB-CATEGORY',
    field: 'SUB_CATEGORY_NAME'
  },
  {
    flex: 1,
    minWidth: 120,
    headerName: 'FULL POSTCODE',
    field: 'FULLPOSTCODE',
    renderHeader: () => <span style={headerStyle}>FULL POSTCODE</span>
  },
  {
    flex: 1,
    minWidth: 120,
    headerName: 'STREET NAME',
    field: 'STREET_NAME',
    renderHeader: () => <span style={headerStyle}>STREET NAME</span>
  },
  {
    flex: 1,
    minWidth: 130,
    headerName: 'AREA, TOWN, CITY',
    field: 'AREA_TOWN_CITY',
    renderHeader: () => <span style={headerStyle}>AREA, TOWN, CITY</span>
  },
  {
    flex: 1,
    minWidth: 120,
    headerName: 'OWN, REFERENCE',
    field: 'OWN_REF',
    renderHeader: () => <span style={headerStyle}>OWN, REFERENCE</span>
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
  }
]
