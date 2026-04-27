// ** MUI Imports
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Box,
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { alertTypes, changePasswordAPI, deleteSavedLinksAPI, getSavedLinksAPI, postSavedLinksAPI } from 'src/configs'
import { Controller, useForm } from 'react-hook-form'
import { Modal, NoRecordCard } from 'src/views/components'
import { useDispatch } from 'react-redux'
import { SavedSearchCard } from 'src/views/components/cards/saved-search-card'
import { LoadingButton } from '@mui/lab'

const pageTitle = 'Saved Search'

const defaultValues = {
  LINK_ID: null,
  ALERT_TYPE: null
}

const SavedSearch = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  const [savedSearch, setSavedSearch] = useState({ data: [], isLoading: false })
  const [selectedSavedSearch, setSelectedSavedSearch] = useState({})

  const [states, setStates] = useState({
    isSubmit: false,
    isOpenModal: false
  })

  const handleModalOpen = data => {
    setStates({ ...states, isOpenModal: true })
    setSelectedSavedSearch(data)
    setValue('LINK_ID', data.LINK_ID)
    setValue('ALERT_TYPE', data.ALERT_TYPE)
  }

  const bindList = () => {
    setSavedSearch({ ...savedSearch, isLoading: true })
    getSavedLinksAPI({ TYPE: 'L' }).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }

      setSavedSearch({ data: response?.data, isLoading: false })
    })
  }

  const handleDelete = async LINK_ID => {
    setStates({ ...states, isSubmit: true })
    await deleteSavedLinksAPI({ LINK_ID }).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }
      setSavedSearch({ ...savedSearch, data: savedSearch.data.filter(row => row.LINK_ID !== LINK_ID) })
      setStates({ ...states, isSubmit: false })
    })
  }

  const onSubmit = async data => {
    const params = {
      LINK_ID: data.LINK_ID,
      PROPERTY_ID: 0,
      TYPE: 'L',
      ALERT_TYPE: data.ALERT_TYPE
    }
    setStates({ ...states, isSubmit: true })
    await postSavedLinksAPI(params)
      .then(response => {
        if (response?.data[0]?.MESSAGE.includes('SUCCESSFULLY')) {
          toast.success(response?.data[0]?.MESSAGE)
          bindList()
          setStates({ ...states, isSubmit: false, isOpenModal: false })
          reset()
        }
      })
      .catch(() => {
        setStates({ ...states, isSubmit: false })

        toast.error('Failed to Saved!')
      })
  }

  const handleDiscard = () => {
    reset()
    setStates({ ...states, isOpenModal: false, isEdit: false })
  }
  useEffect(() => {
    bindList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Box display='flex' alignItems='center'>
                  Saved Search
                </Box>
              }
            />
            <CardContent>
              {savedSearch?.data?.length > 0 ? (
                savedSearch?.data?.map((row, index) => (
                  <Grid item xs={12} key={row.LINK_ID}>
                    <SavedSearchCard
                      data={row}
                      handleDelete={handleDelete}
                      handleModalOpen={handleModalOpen}
                      states={states}
                    />
                  </Grid>
                ))
              ) : (
                <NoRecordCard
                  title='No listings saved'
                  subtitle='Hit the ❤︎︎ to save your favorite properties and find them faster next time.'
                  variant='outlined'
                  borderLess={true}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal onsubmit={onsubmit} onClose={handleDiscard} isOpen={states.isOpenModal} title='Get search alerts'>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12}>
              <Alert icon={false} color='primary'>
                <AlertTitle>{selectedSavedSearch.DESCRIPTION}</AlertTitle>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              {alertTypes.map(item => (
                <Controller
                  key={item.value}
                  name='ALERT_TYPE'
                  defaultValue={alertTypes[0]}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      label={item.label}
                      value={item.value}
                      onChange={onChange}
                      control={<Radio color='secondary' checked={item.value == value} />}
                    />
                  )}
                />
              ))}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3} mt={0}>
                <Grid item xs={12} display='flex' justifyContent='center'>
                  <LoadingButton
                    loading={states.isSubmit}
                    type='submit'
                    size='large'
                    sx={{ mr: 2 }}
                    variant='contained'
                  >
                    Save my preference
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

export default SavedSearch
