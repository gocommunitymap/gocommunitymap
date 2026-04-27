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
  { flex: 1, minWidth: 70, headerName: 'PROPERTY ID', field: 'PROPERTY_ID' },
  { flex: 1, headerName: 'SITE STATUS', field: 'SITE_STATUS_DESC' },
  { flex: 1, headerName: 'FULL POSTCODE', field: 'FULLPOSTCODE' },
  { flex: 1, headerName: 'PROPERTY NAME', field: 'PROPERTY_NUM_NAME' },
  { flex: 1, headerName: 'STREET NAME', field: 'STREET_NAME' },
  { flex: 1, headerName: 'AREA, TOWN, CITY', field: 'AREA_TOWN_CITY' },
  { flex: 1, headerName: 'OWN, REFERENCE', field: 'OWN_REF' },

  // { flex: 1, headerName: 'LATITUDE', field: 'LATITUDE' },
  // { flex: 1, headerName: 'LONGITUDE', field: 'LONGITUDE' },
  // { flex: 1, headerName: 'PROPERTY TYPE', field: 'PROPERTY_TYPE_ID' },
  // { flex: 1, headerName: 'NEW BUILD', field: 'NEW_BUILD' },
  // { flex: 1, headerName: 'RETIREMENT HOME', field: 'RETIREMENT_HOME' },
  // { flex: 1, headerName: 'TENURE', field: 'TENURE_ID' },
  // { flex: 1, headerName: 'COUNCIL TAX BAND', field: 'COUNCIL_TAX_BAND_ID' },
  // { flex: 1, headerName: 'EXEMPTED', field: 'ISEXEMPT' },
  // { flex: 1, headerName: 'PRICE', field: 'PRICE' },
  // { flex: 1, headerName: 'RENTAL FREQUENCY', field: 'RENTAL_FREQUENCY_ID' },
  // { flex: 1, headerName: 'VIDEO VIRTUAL LINK', field: 'VIDEO_VIRTUALS_LINK' },
  // { flex: 1, headerName: 'BEDROOMS', field: 'BEDROOMS_ID' },
  // { flex: 1, headerName: 'BATHROOMS', field: 'BATHROOMS_ID' },
  // { flex: 1, headerName: 'RECEPTIONS', field: 'RECEPTIONS_ID' },
  // { flex: 1, headerName: 'FLOORS', field: 'FLOORS_ID' },
  // { flex: 1, headerName: 'SIZE', field: 'SIZE' },
  // { flex: 1, headerName: 'UNITS', field: 'UNITS_ID' },
  // { flex: 1, headerName: 'LISTING TYPE', field: 'LISTING_TYPE_ID' },

  // { flex: 1, headerName: 'SUMMARY', field: 'SUMMARY' },
  // { flex: 1, headerName: 'FULL DESCRIPTION', field: 'FULLDESCRIPTION' },
  // { flex: 1, headerName: 'CURRENT ERR RATING', field: 'CURRENT_ERR_RATING' },
  // { flex: 1, headerName: 'POTENTIAL ERR RATING', field: 'POTENTIAL_ERR_RATING' },
  // { flex: 1, headerName: 'CONTENT FILE LINK', field: 'CONTENT_FILE_LINK' },

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
