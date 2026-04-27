import { Grid, FormControl, TextField, Button, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { getRoleMasterAPI } from 'src/configs'
import { useEffect, useState } from 'react'
import { statusOptions, setStatusOptions } from './static-data'
import { dateConvert } from 'src/@core/utils'

export const ModalForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  const [roleOptions, setRoleOptions] = useState([])

  const initialized = async () => {
    //Bind Role List
    const response = await getRoleMasterAPI({ STATUS: 'Active' })
    if (response?.error) {
      toast.error(response.error.message)

      return
    }
    const roleData = response?.data //.filter(i => i.ROLE_CODE !== 1)
    if (roleData?.length > 0) {
      setRoleOptions(roleData.map(item => ({ value: item.ROLE_CODE, label: item.ROLE_NAME })))
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
      modelMaxWidth={500}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} mt={0}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Controller
                name='USER_CODE'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    variant='outlined'
                    label='USER CODE'
                    placeholder='USER CODE auto'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl fullWidth size='small'>
              <Controller
                name='role'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={roleOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='USER ROLE'
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
                name='USER_NAME'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    inputProps={{ maxLength: 30 }}
                    label='USER NAME'
                    disabled={states.isEdit}
                    onChange={onChange}
                    placeholder='USER NAME'
                    size='small'
                    error={Boolean(errors.USER_NAME)}
                    helperText={Boolean(errors.USER_NAME) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='EMAIL'
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid Email Address'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='email'
                    value={value}
                    disabled={states.isEdit}
                    inputProps={{ maxLength: 50 }}
                    label='EMAIL ADDRESS'
                    onChange={onChange}
                    placeholder='EMAIL ADDRESS'
                    size='small'
                    error={Boolean(errors.EMAIL)}
                    helperText={Boolean(errors.EMAIL) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='PASSWORD'
                control={control}
                rules={
                  states.isEdit
                    ? { required: false }
                    : {
                        required: true,
                        minLength: 5,
                        maxLength: 15
                      }
                }
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    disabled={states.isEdit}
                    inputProps={{ maxLength: 15 }}
                    label='PASSWORD'
                    onChange={onChange}
                    placeholder='PASSWORD'
                    size='small'
                    error={Boolean(!states.isEdit && errors.PASSWORD)}
                    helperText={Boolean(!states.isEdit && errors.PASSWORD) && 'Required Length 5 to 15 characters'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='CONTACT_NO'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    inputProps={{ maxLength: 15 }}
                    label='CONTACT No'
                    onChange={onChange}
                    placeholder='CONTACT No'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size='small'>
              <Controller
                name='STATUS'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={statusOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='STATUS'
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Controller
                name='CREATED_ON'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={dateConvert(value)}
                    disabled
                    variant='outlined'
                    color='secondary'
                    label='CREATED DATE'
                    placeholder='CREATED DATE auto'
                    size='small'
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
