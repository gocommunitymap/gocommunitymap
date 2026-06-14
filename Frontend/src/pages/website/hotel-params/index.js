import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import Tab from '@mui/material/Tab'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import {
  getRoomType,
  updateRoomType,
  deleteRoomType,
  getBedType,
  updateBedType,
  deleteBedType,
  getHotelType,
  updateHotelType,
  deleteHotelType,
  getTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  getMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getCancellationPolicy,
  updateCancellationPolicy,
  deleteCancellationPolicy
} from 'src/store'
import { ModalForm } from 'src/views/pages/website/hotel-params/form'
import { getColumns } from 'src/views/pages/website/hotel-params/static-data'
import DeleteModal from 'src/views/components/modal/delete-modal'

const defaultFormValues = {
  ID: null,
  PARAMETER_CODE_3: null,
  PARAMETER_DESCRIPTION_3: null,
  PARAMETER_DESCRIPTION_4: null,
  ACTIVE: true
}

const ParamTab = ({
  label,
  getAction,
  updateAction,
  deleteAction,
  storeSelector,
  hasExtra,
  extraLabel,
  permissions
}) => {
  const dispatch = useDispatch()
  const store = useSelector(storeSelector)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: defaultFormValues })

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
    dispatch(getAction()).then(response => {
      if (response?.error) toast.error(response.error.message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      updateAction({
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

  const handleConfirm = row => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({
      ID: row.ID,
      PARAMETER_CODE_3: row.PARAMETER_CODE_3,
      PARAMETER_DESCRIPTION_3: row.PARAMETER_DESCRIPTION_3
    })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteAction(deleteStates)).then(response => {
      if (response.payload !== false) handleRefresh()
    })
  }

  const columns = getColumns(hasExtra ? extraLabel : null)

  const actionColumn = {
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

  const updateColumns = isAllowed(permissions, 'U') ? [...columns, actionColumn] : columns

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(data => ({
    CODE: data.PARAMETER_CODE_3?.toString(),
    DESCRIPTION: data.PARAMETER_DESCRIPTION_3,
    ...(hasExtra && { [extraLabel || 'EXTRA']: data.PARAMETER_DESCRIPTION_4 }),
    ACTIVE: getActiveProps(data.ACTIVE).label
  }))

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={label} />
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
                  onPrint: () => print({ title: label, data: exportDataList }),
                  onPdf: () => generatePDF({ title: label, data: exportDataList }),
                  onRefresh: handleRefresh,
                  clearSearch: () => handleSearch({ value: '', data: store?.data, setSearchStates }),
                  exportTitle: label,
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
      </Grid>

      {states.modalForm === 'd' ? (
        <DeleteModal
          onDelete={onDelete}
          onCancel={() => setStates({ ...states, isOpenModal: false })}
          handleDiscard={handleDiscard}
          isSubmit={states.isSubmit}
          isOpenModal={states.isOpenModal}
          title={label}
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
          pageTitle={label}
          hasExtra={hasExtra}
          extraLabel={extraLabel}
        />
      )}
    </>
  )
}

const TAB_CONFIG = [
  {
    value: '1',
    label: 'Room Type',
    getAction: getRoomType,
    updateAction: updateRoomType,
    deleteAction: deleteRoomType,
    storeSelector: state => state.roomType,
    hasExtra: false,
    extraLabel: null
  },
  {
    value: '2',
    label: 'Bed Type',
    getAction: getBedType,
    updateAction: updateBedType,
    deleteAction: deleteBedType,
    storeSelector: state => state.bedType,
    hasExtra: false,
    extraLabel: null
  },
  {
    value: '3',
    label: 'Hotel Type',
    getAction: getHotelType,
    updateAction: updateHotelType,
    deleteAction: deleteHotelType,
    storeSelector: state => state.hotelType,
    hasExtra: true,
    extraLabel: 'Icon (tabler name)'
  },
  {
    value: '4',
    label: 'Time Slots',
    getAction: getTimeSlot,
    updateAction: updateTimeSlot,
    deleteAction: deleteTimeSlot,
    storeSelector: state => state.timeSlot,
    hasExtra: false,
    extraLabel: null
  },
  {
    value: '5',
    label: 'Meal Plan',
    getAction: getMealPlan,
    updateAction: updateMealPlan,
    deleteAction: deleteMealPlan,
    storeSelector: state => state.mealPlan,
    hasExtra: false,
    extraLabel: null
  },
  {
    value: '6',
    label: 'Cancellation Policy',
    getAction: getCancellationPolicy,
    updateAction: updateCancellationPolicy,
    deleteAction: deleteCancellationPolicy,
    storeSelector: state => state.cancellationPolicy,
    hasExtra: true,
    extraLabel: 'Short Badge (e.g. 48h, Flexible)'
  }
]

const HotelParams = () => {
  const permissions = usePermission()
  const [activeTab, setActiveTab] = useState('1')

  return (
    <Box>
      <TabContext value={activeTab}>
        <TabList
          onChange={(_, val) => setActiveTab(val)}
          variant='scrollable'
          scrollButtons='auto'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, mb: 4 }}
        >
          {TAB_CONFIG.map(tab => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabList>

        {TAB_CONFIG.map(tab => (
          <TabPanel key={tab.value} value={tab.value} sx={{ p: 0 }}>
            <ParamTab
              label={tab.label}
              getAction={tab.getAction}
              updateAction={tab.updateAction}
              deleteAction={tab.deleteAction}
              storeSelector={tab.storeSelector}
              hasExtra={tab.hasExtra}
              extraLabel={tab.extraLabel}
              permissions={permissions}
            />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  )
}

export default HotelParams
