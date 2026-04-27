import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getNews, updateNews, deleteNews } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/news/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/news/form'
import { useAuth } from 'src/hooks/useAuth'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'News Setup'

const defaultValues = {
  NEWS_ID: null,
  NEWS_TITLE: '',
  NEWS_DATE: null,
  SHORT_DESCRIPTION: '',
  PICTURE_LINK: '',
  SORT_ORDER: null,
  ACTIVE_FROM: null,
  ACTIVE_TO: null,
  ACTIVE: true
}

const News = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.news)

  const [file, setFile] = useState()

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({ NEWS_ID: null, NEWS_TITLE: '', PICTURE_LINK: '' })
  useEffect(() => {
    dispatch(getNews()).then(response => {
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
    setValue('NEWS_ID', row.NEWS_ID)
    setValue('NEWS_TITLE', row.NEWS_TITLE)
    setValue('NEWS_DATE', new Date(row.NEWS_DATE))
    setValue('SHORT_DESCRIPTION', row.SHORT_DESCRIPTION)
    setValue('PICTURE_LINK', row.PICTURE_LINK)
    setValue('SORT_ORDER', row.SORT_ORDER)
    setValue('ACTIVE_FROM', new Date(row.ACTIVE_FROM))
    setValue('ACTIVE_TO', new Date(row.ACTIVE_TO))
    setValue('ACTIVE', row.ACTIVE)
    setValue('DISPLAY_TYPE_1', Boolean(row.DISPLAY_TYPE?.includes('1')))
    setValue('DISPLAY_TYPE_2', Boolean(row.DISPLAY_TYPE?.includes('2')))
    setValue('DISPLAY_TYPE_3', Boolean(row.DISPLAY_TYPE?.includes('3')))
    setValue('DISPLAY_TYPE_4', Boolean(row.DISPLAY_TYPE?.includes('4')))
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

  const getDisplayType = data => {
    return `${data.DISPLAY_TYPE_1 !== false ? '1' : ''}${data.DISPLAY_TYPE_2 !== false ? '2' : ''}${
      data.DISPLAY_TYPE_3 !== false ? '3' : ''
    }${data.DISPLAY_TYPE_4 !== false ? '4' : ''}`
  }

  const onSubmit = data => {
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })

    dispatch(
      updateNews({
        data: {
          NEWS_ID: data.NEWS_ID,
          NEWS_TITLE: data.NEWS_TITLE,
          NEWS_DATE: data.NEWS_DATE,
          SHORT_DESCRIPTION: data.SHORT_DESCRIPTION,
          PICTURE_LINK: data.PICTURE_LINK,
          SORT_ORDER: data.SORT_ORDER,
          ACTIVE_FROM: data.ACTIVE_FROM,
          ACTIVE_TO: data.ACTIVE_TO,
          ACTIVE: data.ACTIVE,
          DISPLAY_TYPE: getDisplayType(data)
        },
        file
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()

      setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
    })
  }

  const handleConfirm = data => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({ NEWS_ID: data.NEWS_ID, NEWS_TITLE: data.NEWS_TITLE, PICTURE_LINK: data.PICTURE_LINK })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteNews(deleteStates)).then(response => {
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
              <span>NEWS ID: {deleteStates.NEWS_ID}</span>
              <span style={{ paddingLeft: 30 }}>NEWS TITLE: {deleteStates.NEWS_TITLE}</span>
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
          setError={setError}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          pageTitle={pageTitle}
          setValue={setValue}
          file={file}
          setFile={setFile}
          watch={watch}
          clearErrors={clearErrors}
        />
      )}
    </>
  )

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(data => ({
    'NEWS ID': data.NEWS_ID,
    'NEWS TITLE': data.NEWS_TITLE,
    'NEWS DATE': dateConvert(data.NEWS_DATE),
    'SHORT DESCRIPTION': data.SHORT_DESCRIPTION,
    'PICTURE LINK': data.PICTURE_LINK,
    'SORT ORDER': data.SORT_ORDER,
    'ACTIVE FROM': dateConvert(data.ACTIVE_FROM),
    'ACTIVE TO': dateConvert(data.ACTIVE_TO),
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
              getRowId={row => `${row.NEWS_ID}`}
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

export default News
