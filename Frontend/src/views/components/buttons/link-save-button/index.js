import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import { alertTypes, postSavedLinksAPI } from 'src/configs'
import { useAuth } from 'src/hooks/useAuth'
import { Modal } from 'src/views/components'

const defaultValues = {
  LINK_ID: null,
  PROPERTY_ID: null,
  ACTIVE: false,
  TYPE: null,
  ALERT_TYPE: null,
  DESCRIPTION: null,
  CREATED_ON: null
}

const LinkSaveButton = ({
  PROPERTY_ID = null,
  ACTIVE = false,
  TYPE = 'P',
  DESCRIPTION = null,
  title = '',
  variant = 'text'
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })
  const { replace, asPath } = useRouter()
  const [isActive, setIsActive] = useState(false)

  const [states, setStates] = useState({
    isOpenModal: false,
    isSubmit: false
  })
  const { user } = useAuth()
  useEffect(() => {
    setIsActive(ACTIVE)
  }, [ACTIVE, PROPERTY_ID])

  const onSubmit = async data => {
    const params = {
      PROPERTY_ID: 0,
      ACTIVE: true,
      LINK: asPath,
      TYPE,
      DESCRIPTION: data.DESCRIPTION,
      ALERT_TYPE: data.ALERT_TYPE.value
    }
    setStates({ ...states, isSubmit: true })
    await postSavedLinksAPI(params)
      .then(response => {
        if (response?.data[0]?.MESSAGE.includes('SUCCESSFULLY')) {
          toast.success('Saved!')
          setStates({ ...states, isSubmit: false, isOpenModal: false })

          reset()
        }
      })
      .catch(() => {
        toast.error('Failed to Saved!')
      })
  }

  const handleDiscard = () => {
    reset()
    setStates({ ...states, isOpenModal: false, isEdit: false })
  }

  const postSavedLink = async () => {
    if (user?.usercode) {
      if (TYPE === 'L') {
        setStates({ ...states, isOpenModal: true })
      } else {
        const params = { PROPERTY_ID, ACTIVE: !ACTIVE, LINK: asPath, TYPE, DESCRIPTION }
        await postSavedLinksAPI(params)
          .then(response => {
            if (response?.data[0]?.MESSAGE.includes('SUCCESSFULLY')) {
              setIsActive(!isActive)
              if (!isActive) {
                toast.success('Saved!')
              } else {
                toast.success('Un Saved!')
              }
            }
          })
          .catch(() => {
            toast.error('Failed to Saved!')
          })
      }
    } else {
      replace(`/login/?returnUrl=${asPath}`)
    }
  }

  return (
    <>
      <Button
        onClick={postSavedLink}
        variant='contained'
        sx={{ borderRadius: 10, p: 1, ml: 1 }}
        color={isActive ? 'primary' : 'info'}
      >
        <Typography fontSize={12} variant='subtitle2' color='common.white' display='flex' alignItems='center'>
          <IconifyIcon icon={`tabler:heart${isActive ? '-filled' : ''}`} />
          {title.length > 0 ? title : ''}
        </Typography>
      </Button>

      <Modal
        onsubmit={onsubmit}
        onClose={handleDiscard}
        isOpen={states.isOpenModal}
        title='Save search and email alert'
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12}>
              <Grid container spacing={3} mt={0}>
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
                          inputProps={{ maxLength: 30 }}
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
                      name='ALERT_TYPE'
                      control={control}
                      rules={{
                        required: 'Required'
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Autocomplete
                            size='small'
                            options={alertTypes}
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

                <Grid item xs={12} display='flex' justifyContent='center'>
                  <LoadingButton
                    loading={states.isSubmit}
                    size='large'
                    type='submit'
                    sx={{ mr: 2 }}
                    variant='contained'
                  >
                    Save Your Search and alert
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
    </>
  )
}

export default LinkSaveButton
