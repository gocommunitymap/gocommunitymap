import { Grid, FormControl, TextField, Button, InputLabel, FormControlLabel, Switch, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { getGlobalParametersAPI } from 'src/configs'

export const ModalForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  const [utilitiesTypeOptions, setUtilitiesTypeOptions] = useState([])

  const initialized = async () => {
    //Bind Role List
    const response = await getGlobalParametersAPI({ TYPE_CODE: 'UTLTYPE', STATUS: 'Active' })
    if (response?.error) {
      toast.error(response.error.message)

      return
    }

    const data = response?.data
    if (data?.length > 0) {
      setUtilitiesTypeOptions(data.map(item => ({ value: item.PARAMETER_CODE_3, label: item.PARAMETER_DESCRIPTION_3 })))
    }
  }

  useEffect(() => {
    initialized()
  }, [states])

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
            <Grid container spacing={3} mt={0}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='UTILITY_ID '
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value}
                        disabled
                        variant='outlined'
                        label='UTILITY ID '
                        placeholder='UTILITY ID '
                        size='small'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='UTILITIES'
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        inputProps={{ maxLength: 50 }}
                        label='UTILITIES'
                        onChange={onChange}
                        placeholder='PLEASE ENTER UTILITIES'
                        size='small'
                        error={Boolean(errors.UTILITIES)}
                        helperText={Boolean(errors.UTILITIES) && 'Required'}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='UTILITY_TYPE_ID'
                    control={control}
                    rules={{
                      required: 'Required'
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <Autocomplete
                          size='small'
                          options={utilitiesTypeOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='UTILITY TYPE'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )
                    }}
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
