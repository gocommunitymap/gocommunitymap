import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getHotelType, updateHotelType, deleteHotelType } from 'src/store'
import { toast } from 'react-hot-toast'
import { getColumns } from 'src/views/pages/website/hotel-params/static-data'
import { getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/hotel-params/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Hotel Type'

const defaultValues = {
  ID: null,
  PARAMETER_CODE_3: null,
  PARAMETER_DESCRIPTION_3: null,
  PARAMETER_DESCRIPTION_4: null,
  ACTIVE: true
}

const columns = getColumns('Icon (tabler name)')

const HotelType = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.hotelType)

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })

  const [deleteStates, setDeleteStates] = useState({
    ID: null,
    PARAMETER_CODE_3: null,
    PARAMETER_DESCRIPTION_3: null
  })

  useEffect(() => {
    dispatch(getHotelType()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.isSubmit])

  const handleEdit = row => {
    setValue('ID', row.ID)
    setValue('PARAMETER_CODE_3', row.PARAMETER_CODE_3)
    setValue('PARAMETER_DESCRIPTION_3', row.PARAMETER_DESCRIPTION_3)
    setValue('PARAMETER_DESCRIPTION_4', row.PARAMETER_DESCRIPTION_4 ?? null)
    setValue('ACTIVE', row.ACTIVE)
    setStates({ ...states, isEdit: true, isOpenModal: true, modalForm: 'c' })
  }

  const handleDiscard = () => {
    reset()
    setStates({ ...states, isOpenModal: false, isEdit: false })
  }

  const handleRefresh = () => {
    reset()
    setStates({ isOpenModal: false, isEdit: false, pageSize: 5, modalForm: 'c', isSubmit: false })
    setSearchStates({ searchText: '', filteredData: [] })
  }

  const onSubmit = data => {
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })
    dispatch(
      updateHotelType({
        ID: data.ID,
        PARAMETER_CODE_3: data.PARAMETER_CODE_3,
        PARAMETER_DESCRIPTION_3: data.PARAMETER_DESCRIPTION_3,
        PARAMETER_DESCRIPTION_4: data.PARAMETER_DESCRIPTION_4 ?? null,
        ACTIVE: data.ACTIVE
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()
      setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
    })
  }

  const handleConfirm = data => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({
      ID: data.ID,
      PARAMETER_CODE_3: data.PARAMETER_CODE_3,
      PARAMETER_DESCRIPTION_3: data.PARAMETER_DESCRIPTION_3
    })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteHotelType(deleteStates)).then(response => {
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
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }}>
              {isAllowed(permissions, 'U') && (
                <Tooltip title='Edit' placement='top'>
                  <IconButton color='primary' size='small' onClick={() => handleEdit(row)}>
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
      ]
    : columns

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(data => ({
    CODE: data.PARAMETER_CODE_3?.toString(),
    DESCRIPTION: data.PARAMETER_DESCRIPTION_3,
    'Icon (tabler name)': data.PARAMETER_DESCRIPTION_4,
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
              pageSizeOptions={[5, 10, 25]}
              slots={{ toolbar: DataGridHeaderToolbar }}
              getRowHeight={() => 'auto'}
              initialState={{
                pagination: { paginationModel: { pageSize: states.pageSize } }
              }}
              slotProps={{
                baseButton: { variant: 'outlined' },
                toolbar: {
                  onClick: () => setStates({ ...states, isOpenModal: true, modalForm: 'c' }),
                  onChange: event => handleSearch({ value: event.target.value, data: store?.data, setSearchStates }),
                  onPrint: () => print({ title: pageTitle, data: exportDataList }),
                  onPdf: () => generatePDF({ title: pageTitle, data: exportDataList }),
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
              getRowId={row => row.ID}
              columns={updateColumns}
            />
          </Card>
        </Grid>
        {/* -----Modal----- */}
        <>
          {states.modalForm === 'd' ? (
            <DeleteModal
              onDelete={onDelete}
              onCancel={() => setStates({ ...states, isOpenModal: false })}
              handleDiscard={handleDiscard}
              isSubmit={states.isSubmit}
              isOpenModal={states.isOpenModal}
              title={pageTitle}
            >
              <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
                <strong>
                  <span>CODE: {deleteStates.PARAMETER_CODE_3}</span>
                  <span style={{ paddingLeft: 30 }}>DESCRIPTION: {deleteStates.PARAMETER_DESCRIPTION_3}</span>
                </strong>
              </p>
            </DeleteModal>
          ) : (
            <ModalForm
              control={control}
              states={states}
              handleDiscard={handleDiscard}
              errors={errors}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              pageTitle={pageTitle}
              hasExtra
              extraLabel='Icon (tabler name)'
            />
          )}
        </>
      </Grid>
    </>
  )
}

export default HotelType
