import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { getProductSetup, deleteProductSetup } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/product-setup/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import DeleteModal from 'src/views/components/modal/delete-modal'
import { useRouter } from 'next/router'

const pageTitle = 'Furniture Posts List'

const ProductSetup = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()
  const { replace } = useRouter()
  const store = useSelector(state => state.productSetup)

  const [states, setStates] = useState({
    pageSize: 5
  })

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({ PRODUCT_ID: null, TITLE: null })

  useEffect(() => {
    dispatch(getProductSetup()).then(response => {
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
    setPaginationModel({ page: 0, pageSize: 5 })
    setSearchStates({ searchText: '', filteredData: [] })
  }

  const handleConfirm = data => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({ PRODUCT_ID: data.PRODUCT_ID, TITLE: data.TITLE })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })

    dispatch(deleteProductSetup(deleteStates)).then(response => {
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

          minWidth: 100,
          align: 'right',
          headerAlign: 'right',
          headerName: 'Action',
          renderCell: ({ row }) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }}>
                {isAllowed(permissions, 'U') && (
                  <Tooltip title='Edit' placement='top'>
                    <IconButton
                      color='primary'
                      size='small'
                      onClick={() => replace(`/website/product-setup-furniture/form?id=${row.PRODUCT_ID}`)}
                    >
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                )}
                {isAllowed(permissions, 'D') && (
                  <Tooltip title='Delete' placement='top'>
                    <IconButton color='error' size='small' onClick={() => handleConfirm(row)}>
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
          PRODUCT ID:
          <span> {deleteStates.PRODUCT_ID}</span>
        </strong>
      </p>
      <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
        <strong>
          TITLE
          <span>: {deleteStates.TITLE}</span>
        </strong>
      </p>
    </DeleteModal>
  )

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(data => ({
    'PRODUCT ID': data.PRODUCT_ID,
    'FULL POSTCODE': data.FULLPOSTCODE,
    TITLE: data.TITLE,
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
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <DataGrid
                rowSelection={false}
                rows={dataList ?? []}
                pageSizeOptions={[5, 10, 25]}
                show
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='client'
                slots={{ toolbar: DataGridHeaderToolbar }}
                rowHeight={40}
                slotProps={{
                  baseButton: {
                    variant: 'contained'
                  },
                  toolbar: {
                    onClick: () => replace('/website/product-setup-furniture/form'),
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
                getRowId={row => `${row.PRODUCT_ID}`}
                columns={updateColumns}
              />
            </Box>
          </Card>
        </Grid>
        {/* -----Modal----- */}
        {renderModals}
      </Grid>
    </>
  )
}

export default ProductSetup
