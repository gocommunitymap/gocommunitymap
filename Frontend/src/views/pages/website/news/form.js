import {
  Grid,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  InputLabel,
  FormControlLabel,
  Switch,
  Card,
  CardHeader,
  Typography,
  FormHelperText,
  FormGroup,
  Checkbox,
  Divider
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { getFileAPI, getGlobalParametersAPI, getRoleMasterAPI } from 'src/configs'
import { useEffect, useState } from 'react'
import { statusOptions, setStatusOptions } from './static-data'
import { dateConvert, validateFileFormat } from 'src/@core/utils'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import Image from 'next/image'
import { Box } from '@mui/system'
import { grey, red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'

export const ModalForm = ({
  control,
  states,
  setValue,
  handleDiscard,
  onSubmit,
  handleSubmit,
  errors,
  setError,
  clearErrors,
  pageTitle,
  setFile,
  file,
  watch
}) => {
  const theme = useTheme()
  const [picture, setPicture] = useState('')
  const [displayTypeOptions, setDisplayTypeOptions] = useState([])

  const setDisplayTypes = async () => {
    const response = await getGlobalParametersAPI({ TYPE_CODE: 'DSPLYTYPE', ALLOWED: false, ACTIVE: true })
    if (response?.error) {
      toast.error(response.error.message)

      return []
    }
    if (response.data?.length > 0) {
      setDisplayTypeOptions(
        response?.data?.map(item => ({
          value: item.PARAMETER_CODE_3,
          label: item.PARAMETER_DESCRIPTION_3
        }))
      )
    }
  }

  useEffect(() => {
    setPicture('')
    setDisplayTypes()
  }, [states.isOpenModal])

  const handleImageChange = e => {
    const reader = new FileReader(),
      files = e.target.files
    setFile(files[0])
    reader.onload = function () {
      setPicture(reader.result)
    }

    if (reader && files[0]) {
      const isValidFileFormat = validateFileFormat(files[0], 'image')
      if (isValidFileFormat) {
        reader?.readAsDataURL(files[0])

        setValue('PICTURE_LINK', 'newFile')

        clearErrors('PICTURE_LINK')

        return
      }
      setError('PICTURE_LINK')
    }
  }

  return (
    <Modal
      onsubmit={onsubmit}
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
      modelMaxWidth={900}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} mt={0}>
          <Grid item xs={12} md={4} textAlign='center'>
            <FormControl>
              <Controller
                name='PICTURE_LINK'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value } }) => (
                  <Card
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      width: 150,
                      height: 150,
                      zIndex: 5,
                      borderWidth: 1,
                      borderRightStyle: 'solid',
                      borderColor: errors.PICTURE_LINK && theme.palette.error.main
                    }}
                    variant='outlined'
                  >
                    <label htmlFor='imgButton'>
                      <Box>
                        <img
                          src={`${
                            picture?.length > 0 ? picture : value.length ? value : '/images/default/default-news.jpg'
                          }`}
                          alt='image'
                          style={{ cursor: 'pointer' }}
                          width='100%'
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            zIndex: 10,
                            bottom: 1,
                            width: 148,
                            fontSize: 16,

                            py: 1,
                            borderRadius: 1,
                            backgroundColor: grey[100],
                            color: grey[500],
                            cursor: 'pointer'
                          }}
                          for='imgButton'
                          variant='contained'
                          fullWidth
                        >
                          UPLOAD
                          {/* {avatar.length ? 'CHANGE' : 'UPLOAD'} */}
                        </Box>
                      </Box>
                    </label>
                    <input id='imgButton' onChange={handleImageChange} type='file' hidden accept='image/*' />
                  </Card>
                )}
              />
            </FormControl>
            {errors.PICTURE_LINK && (
              <FormHelperText error sx={{ textAlign: 'center' }}>
                Required
              </FormHelperText>
            )}
            <Typography variant='body2' fontSize={10} fontWeight='bold'>
              [.jpg, .jpeg, .png, .gif]
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3} mt={0}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <Controller
                    name='NEWS_ID'
                    control={control}
                    render={({ field: { value } }) => (
                      <TextField
                        value={value}
                        disabled
                        variant='outlined'
                        label='NEWS ID'
                        placeholder='NEWS ID'
                        size='small'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <Controller
                    name='NEWS_DATE'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper>
                        <ReactDatePicker
                          isClearable
                          showMonthDropdown
                          showYearDropdown
                          selected={value}
                          dateFormat='dd-MMM-yyyy'
                          id='NEWS_DATE_FIELD'
                          popperPlacement='auto'
                          popperProps={{ strategy: 'fixed' }}
                          onChange={onChange}
                          placeholderText='Select a date'
                          customInput={
                            <TextField
                              fullWidth
                              label='NEWS DATE'
                              placeholder='NEWS DATE'
                              size='small'
                              error={Boolean(errors.NEWS_DATE)}
                              helperText={Boolean(errors.NEWS_DATE) && 'Required'}
                            />
                          }
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
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
                        placeholder='Minimum 1'
                        size='small'
                        error={Boolean(errors.SORT_ORDER)}
                        helperText={Boolean(errors.SHORT_DESCRIPTION) && 'Required'}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='NEWS_TITLE'
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        multiline
                        inputProps={{ maxLength: 100 }}
                        label='NEWS TITLE'
                        onChange={onChange}
                        placeholder='PLEASE ENTER NEWS TITLE'
                        size='small'
                        error={Boolean(errors.NEWS_TITLE)}
                        helperText={Boolean(errors.NEWS_TITLE) && 'Required'}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='ACTIVE_FROM'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper>
                        <ReactDatePicker
                          isClearable
                          showMonthDropdown
                          showYearDropdown
                          selected={value}
                          dateFormat='dd-MMM-yyyy'
                          id='ACTIVE_FROM_FIELD'
                          popperPlacement='auto'
                          popperProps={{ strategy: 'fixed' }}
                          onChange={onChange}
                          placeholderText='Select a date'
                          customInput={
                            <TextField
                              fullWidth
                              label='ACTIVE FROM'
                              placeholder='ACTIVE FROM'
                              size='small'
                              error={Boolean(errors.ACTIVE_FROM)}
                              helperText={Boolean(errors.ACTIVE_FROM) && 'Required'}
                            />
                          }
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='ACTIVE_TO'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper>
                        <ReactDatePicker
                          isClearable
                          showMonthDropdown
                          showYearDropdown
                          selected={value}
                          dateFormat='dd-MMM-yyyy'
                          id='ACTIVE_TO_FIELD'
                          popperPlacement='auto'
                          popperProps={{ strategy: 'fixed' }}
                          onChange={onChange}
                          placeholderText='Select a date'
                          customInput={
                            <TextField
                              fullWidth
                              label='ACTIVE TO'
                              placeholder='ACTIVE TO'
                              size='small'
                              error={Boolean(errors.ACTIVE_TO)}
                              helperText={Boolean(errors.ACTIVE_TO) && 'Required'}
                            />
                          }
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='SHORT_DESCRIPTION'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    multiline
                    inputProps={{ maxLength: 200 }}
                    label='SHORT DESCRIPTION'
                    onChange={onChange}
                    placeholder='SHORT DESCRIPTION (Maximum 200 CHARACTERS)'
                    size='small'
                    error={Boolean(errors.SHORT_DESCRIPTION)}
                    helperText={Boolean(errors.SHORT_DESCRIPTION) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='subtitle1'>Display On</Typography>
            <FormGroup>
              <Box border='solid #ccc 1px' borderRadius={1} textAlign='center'>
                <Grid container>
                  {displayTypeOptions.map((item, index) => (
                    <Grid item lg={3} md={6} xs={12} key={index}>
                      <Controller
                        control={control}
                        name={`DISPLAY_TYPE_${item.value}`}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            control={
                              <Box>
                                <InputLabel
                                  htmlFor={item.value}
                                  style={{ cursor: 'pointer', marginTop: 9, marginRight: 5 }}
                                >
                                  {item.label}
                                </InputLabel>
                                <Typography fontSize={12} fontWeight='bold'>
                                  No
                                  <Switch
                                    color='secondary'
                                    id={item.value}
                                    defaultChecked
                                    checked={value}
                                    onChange={onChange}
                                  />
                                  Yes
                                </Typography>
                              </Box>
                            }
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={3} display='flex' justifyContent='left'>
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
