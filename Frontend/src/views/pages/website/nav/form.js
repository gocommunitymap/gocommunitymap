import { Grid, FormControl, TextField, Button, InputLabel, FormControlLabel, Switch } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'

export const ModalForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  return (
    <Modal
      onsubmit={onsubmit}
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} mt={0}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='NAV_ID'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    variant='outlined'
                    label='FOOTER LINK ID'
                    placeholder='FOOTER LINK ID'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='NAV_DESCRIPTION'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    multiline
                    inputProps={{ maxLength: 200 }}
                    label='DESCRIPTION'
                    onChange={onChange}
                    placeholder='DESCRIPTION'
                    size='small'
                    error={Boolean(errors.NAV_DESCRIPTION)}
                    helperText={Boolean(errors.NAV_DESCRIPTION) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='LINK'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    multiline
                    inputProps={{ maxLength: 200 }}
                    label='LINK'
                    onChange={onChange}
                    placeholder='LINK'
                    size='small'
                    error={Boolean(errors.LINK)}
                    helperText={Boolean(errors.LINK) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='SORT_ORDER'
                control={control}
                rules={{
                  required: true,
                  min: 1
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='number'
                    value={value}
                    inputProps={{ min: 1 }}
                    label='SORT ORDER'
                    onChange={onChange}
                    placeholder='SORT ORDER (Minimum 1)'
                    size='small'
                    error={Boolean(errors.SORT_ORDER)}
                    helperText={Boolean(errors.SORT_ORDER) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='left'>
            <InputLabel style={{ marginTop: 9, marginRight: 5 }}>ACTIVE</InputLabel>
            <FormControl>
              <Controller
                name='ACTIVE'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Switch color='secondary' defaultChecked checked={value} />}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='center'>
            <LoadingButton loading={states.isSubmit} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              {states.isEdit ? 'Update' : 'Save'}
            </LoadingButton>
            <Button type='reset' size='large' color='secondary' variant='outlined' onClick={handleDiscard}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
