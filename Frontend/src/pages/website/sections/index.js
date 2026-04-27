import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getSections, updateSections, deleteSections } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/sections/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/sections/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Section Setup'

const defaultValues = {
  SECTION_ID: null,
  SECTION_TITLE: '',
  HEADING: '',
  DESCRIPTION: '',
  PICTURE_LINK: '',
  MORE_BUTTON_TEXT: '',
  MORE_BUTTON_LINK: '',
  SORT_ORDER: null,
  ICON: '',
  ACTIVE: true
}

const Sections = () => {
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

  const store = useSelector(state => state.sections)
  const [file, setFile] = useState()

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({ SECTION_ID: null, SECTION_TITLE: '' })
  useEffect(() => {
    dispatch(getSections()).then(response => {
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
    setValue('SECTION_ID', row.SECTION_ID)
    setValue('SECTION_TITLE', row.SECTION_TITLE)
    setValue('HEADING', row.HEADING)
    setValue('DESCRIPTION', row.DESCRIPTION)
    setValue('PICTURE_LINK', row.PICTURE_LINK)
    setValue('MORE_BUTTON_TEXT', row.MORE_BUTTON_TEXT)
    setValue('MORE_BUTTON_LINK', row.MORE_BUTTON_LINK)
    setValue('SORT_ORDER', row.SORT_ORDER)
    setValue('ICON', row.ICON)
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
      updateSections({
        data: {
          SECTION_ID: data.SECTION_ID,
          SECTION_TITLE: data.SECTION_TITLE,
          HEADING: data.HEADING,
          DESCRIPTION: data.DESCRIPTION,
          PICTURE_LINK: data.PICTURE_LINK,
          MORE_BUTTON_TEXT: data.MORE_BUTTON_TEXT,
          MORE_BUTTON_LINK: data.MORE_BUTTON_LINK,
          SORT_ORDER: data.SORT_ORDER,
          ICON: data.ICON,
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
    setDeleteStates({ SECTION_ID: data.SECTION_ID, SECTION_TITLE: data.SECTION_TITLE, PICTURE_LINK: data.PICTURE_LINK })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteSections(deleteStates)).then(response => {
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
              <span>SECTION ID: {deleteStates.SECTION_ID}</span>
              <span style={{ paddingLeft: 30 }}>SECTION TITLE: {deleteStates.SECTION_TITLE}</span>
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
    SECTION_ID: data.SECTION_ID,
    SECTION_TITLE: data.SECTION_TITLE,
    HEADING: data.HEADING,
    DESCRIPTION: data.DESCRIPTION,
    PICTURE_LINK: data.PICTURE_LINK,
    HEADING: data.HEADING,
    DESCRIPTION: data.DESCRIPTION,
    PICTURE_LINK: data.PICTURE_LINK,
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
              getRowId={row => row.SECTION_ID}
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

export default Sections
