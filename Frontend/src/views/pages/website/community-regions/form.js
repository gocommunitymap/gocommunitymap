import { Grid, FormControl, TextField, Button, InputLabel, FormControlLabel, Switch } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'

export const ModalForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  return (
    <Modal
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} mt={0}>
          <Grid item xs={12}>
            <Grid container spacing={3} mt={0}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='PARAMETER_CODE_3'
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value ?? ''}
                        disabled
                        variant='outlined'
                        label='REGION CODE'
                        placeholder='REGION CODE'
                        size='small'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='PARAMETER_DESCRIPTION_3'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value ?? ''}
                        inputProps={{ maxLength: 100 }}
                        label='REGION NAME'
                        onChange={onChange}
                        placeholder='PLEASE ENTER REGION NAME'
                        size='small'
                        error={Boolean(errors.PARAMETER_DESCRIPTION_3)}
                        helperText={Boolean(errors.PARAMETER_DESCRIPTION_3) && 'Required'}
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
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
