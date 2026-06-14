import { useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tooltip,
  Typography
} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { ModalForm } from 'src/views/pages/website/hotel-params/form'
import DeleteModal from 'src/views/components/modal/delete-modal'
import { baseColumns } from 'src/views/pages/website/hotel-params/static-data'
import {
  getGlobalParametersAPI,
  createGlobalParametersAPI,
  updateGlobalParametersAPI,
  deleteGlobalParametersAPI
} from 'src/configs'
import { hotelFilterConfig, rentalFilterConfig } from 'src/@core/utils'

const OPTION_TYPES = ['radio', 'checkbox', 'range']

const defaultValues = {
  ID: null,
  PARAMETER_CODE_3: null,
  PARAMETER_DESCRIPTION_3: null,
  PARAMETER_DESCRIPTION_4: null,
  ACTIVE: true
}

const GroupSection = ({ group, refreshKey }) => {
  const hasOptions = OPTION_TYPES.includes(group.type) && Boolean(group.typeCode)
  const [rows, setRows] = useState([])
  const [states, setStates] = useState({ isOpenModal: false, isEdit: false, isSubmit: false })
  const [deleteModal, setDeleteModal] = useState({ open: false, row: null })
  const isMounted = useRef(true)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const fetchRows = () => {
    if (!hasOptions) return
    setRows([])
    getGlobalParametersAPI({ TYPE_CODE: group.typeCode, ALLOWED: true })
      .then(res => {
        if (isMounted.current) setRows(Array.isArray(res?.data) ? res.data : [])
      })
      .catch(() => {
        if (isMounted.current) setRows([])
      })
  }

  useEffect(() => {
    isMounted.current = true
    fetchRows()

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.typeCode, refreshKey])

  const openAdd = () => {
    reset(defaultValues)
    setStates({ isOpenModal: true, isEdit: false, isSubmit: false })
  }

  const openEdit = row => {
    setValue('ID', row.ID)
    setValue('PARAMETER_CODE_3', row.PARAMETER_CODE_3)
    setValue('PARAMETER_DESCRIPTION_3', row.PARAMETER_DESCRIPTION_3)
    setValue('PARAMETER_DESCRIPTION_4', row.PARAMETER_DESCRIPTION_4 ?? null)
    setValue('ACTIVE', row.ACTIVE)
    setStates({ isOpenModal: true, isEdit: true, isSubmit: false })
  }

  const handleDiscard = () => {
    reset()
    setStates({ isOpenModal: false, isEdit: false, isSubmit: false })
  }

  const onSubmit = async data => {
    setStates(s => ({ ...s, isSubmit: true }))

    try {
      const payload = {
        TYPE_CODE: group.typeCode,
        ALLOWED: true,
        PARAMETER_DESCRIPTION_3: data.PARAMETER_DESCRIPTION_3,
        PARAMETER_DESCRIPTION_4: data.PARAMETER_DESCRIPTION_4 ?? null,
        ACTIVE: data.ACTIVE
      }

      if (states.isEdit) {
        payload.ID = data.ID
        payload.PARAMETER_CODE_3 = data.PARAMETER_CODE_3
        await updateGlobalParametersAPI(payload)
        toast.success('Option updated')
      } else {
        await createGlobalParametersAPI(payload)
        toast.success('Option added')
      }

      fetchRows()
      handleDiscard()
    } catch {
      toast.error('Failed to save option')
      if (isMounted.current) setStates(s => ({ ...s, isSubmit: false }))
    }
  }

  const onDelete = async () => {
    if (!deleteModal.row) return
    setStates(s => ({ ...s, isSubmit: true }))

    try {
      await deleteGlobalParametersAPI({ ID: deleteModal.row.ID, TYPE_CODE: group.typeCode, ALLOWED: true })
      toast.success('Option deleted')
      fetchRows()
      setDeleteModal({ open: false, row: null })
    } catch {
      toast.error('Failed to delete option')
    } finally {
      if (isMounted.current) setStates(s => ({ ...s, isSubmit: false }))
    }
  }

  const columns = [
    ...baseColumns,
    ...(Boolean(group?.isEditable) || Boolean(group?.isDeletable)
      ? [
          {
            sortable: false,
            minWidth: 150,
            align: 'right',
            headerAlign: 'right',
            headerName: 'Action',
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {Boolean(group?.isEditable) && (
                  <Tooltip title='Edit' placement='top'>
                    <IconButton color='primary' size='small' onClick={() => openEdit(row)}>
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                )}

                {Boolean(group?.isDeletable) && (
                  <Tooltip title='Delete' placement='top'>
                    <IconButton color='error' size='small' onClick={() => setDeleteModal({ open: true, row })}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )
          }
        ]
      : [])
  ]

  return (
    <>
      <Accordion
        elevation={0}
        sx={{ border: '1px solid #e0e7ef', borderRadius: '8px !important', mb: 1.5, '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, flexWrap: 'wrap' }}>
            <Typography fontWeight={700} sx={{ fontSize: '0.94rem' }}>
              {group.title}
            </Typography>
            <Chip size='small' label={group.type} variant='outlined' sx={{ fontSize: '0.7rem' }} />
            {/* {group.typeCode && (
              <Chip
                size='small'
                label={`TYPE_CODE: ${group.typeCode}`}
                sx={{ fontSize: '0.68rem', fontFamily: 'monospace', backgroundColor: '#f0f4ff', color: '#3751b8' }}
              />
            )} */}
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          <Box mb={1.5} display='flex' justifyContent='flex-end'>
            <Typography></Typography>
            {(Boolean(group?.isAddable) && group.type !== 'range') || (group.type === 'range' && rows.length < 2) ? (
              <Button size='small' variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={openAdd}>
                Add Option
              </Button>
            ) : null}
          </Box>
          <DataGrid
            rowSelection={false}
            rows={rows}
            columns={columns}
            getRowId={row => row.ID ?? row.PARAMETER_CODE_3}
            autoHeight
            hideFooter={rows.length <= 10}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25]}
            density='compact'
          />
        </AccordionDetails>
      </Accordion>

      <ModalForm
        control={control}
        states={states}
        handleDiscard={handleDiscard}
        errors={errors}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        pageTitle={group.title}
        hasExtra={group.type === 'radio'}
        extraLabel={
          group.id === 'budget' || group.id === 'price-range'
            ? 'Price Range (min:max e.g. 0:100)'
            : 'Filter Threshold (min: e.g. 4.5:)'
        }
      />

      <DeleteModal
        onDelete={onDelete}
        onCancel={() => setDeleteModal({ open: false, row: null })}
        handleDiscard={() => setDeleteModal({ open: false, row: null })}
        isSubmit={states.isSubmit}
        isOpenModal={deleteModal.open}
        title='Option'
      >
        <p style={{ textAlign: 'center' }}>
          <strong>
            <span>CODE: {deleteModal.row?.PARAMETER_CODE_3}</span>
            <span style={{ paddingLeft: 30 }}>DESCRIPTION: {deleteModal.row?.PARAMETER_DESCRIPTION_3}</span>
          </strong>
        </p>
      </DeleteModal>
    </>
  )
}

const FilterConfig = () => {
  const [activeTab, setActiveTab] = useState('hotels')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Home Page Filter Configuration'
            action={
              <Tooltip title='Refresh all groups'>
                <IconButton onClick={() => setRefreshKey(k => k + 1)}>
                  <Icon icon='tabler:refresh' />
                </IconButton>
              </Tooltip>
            }
          />
          <Box px={4} pb={4}>
            <TabContext value={activeTab}>
              <TabList onChange={(_, val) => setActiveTab(val)} sx={{ borderBottom: '1px solid #e0e7ef', mb: 3 }}>
                <Tab
                  value='hotels'
                  label='Hotel Filters'
                  icon={<Icon icon='tabler:building-skyscraper' />}
                  iconPosition='start'
                />
                <Tab value='rentals' label='Rental Filters' icon={<Icon icon='tabler:home' />} iconPosition='start' />
              </TabList>

              <TabPanel value='hotels' sx={{ p: 0 }}>
                {hotelFilterConfig
                  .filter(group => group.type !== 'counter')
                  .map(group => (
                    <GroupSection key={group.id} group={group} refreshKey={refreshKey} />
                  ))}
              </TabPanel>
              <TabPanel value='rentals' sx={{ p: 0 }}>
                {rentalFilterConfig
                  .filter(group => group.type !== 'counter')
                  .map(group => (
                    <GroupSection key={group.id} group={group} refreshKey={refreshKey} />
                  ))}
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FilterConfig
