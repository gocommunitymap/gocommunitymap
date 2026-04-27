import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getPropertySetupHotels, updatePropertySetupHotels, deletePropertySetupHotels } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/property-setup-hotels/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/property-setup-hotels/form'
import DeleteModal from 'src/views/components/modal/delete-modal'
import { useRouter } from 'next/router'

const pageTitle = 'Hotels Listing'

const PropertySetupHotels = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()
  const { replace } = useRouter()
  const store = useSelector(state => state.propertySetupHotels)

  const [states, setStates] = useState({
    pageSize: 5
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({ PROPERTY_ID: null, PROPERTY_NUM_NAME: null })

  useEffect(() => {
    dispatch(getPropertySetupHotels()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.isSubmit])

  const handleRefresh = () => {
    setStates({
      pageSize: 5
    })
    setSearchStates({ searchText: '', filteredData: [] })
  }

  const handleConfirm = data => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({ PROPERTY_ID: data.PROPERTY_ID, PROPERTY_NUM_NAME: data.PROPERTY_NUM_NAME })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deletePropertySetupHotels(deleteStates)).then(response => {
      if (response.payload !== false) handleRefresh()
    })
  }

  const updateColumns = isAllowed(permissions, 'U')
    ? [
        ...columns,
        {
          sortable: false,
          filterable: false,
          editable: false,
          disableColumnMenu: false,
          flex: 1,
          minWidth: 100,
          align: 'right',
          headerAlign: 'right',
          headerName: 'Action',
          renderCell: ({ row }) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row' }}>
                {isAllowed(permissions, 'U') && (
                  <Tooltip title='Edit' placement='top'>
                    <IconButton
                      size='small'
                      onClick={() => replace(`/website/property-setup-hotels/form?id=${row.PROPERTY_ID}`)}
                    >
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                )}
                {isAllowed(permissions, 'D') && (
                  <Tooltip title='Delete' placement='top'>
                    <IconButton size='small' onClick={() => handleConfirm(row)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )
          }
        }
      ]
    : columns

  const renderModals = states.modalForm === 'd' && (
    <DeleteModal
      onsubmit={onsubmit}
      onDelete={onDelete}
      onCancel={() => setStates({ ...states, isOpenModal: false })}
      isSubmit={states.isSubmit}
      isOpenModal={states.isOpenModal}
      title={pageTitle}
    >
      <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
        <strong>
          PROPERTY ID:
          <span> {deleteStates.PROPERTY_ID}</span>
        </strong>
      </p>
      <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
        <strong>
          PROPERTY NAME
          <span>: {deleteStates.PROPERTY_NUM_NAME}</span>
        </strong>
      </p>
    </DeleteModal>
  )

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(data => ({
    'PROPERTY ID': data.PROPERTY_ID,
    'LISTING TYPE': data.LISTING_TYPE_DESC,
    'SITE STATUS': data.SITE_STATUS_DESC,
    'LISTING STATUS': data.LISTING_STATUS_DESC,
    'FULL POSTCODE': data.FULLPOSTCODE,
    'PROPERTY NAME': data.PROPERTY_NUM_NAME,
    'STREET NAME': data.STREET_NAME,
    'AREA, TOWN, CITY': data.AREA_TOWN_CITY,
    'OWN, REFERENCE': data.OWN_REF,
    ACTIVE: getActiveProps(data.ACTIVE).label
  }))

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={pageTitle} />
            <DataGrid
              rowSelection={false}
              rows={dataList ?? []}
              pageSize={states.pageSize}
              pageSizeOptions={[5, 10, 25]}
              components={{ Toolbar: DataGridHeaderToolbar }}
              onPageSizeChange={newPageSize => setStates({ ...states, pageSize: newPageSize })}
              getRowHeight={() => 'auto'}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: states.pageSize
                  }
                }
              }}
              componentsProps={{
                baseButton: {
                  variant: 'outlined'
                },
                toolbar: {
                  onClick: () => replace('/website/property-setup-hotels/form'),
                  onChange: event => handleSearch({ value: event.target.value, data: store?.data, setSearchStates }),
                  onPrint: () =>
                    print({
                      title: pageTitle,
                      data: exportDataList
                    }),
                  onPdf: () =>
                    generatePDF({
                      title: pageTitle,
                      data: exportDataList
                    }),
                  onRefresh: handleRefresh,
                  clearSearch: () => handleSearch({ value: '', data: store?.data, setSearchStates }),
                  exportTitle: pageTitle,
                  exportData: exportDataList,
                  columns,
                  value: searchStates.searchText,

                  permissions: { C: isAllowed(permissions, 'C'), E: isAllowed(permissions, 'E') }
                }
              }}
              autoHeight
              rowHeight={32}
              getRowId={row => `${row.PROPERTY_ID}`}
              columns={updateColumns}
              disableSelectionOnClick
            />
          </Card>
        </Grid>
        {/* -----Modal----- */}
        {renderModals}
      </Grid>
    </>
  )
}

export default PropertySetupHotels
