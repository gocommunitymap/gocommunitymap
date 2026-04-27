import { LoadingButton } from '@mui/lab'
import { Button, Card, Chip, Grid, IconButton, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { alertTypes, deleteSavedLinksAPI } from 'src/configs'
import CircularProgress from '@mui/material/CircularProgress'

export const SavedSearchCard = ({ data, handleDelete, handleModalOpen, states }) => {
  return (
    <Card fullWidth sx={{ my: 2 }}>
      <Link href={data.LINK}>
        <Grid container spacing={3}>
          <Grid item xs={12} m={5} display='flex' justifyContent='space-between'>
            <Typography variant='h6'>{data.DESCRIPTION}</Typography>
            <IconifyIcon icon='tabler:arrow-right' />
          </Grid>
        </Grid>
      </Link>
      <Grid container spacing={3}>
        <Grid item xs={12} display='flex' justifyContent='space-between' sx={{ p: 2, borderTop: 'solid 1px #ccc' }}>
          <Button onClick={() => handleDelete(data.LINK_ID)} sx={{ mr: 2 }}>
            {states.isSubmit ? <CircularProgress size={14} /> : <IconifyIcon icon='tabler:trash' />}
            Delete
          </Button>

          <Button onClick={() => handleModalOpen(data)}>
            {alertTypes.find(i => i.value === data.ALERT_TYPE).label}
            <IconifyIcon icon={`tabler:bell${data.ALERT_TYPE === 5 ? '-off' : ''}`} />
          </Button>
        </Grid>
      </Grid>
    </Card>
  )
}
