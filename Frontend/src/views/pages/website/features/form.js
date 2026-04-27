import {
  Grid,
  FormControl,
  TextField,
  Button,
  InputLabel,
  FormControlLabel,
  Switch,
  Autocomplete,
  Popper,
  Box,
  Typography,
  InputAdornment
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { ListBoxComponent, Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { getGlobalParametersAPI } from 'src/configs'
import IconifyIcon from 'src/@core/components/icon'
import iconList from 'src/@core/utils/tablerIcon'

export const ModalForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle, watch }) => {
  const PopperMy = function (props) {
    return <Popper {...props} placement='bottom-start' />
  }
  const [featuresTypeOptions, setFeaturesTypeOptions] = useState([])

  const initialized = async () => {
    //Bind Role List
    const response = await getGlobalParametersAPI({ TYPE_CODE: 'FTRTYPE', STATUS: 'Active' })
    if (response?.error) {
      toast.error(response.error.message)

      return
    }

    const data = response?.data
    if (data?.length > 0) {
      setFeaturesTypeOptions(data.map(item => ({ value: item.PARAMETER_CODE_3, label: item.PARAMETER_DESCRIPTION_3 })))
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
                    name='FEATURES_ID'
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value}
                        disabled
                        variant='outlined'
                        label='FEATURE ID'
                        placeholder='FEATURE ID'
                        size='small'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='FEATURES'
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        inputProps={{ maxLength: 50 }}
                        label='FEATURE NAME'
                        onChange={onChange}
                        placeholder='PLEASE ENTER FEATURE NAME'
                        size='small'
                        error={Boolean(errors.FEATURES)}
                        helperText={Boolean(errors.FEATURES) && 'Required'}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='FEATURES_TYPE_ID'
                    control={control}
                    rules={{
                      required: 'Required'
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <Autocomplete
                          size='small'
                          options={featuresTypeOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='FEATURE TYPE'
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
                <InputLabel style={{ marginTop: 9, marginRight: 5 }}>HIGHLIGHTED</InputLabel>
                <FormControl>
                  <Controller
                    name='HIGHLIGHTED'
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
              <Grid item xs={12} display='flex' justifyContent='left'>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='ICON'
                    control={control}
                    rules={{
                      required: 'Required'
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <Autocomplete
                          PopperComponent={PopperMy}
                          size='small'
                          options={iconList}
                          ListboxComponent={ListBoxComponent}
                          renderOption={(props, option, state) => [props, option, state.index, true]}
                          renderGroup={params => params}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => {
                            return (
                              <Box>
                                <TextField
                                  {...params}
                                  label='ICON'
                                  variant='outlined'
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  InputProps={{
                                    ...params.InputProps,

                                    // Use 'startAdornment' for a leading icon
                                    startAdornment: (
                                      <InputAdornment position='start'>
                                        <IconifyIcon
                                          width={20}
                                          icon={
                                            field.value?.value.includes('tabler')
                                              ? field?.value?.value
                                              : `tabler:${field?.value?.value}`
                                          }
                                        />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </Box>
                            )
                          }}
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
