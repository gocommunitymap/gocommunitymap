import { Grid, FormControl, TextField, Button, Autocomplete, InputLabel, FormControlLabel, Switch } from '@mui/material'
import { Controller } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { dateConvert } from 'src/@core/utils'

export const CompanySettings = () => {
  const initialized = async () => {}

  useEffect(() => {
    initialized()
  }, [])

  return (
    <form autoComplete='off'>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField value={'CORTECH'} focused disabled label='Company Name' size='small' />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline value={''} label='Address 1' size='small' />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline value={''} label='Address 2' size='small' />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth multiline value={''} label='Contact 1' size='small' />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth multiline value={''} label='Contact 2' size='small' />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth multiline value={''} label='Email' size='small' />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth multiline value={''} label='Website Url' size='small' />
        </Grid>
      </Grid>
    </form>
  )
}
