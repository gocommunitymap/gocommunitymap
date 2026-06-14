import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getCommunities, updateCommunities, deleteCommunities } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/communities/static-data'
import { getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/communities/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Communities Setup'

const defaultValues = {
  COMMUNITY_ID: null,
  COMMUNITY_NAME: '',
  LOCATION: '',
  MEMBERS: '0',
  PICTURE_LINK: '',
  REGION: '',
  COUNTRY_CODE: '',
  ACTIVE: true
}

const Communities = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.communities)
  const [file, setFile] = useState()

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({ COMMUNITY_ID: null, COMMUNITY_NAME: '' })

  useEffect(() => {
    dispatch(getCommunities()).then(response => {
      if (response?.error) toast.error(response.error.message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.isSubmit])

  const handleEdit = row => {
    setValue('COMMUNITY_ID', row.COMMUNITY_ID)
    setValue('COMMUNITY_NAME', row.COMMUNITY_NAME)
    setValue('LOCATION', row.LOCATION)
    setValue('MEMBERS', row.MEMBERS || '0')
    setValue('PICTURE_LINK', row.PICTURE_LINK)
    setValue('REGION', row.REGION || '')
    setValue('COUNTRY_CODE', row.COUNTRY_CODE || '')
    setValue('ACTIVE', row.ACTIVE)
    setStates({ ...states, isEdit: true, isOpenModal: true, modalForm: 'c' })
  }

  const handleDiscard = () => {
    reset()
    setFile(undefined)
    setStates({ ...states, isOpenModal: false, isEdit: false })
  }

  const handleRefresh = () => {
    reset()
    setFile(undefined)
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
      updateCommunities({
        data: {
          COMMUNITY_ID: data.COMMUNITY_ID,
          COMMUNITY_NAME: data.COMMUNITY_NAME,
          LOCATION: data.LOCATION,
          MEMBERS: data.MEMBERS || '0',
          PICTURE_LINK: data.PICTURE_LINK,
          REGION: data.REGION,
          COUNTRY_CODE: data.COUNTRY_CODE || '',
          ACTIVE: data.ACTIVE
        },
        file
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()
      setFile(undefined)
      setStates({ ...states, isSubmit: false, isOpenModal })
    })
  }

  const handleConfirm = data => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({
      COMMUNITY_ID: data.COMMUNITY_ID,
      COMMUNITY_NAME: data.COMMUNITY_NAME,
      PICTURE_LINK: data.PICTURE_LINK
    })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteCommunities(deleteStates)).then(response => {
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
    COMMUNITY_ID: data.COMMUNITY_ID,
    COMMUNITY_NAME: data.COMMUNITY_NAME,
    LOCATION: data.LOCATION,
    MEMBERS: data.MEMBERS,
    REGION: data.REGION,
    COUNTRY_CODE: data.COUNTRY_CODE,
    ACTIVE: getActiveProps(data.ACTIVE).label
  }))

  return (
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
              pagination: {
                paginationModel: {
                  pageSize: states.pageSize
                }
              }
            }}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
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
            getRowId={row => row.COMMUNITY_ID}
            columns={updateColumns}
          />
        </Card>
      </Grid>

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
              <span>COMMUNITY ID: {deleteStates.COMMUNITY_ID}</span>
              <span style={{ paddingLeft: 30 }}>COMMUNITY NAME: {deleteStates.COMMUNITY_NAME}</span>
            </strong>
          </p>
        </DeleteModal>
      ) : (
        <ModalForm
          control={control}
          states={states}
          handleDiscard={handleDiscard}
          errors={errors}
          setError={setError}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          pageTitle={pageTitle}
          setValue={setValue}
          setFile={setFile}
          clearErrors={clearErrors}
        />
      )}
    </Grid>
  )
}

export default Communities
