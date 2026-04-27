import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getFeatures, updateFeatures, deleteFeatures } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/features/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/features/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Features'

const defaultValues = {
  FEATURES_ID: null,
  FEATURES: null,
  FEATURES_TYPE_ID: null,
  IS_HIGHLIGHTED: false,
  ICON: null,
  ACTIVE: true
}

const Features = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.features)

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({ ID: null, PARAMETER_CODE_3: null, PARAMETER_DESCRIPTION_3: null })
  useEffect(() => {
    dispatch(getFeatures({ TYPE: 0 })).then(response => {
      if (response?.error) {
        toast.error(response.error.message)
      }
    })
  }, [dispatch])

  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.isSubmit])

  const handleEdit = row => {
    setValue('FEATURES_ID', row.FEATURES_ID)
    setValue('FEATURES', row.FEATURES)
    setValue('FEATURES_TYPE_ID', { value: row.FEATURES_TYPE_ID, label: row.FEATURES_TYPE })
    setValue('IS_HIGHLIGHTED', row.IS_HIGHLIGHTED)
    setValue('ICON', { value: row.ICON, label: row.ICON })
    setValue('ACTIVE', row.ACTIVE)
    setStates({ ...states, isEdit: true, isOpenModal: true, modalForm: 'c' })
  }

  const handleDiscard = () => {
    reset()
    setStates({ ...states, isOpenModal: false, isEdit: false })
  }

  const handleRefresh = () => {
    reset()
    setStates({
      isOpenModal: false,
      isEdit: false,
      pageSize: 5,
      modalForm: 'c',
      isSubmit: false
    })
    setSearchStates({ searchText: '', filteredData: [] })
  }

  const onSubmit = data => {
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })
    dispatch(
      updateFeatures({
        FEATURES_ID: data.FEATURES_ID,
        FEATURES: data.FEATURES,
        FEATURES_TYPE_ID: data.FEATURES_TYPE_ID.value,
        IS_HIGHLIGHTED: data.IS_HIGHLIGHTED,
        ICON: data.ICON.value.split(':')[1],
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
      FEATURES_ID: data.FEATURES_ID,
      FEATURES: data.FEATURES
    })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteFeatures(deleteStates)).then(response => {
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
                    <IconButton size='small' onClick={() => handleEdit(row)}>
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

  const renderModals = (
    <>
      {states.modalForm === 'd' ? (
        <DeleteModal
          onsubmit={onsubmit}
          onDelete={onDelete}
          onCancel={() => setStates({ ...states, isOpenModal: false })}
          handleDiscard={handleDiscard}
          isSubmit={states.isSubmit}
          isOpenModal={states.isOpenModal}
          title={pageTitle}
        >
          <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
            <strong>
              <span>FEATURES ID: {deleteStates.FEATURES_ID}</span>
              <span style={{ paddingLeft: 30 }}>FEATURES: {deleteStates.FEATURES}</span>
            </strong>
          </p>
        </DeleteModal>
      ) : (
        <ModalForm
          control={control}
          states={states}
          setStates={setStates}
          handleDiscard={handleDiscard}
          errors={errors}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          pageTitle={pageTitle}
          setValue={setValue}
          watch={watch}
        />
      )}
    </>
  )

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(data => ({
    'FEATURES ID': data.FEATURES_ID,
    'FEATURES TYPE': data.FEATURES_TYPE,
    'ALLOWED IN': data.ALLOWED,
    FEATURES: data.FEATURES,
    HIGHLIGHTED: getActiveProps(data.IS_HIGHLIGHTED).label,
    ICON: data.ICON,
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
                  onClick: () => setStates({ ...states, isOpenModal: true, modalForm: 'c' }),
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
              getRowId={row => row.FEATURES_ID}
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

export default Features
