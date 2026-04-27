import {
  Grid,
  FormControl,
  TextField,
  Button,
  InputLabel,
  FormControlLabel,
  Switch,
  Autocomplete,
  RadioGroup,
  Radio,
  Typography,
  Card,
  FormHelperText
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { getGlobalParametersAPI } from 'src/configs'
import IconifyIcon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import { fieldTypeOptions } from 'src/@core/utils'

export const ModalForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle, setValue }) => {
  const [usingPlanningTypeOptions, setUsingPlanningTypeOptions] = useState([])

  const initialized = async () => {
    //Bind Role List
    const response = await getGlobalParametersAPI({ TYPE_CODE: 'UAPTYPE', STATUS: 'Active' })
    if (response?.error) {
      toast.error(response.error.message)

      return
    }

    const data = response?.data
    if (data?.length > 0) {
      setUsingPlanningTypeOptions(
        data.map(item => ({ value: item.PARAMETER_CODE_3, label: item.PARAMETER_DESCRIPTION_3 }))
      )
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
                    name='UAP_ID'
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField value={value} disabled variant='outlined' label='ID' placeholder='AUTO' size='small' />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='DESCRIPTION'
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        inputProps={{ maxLength: 50 }}
                        label='DESCRIPTION'
                        onChange={onChange}
                        placeholder='PLEASE ENTER DESCRIPTION'
                        size='small'
                        error={Boolean(errors.DESCRIPTION)}
                        helperText={Boolean(errors.DESCRIPTION) && 'Required'}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='UAP_TYPE_ID'
                    control={control}
                    rules={{
                      required: 'Required'
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <Autocomplete
                          size='small'
                          options={usingPlanningTypeOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='TYPE'
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='TOOLTIP_TEXT'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        inputProps={{ maxLength: 200 }}
                        multiline
                        rows={2}
                        label='TOOLTIP TEXT'
                        onChange={onChange}
                        placeholder='PLEASE ENTER TOOLTIP TEXT'
                        size='small'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel id='field-type-label' sx={{ my: 1, ml: 1 }}>
                  FIELD TYPE
                </InputLabel>
                <FormControl fullWidth size='small' variant='filled'>
                  <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                    {fieldTypeOptions.map(item => (
                      <Controller
                        key={item.value}
                        name='FIELD_TYPE'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            value={item.value}
                            onChange={onChange}
                            control={
                              <Radio
                                id={`FIELD_TYPE${item.value}`}
                                sx={{ display: 'none' }}
                                checked={item.value == value}
                              />
                            }
                            label={
                              <label htmlFor={`FIELD_TYPE${item.value}`}>
                                <Card
                                  sx={{
                                    mx: 3,
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: Boolean(item.value == value) ? 'secondary.main' : 'common.white',
                                    color: Boolean(item.value == value) ? 'common.white' : 'secondary.main',
                                    borderColor: Boolean(errors.FIELD_TYPE) ? 'red' : ''
                                  }}
                                  variant='outlined'
                                >
                                  <IconifyIcon fontSize={30} icon={item.icon} />
                                  <Typography color={Boolean(item.value == value) ? 'common.white' : 'secondary.main'}>
                                    {item.label}
                                  </Typography>
                                </Card>
                              </label>
                            }
                          />
                        )}
                      />
                    ))}
                  </RadioGroup>
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {Boolean(errors.FIELD_TYPE) && 'Required'}
                  </FormHelperText>
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
