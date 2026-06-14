import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getUser, updateUser } from 'src/store/admin/user'
import { toast } from 'react-hot-toast'
import { columns, statusOptions } from 'src/views/pages/admin/user/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/admin/user/form'
import { useAuth } from 'src/hooks/useAuth'

const pageTitle = 'User Setup'

const defaultValues = {
  USER_CODE: null,
  role: null,
  USER_NAME: '',
  EMAIL: '',
  PASSWORD: '',
  CONTACT_NO: '',
  STATUS: null,
  CREATED_BY: ''
}

const User = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()
  const { user } = useAuth()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.user)

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  useEffect(() => {
    dispatch(getUser()).then(response => {
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

  const handleEdit = row => {
    setValue('USER_CODE', row.USER_CODE)
    setValue('role', { value: row.ROLE_CODE, label: row.ROLE_NAME })
    setValue('USER_NAME', row.USER_NAME)
    setValue('EMAIL', row.EMAIL)
    setValue('PASSWORD', row.PASSWORD)
    setValue('CONTACT_NO', row.CONTACT_NO)
    setValue('CREATED_ON', row.CREATED_ON)
    setValue(
      'STATUS',
      statusOptions.find(i => i.value == row.STATUS)
    )
    setValue('CREATED_BY', row.CREATED_BY)
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
      updateUser({
        USER_CODE: data.USER_CODE,
        ROLE_CODE: data.role.value,
        USER_NAME: data.USER_NAME,
        EMAIL: data.EMAIL,
        PASSWORD: data.PASSWORD,
        CONTACT_NO: data.CONTACT_NO,
        STATUS: data.STATUS.value,
        USER_TYPE: 1
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()

      setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
    })
  }

  const handleConfirm = ({ data }) => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({ USER_CODE: data.USER_CODE, USER_NAME: data.USER_NAME })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteUser(deleteStates)).then(response => {
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
                {isAllowed(permissions, 'U') && row.USER_CODE != user.usercode && row.ROLE_CODE !== user.roll_id && (
                  <Tooltip title='Edit' placement='top'>
                    <IconButton color='primary' size='small' onClick={() => handleEdit(row)}>
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )
          }
        }
      ]
    : columns

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(item => ({
    'User ID': item.USER_CODE,
    'User Role': item.ROLE_NAME,
    Name: item.USER_NAME,
    Email: item.EMAIL,
    'Contact No.': item.CONTACT_NO ?? '',
    STATUS: statusOptions.find(i => i.value == item.STATUS).label,
    'Created Date': dateConvert(item.CREATED_ON)
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
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: states.pageSize
                  }
                }
              }}
              pageSizeOptions={[5, 10, 25, 50]}
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
              getRowId={row => `${row.USER_CODE}`}
              columns={updateColumns}
            />
          </Card>
        </Grid>
        {/* -----Modal----- */}
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
        />
      </Grid>
    </>
  )
}

export default User
