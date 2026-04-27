import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import { handleSearch } from 'src/@core/utils'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import { getBookingAPI, cancelBookingAPI, updateBookingStatusAPI } from 'src/configs/services/api-methods/guest'
import SeoHead from 'src/components/SeoHead'

const pageTitle = 'Hotel Bookings'

const statusColorMap = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'error'
}

const formatDate = dateStr => {
  if (!dateStr) return '—'
  const [y, m, d] = String(dateStr).split('-').map(Number)
  if (!y || !m || !d) return dateStr

  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const AdminBookings = () => {
  const router = useRouter()

  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [pageSize, setPageSize] = useState(10)
  const [actionTarget, setActionTarget] = useState(null) // { booking, type: 'confirm' | 'cancel' }
  const [submitting, setSubmitting] = useState(false)

  const fetchBookings = () => {
    setLoading(true)
    getBookingAPI()
      .then(res => {
        const data = res?.data || []
        setAllData(data)
        setSearchStates({ searchText: '', filteredData: [] })
      })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConfirmAction = async () => {
    if (!actionTarget) return
    setSubmitting(true)
    try {
      if (actionTarget.type === 'confirm') {
        await updateBookingStatusAPI({ BOOKING_ID: actionTarget.booking.BOOKING_ID, STATUS: 'CONFIRMED' })
        toast.success('Booking confirmed successfully')
      } else {
        await cancelBookingAPI({ BOOKING_ID: actionTarget.booking.BOOKING_ID })
        toast.success('Booking cancelled successfully')
      }
      setActionTarget(null)
      fetchBookings()
    } catch {
      toast.error(actionTarget.type === 'confirm' ? 'Failed to confirm booking' : 'Failed to cancel booking')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      flex: 1,
      minWidth: 160,
      field: 'BOOKING_NO',
      headerName: 'Booking Ref',
      renderCell: ({ row }) => (
        <Typography variant='body2' fontWeight={700} sx={{ color: '#27ae60' }}>
          #{row.BOOKING_NO}
        </Typography>
      )
    },
    {
      flex: 1.5,
      minWidth: 200,
      field: 'PROPERTY_NAME',
      headerName: 'Property',
      renderCell: ({ row }) => (
        <Box>
          <Typography variant='body2' fontWeight={600}>
            {row.PROPERTY_NAME || '—'}
          </Typography>
          {row.PLACE && (
            <Typography variant='caption' color='text.secondary'>
              {row.PLACE}
            </Typography>
          )}
        </Box>
      )
    },
    {
      flex: 1.2,
      minWidth: 160,
      field: 'GUEST_FIRST_NAME',
      headerName: 'Guest',
      renderCell: ({ row }) => `${row.GUEST_FIRST_NAME || ''} ${row.GUEST_LAST_NAME || ''}`.trim() || '—'
    },
    {
      flex: 1,
      minWidth: 115,
      field: 'CHECK_IN',
      headerName: 'Check-in',
      renderCell: ({ row }) => formatDate(row.CHECK_IN)
    },
    {
      flex: 1,
      minWidth: 115,
      field: 'CHECK_OUT',
      headerName: 'Check-out',
      renderCell: ({ row }) => formatDate(row.CHECK_OUT)
    },
    {
      flex: 0.7,
      minWidth: 90,
      field: 'NIGHTS',
      headerName: 'Stay',
      renderCell: ({ row }) => `${row.NIGHTS || 1}N / ${row.ROOMS || 1}R`
    },
    {
      flex: 1,
      minWidth: 130,
      field: 'TOTAL',
      headerName: 'Total',
      renderCell: ({ row }) => `$ ${Number(row.TOTAL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
    {
      flex: 1,
      minWidth: 120,
      field: 'STATUS',
      headerName: 'Status',
      renderCell: ({ row }) => {
        const s = (row.STATUS || 'PENDING').toUpperCase()

        return (
          <Chip
            label={s}
            color={statusColorMap[s] || 'default'}
            size='small'
            sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: 0.5 }}
          />
        )
      }
    },
    {
      flex: 1.3,
      minWidth: 150,
      sortable: false,
      filterable: false,
      field: 'actions',
      headerName: 'Actions',
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const status = (row.STATUS || '').toUpperCase()
        const isPending = status === 'PENDING'
        const isCancelled = status === 'CANCELLED'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title='View booking detail' placement='top'>
              <IconButton size='small' onClick={() => router.push(`/hotels/booking/${row.BOOKING_NO}`)}>
                <Icon icon='tabler:eye' />
              </IconButton>
            </Tooltip>

            {isPending && (
              <Tooltip title='Confirm booking' placement='top'>
                <IconButton
                  size='small'
                  color='success'
                  onClick={() => setActionTarget({ booking: row, type: 'confirm' })}
                >
                  <Icon icon='tabler:circle-check' />
                </IconButton>
              </Tooltip>
            )}

            {!isCancelled && (
              <Tooltip title='Cancel booking' placement='top'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => setActionTarget({ booking: row, type: 'cancel' })}
                >
                  <Icon icon='tabler:x-circle' />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : allData

  const exportDataList = dataList.map(b => ({
    'Booking Ref': b.BOOKING_NO,
    Property: b.PROPERTY_NAME || '',
    'Guest Name': `${b.GUEST_FIRST_NAME || ''} ${b.GUEST_LAST_NAME || ''}`.trim(),
    'Guest Email': b.GUEST_EMAIL || '',
    'Check-in': b.CHECK_IN || '',
    'Check-out': b.CHECK_OUT || '',
    Nights: b.NIGHTS || '',
    Rooms: b.ROOMS || '',
    Adults: b.ADULTS || '',
    Children: b.CHILDREN || '',
    'Total ($)': b.TOTAL || '',
    'Payment Method': b.PAYMENT_METHOD || '',
    Status: b.STATUS || ''
  }))

  return (
    <>
      <SeoHead title={`${pageTitle} – GoCommunityMap`} description='Manage hotel bookings.' />

      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={pageTitle} />
            <DataGrid
              rowSelection={false}
              rows={dataList ?? []}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { pageSize }
                }
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              onPaginationModelChange={model => setPageSize(model.pageSize)}
              components={{ Toolbar: DataGridHeaderToolbar }}
              componentsProps={{
                baseButton: { variant: 'outlined' },
                toolbar: {
                  onChange: event => handleSearch({ value: event.target.value, data: allData, setSearchStates }),
                  onRefresh: fetchBookings,
                  clearSearch: () => handleSearch({ value: '', data: allData, setSearchStates }),
                  exportTitle: pageTitle,
                  exportData: exportDataList,
                  columns,
                  value: searchStates.searchText
                }
              }}
              autoHeight
              rowHeight={40}
              getRowId={row => `${row.BOOKING_NO || row.CODE}`}
              columns={columns}
              disableSelectionOnClick
            />
          </Card>
        </Grid>
      </Grid>

      {/* Confirm / Cancel dialog */}
      <Dialog open={Boolean(actionTarget)} onClose={() => !submitting && setActionTarget(null)} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon
            icon={actionTarget?.type === 'confirm' ? 'tabler:circle-check' : 'tabler:alert-triangle'}
            style={{
              fontSize: 22,
              color: actionTarget?.type === 'confirm' ? '#27ae60' : '#e53935'
            }}
          />
          {actionTarget?.type === 'confirm' ? 'Confirm Booking' : 'Cancel Booking'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText>
            {actionTarget?.type === 'confirm' ? (
              <>
                Confirm booking <strong style={{ color: '#27ae60' }}>#{actionTarget?.booking?.BOOKING_NO}</strong> for{' '}
                <strong>
                  {actionTarget?.booking?.GUEST_FIRST_NAME} {actionTarget?.booking?.GUEST_LAST_NAME}
                </strong>
                ?
              </>
            ) : (
              <>
                Cancel booking <strong style={{ color: '#e53935' }}>#{actionTarget?.booking?.BOOKING_NO}</strong> for{' '}
                <strong>
                  {actionTarget?.booking?.GUEST_FIRST_NAME} {actionTarget?.booking?.GUEST_LAST_NAME}
                </strong>
                ? This action cannot be undone.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setActionTarget(null)} disabled={submitting}>
            Discard
          </Button>
          {actionTarget?.type === 'confirm' ? (
            <Button
              variant='contained'
              color='success'
              onClick={handleConfirmAction}
              disabled={submitting}
              startIcon={submitting ? null : <Icon icon='tabler:circle-check' />}
            >
              {submitting ? 'Confirming…' : 'Confirm'}
            </Button>
          ) : (
            <Button
              variant='contained'
              color='error'
              onClick={handleConfirmAction}
              disabled={submitting}
              startIcon={submitting ? null : <Icon icon='tabler:x-circle' />}
            >
              {submitting ? 'Cancelling…' : 'Cancel Booking'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdminBookings
