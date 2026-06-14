import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/admin/role/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'

import { getRole, getRoleMaster, updateRole, deleteRole } from 'src/store'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/admin/role/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Role & Permissions'

const defaultValues = {
  role_code: null,
  role_name: '',
  active: true,
  created_on: null,
  detail: []
}

const Role = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.role)

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 20,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({})
  useEffect(() => {
    dispatch(getRole()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }
    })
  }, [dispatch])

  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.isSubmit])

  const handleEdit = row => {
    setValue('role_code', row.role_code)
    setValue('role_name', row.role_name)
    setValue('active', row.active)
    setValue('created_on', new Date(row.created_on))
    setValue('detail', row.detail)

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
      pageSize: 20,
      modalForm: 'c',
      isSubmit: false
    })
    setSearchStates({ searchText: '', filteredData: [] })
  }

  const onSubmit = data => {
    const filteredData = data.detail?.filter(i => i.permissions.length > 0)
    const detail = filteredData?.map(i => ({ form_id: i.form_id, permissions: i.permissions }))
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })
    dispatch(
      updateRole({
        role_code: data.role_code,
        role_name: data.role_name,
        active: data.active,
        role_detail: detail
      })
    ).then(response => {
      if (response?.payload !== false) {
        isOpenModal = false
        reset()
        setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
      } else {
        setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
      }
    })
  }

  const handleConfirm = ({ data }) => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({
      role_code: data.role_code,
      role_name: data.role_name
    })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })

    dispatch(deleteRole(deleteStates)).then(response => {
      if (response.payload !== false) setStates({ ...states, isSubmit: false, isOpenModal: false })
    })
  }

  const updateColumns =
    isAllowed(permissions, 'U') || isAllowed(permissions, 'D')
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
                      <IconButton color='primary' size='small' onClick={() => handleEdit(row)}>
                        <Icon icon='tabler:edit' />
                      </IconButton>
                    </Tooltip>
                  )}
                  {isAllowed(permissions, 'D') && (
                    <Tooltip title='Delete' placement='top'>
                      <IconButton color='error' size='small' onClick={() => handleConfirm({ data: row })}>
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
              <span>Role Code: {deleteStates.role_code}</span>
              <span style={{ paddingLeft: 30 }}>Role Name: {deleteStates.role_name}</span>
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
          resetField={resetField}
        />
      )}
    </>
  )
  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(item => ({
    'ROLE CODE': item.role_code,
    'ROLE NAME': item.role_name,
    ACTIVE: item.active ? 'YES' : 'NO',
    'CREATED DATE': dateConvert(item.created_on)
  }))

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={pageTitle} />
            <DataGrid
              rows={dataList ?? []}
              rowSelection={false}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: states.pageSize
                  }
                }
              }}
              pageSizeOptions={[10, 20, 30, 50]}
              slots={{ toolbar: DataGridHeaderToolbar }}
              slotProps={{
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
              getRowId={row => `${row.role_code}`}
              columns={updateColumns}
            />
          </Card>
        </Grid>
        {/* -----Modal----- */}
        {renderModals}
      </Grid>
    </>
  )
}

export default Role
