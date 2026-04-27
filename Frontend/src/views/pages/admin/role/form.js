import {
  Grid,
  FormControl,
  TextField,
  Switch,
  Button,
  InputLabel,
  FormControlLabel,
  Autocomplete,
  RadioGroup,
  Radio,
  Box,
  Card,
  CardActions,
  Input,
  Divider,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { blue, grey, teal } from '@mui/material/colors'
import { dateConvert } from 'src/@core/utils'
import { useEffect, useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { getFormsAPI } from 'src/configs/services'
import Icon from 'src/@core/components/icon'

export const ModalForm = ({
  control,
  states,
  handleDiscard,
  onSubmit,
  handleSubmit,
  errors,
  pageTitle,
  setValue,
  watch
}) => {
  const [forms, setForms] = useState([])
  const [formPermissions, setFormPermissions] = useState([])
  const [moduleFrmPerDetails, setModuleFrmPerDetails] = useState([])

  const findPermission = (form_id, type_value) => {
    try {
      if (form_id === 4) {
      }
      let data = watch('detail')
      data = data.filter(i => i.form_id === form_id)

      const _data = data[0].permissions.split(',')

      return _data.find(i => i === type_value)
    } catch (error) {
      return false
    }
  }

  const initialized = async () => {
    //Bind Item Type List
    const formsResponse = await getFormsAPI()
    if (formsResponse?.error) {
      return
    }

    const formsData = formsResponse?.data?.map(item => {
      const per_dtl = JSON.parse(item.per_dtl)

      const permissions = per_dtl?.map(row => ({
        ...row,
        allowed: states.isEdit ? findPermission(item.form_id, row.value) : false
      }))

      return {
        ...item,
        permissions
      }
    })
    setFormPermissions(
      formsData?.filter(i => i.path !== null).map(m => ({ ...m, form_id: m.form_id, permissions: m.permissions }))
    )
    let menu = []

    const navLevel1 = formsData?.filter(i => i.parent_id === null)
    for (let a = 0; a < navLevel1?.length; a++) {
      let n1 = navLevel1[a]
      const navLevel2 = formsData.filter(i => i.parent_id === n1.form_id)
      if (navLevel2?.length) {
        n1 = { ...n1, children: navLevel2 }
      }
      menu.push(n1)
      menu = menu?.length ? menu : [menu]

      //----------------------------------------------------------------//
      for (let b = 0; b < navLevel2?.length; b++) {
        let n2 = navLevel2[b]
        let nl1 = menu.filter(i => i.form_id === n2.parent_id)
        const navLevel3 = formsData.filter(i => i.parent_id === n2.form_id)
        if (navLevel3?.length) {
          n2 = { ...n2, children: navLevel3 }
        }
        nl1[a] = n2

        menu[a].children[b] = nl1[a]
      }
    }
    setForms(menu)
  }

  useEffect(() => {
    initialized()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states])

  const handleRightsAll = async ({ event, id }) => {
    const updateFormPermissions = formPermissions

    for (let i = 0; i < updateFormPermissions?.length; i++) {
      const permissions = updateFormPermissions[i].permissions

      if (updateFormPermissions[i].parent_id === id) {
        const updatePermissions = await permissions.map(x => ({ ...x, allowed: event.target.checked }))
        updateFormPermissions[i].permissions = updatePermissions
      }
    }

    const roleData = updateFormPermissions.map(item => {
      const updateType = item.permissions?.reduce((prev, curr) => {
        return `${prev}${curr.allowed ? `${curr.value},` : ''}`
      }, '')

      return { form_id: item.form_id, permissions: updateType?.substring(0, updateType?.length - 1) }
    })

    setFormPermissions([...updateFormPermissions])
    setValue('detail', roleData)
  }

  const onCheckChanged = ({ event, id, rights }) => {
    let form = formPermissions.find(i => i.form_id === id)

    let permissions = form.permissions

    for (let i = 0; i < permissions?.length; i++) {
      if (rights === permissions[i].value) {
        permissions[i].allowed = Boolean(event.target.checked)
      }
    }

    const filteredFormPermission = formPermissions.filter(i => i.form_id !== form.form_id)
    filteredFormPermission.push({ form_id: form.form_id, permissions })

    setFormPermissions(filteredFormPermission)

    const roleData = filteredFormPermission.map(item => {
      const updateType = item.permissions.reduce((prev, curr) => {
        return `${prev}${curr.allowed ? `${curr.value},` : ''}`
      }, '')

      return { form_id: item.form_id, permissions: updateType.substring(0, updateType?.length - 1) }
    })
    setValue('detail', roleData)
  }

  const isChecked = ({ id, rights }) => {
    const form = formPermissions.find(i => i.form_id === id)
    const formPermission = form.permissions.find(i => i.value === rights)

    return Boolean(formPermission.allowed)
  }

  return (
    <Modal
      onsubmit={onsubmit}
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
      modelMaxWidth={1500}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} mb={4} mt={1}>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <Controller
                name='role_code'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    sx={{ backgroundColor: grey[100] }}
                    variant='outlined'
                    color='secondary'
                    label='ROLE CODE'
                    placeholder='ROLE CODE AUTO'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <Controller
                name='role_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='ROLE NAME'
                    onChange={onChange}
                    placeholder='ROLE NAME'
                    size='small'
                    error={Boolean(errors.iname)}
                    helperText={Boolean(errors.title) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2} display='flex' justifyContent='left'>
            <InputLabel style={{ marginTop: 9, marginRight: 5 }}>Active</InputLabel>
            <FormControl>
              <Controller
                name='active'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Switch color='secondary' checked={value} />}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Controller
                name='created_on'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={dateConvert(value)}
                    disabled
                    sx={{ backgroundColor: grey[100] }}
                    variant='outlined'
                    color='secondary'
                    label='CREATED DATE'
                    placeholder='auto'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            {forms.map(item_1 => {
              return (
                <Accordion defaultExpanded key={item_1.form_id}>
                  <AccordionSummary
                    sx={{ bgcolor: grey[100] }}
                    id={item_1.form_id}
                    aria-controls={item_1.form_id}
                    expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
                  >
                    <FormControlLabel
                      label={item_1.title}
                      control={<Checkbox color='secondary' disableRipple id={`${item_1.form_id}`} />}
                      onClick={event => event.stopPropagation()}
                      onFocus={event => event.stopPropagation()}
                      onChange={event => handleRightsAll({ event, id: item_1.form_id })}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table size='small'>
                      <TableBody>
                        {item_1.children?.map((item_2, item2_index) => {
                          return (
                            <TableRow key={`${item_1.form_id}-${item_2.form_id}`}>
                              {item_2.path !== null && (
                                <TableCell width={350} sx={{ py: 0 }}>
                                  {item_2.title}
                                  {/* <FormControlLabel
                                    label=''
                                    control={<Checkbox color='secondary' disableRipple id={`${item_2.form_id}`} />}
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    onChange={event => handleRowRightsAll({ event, id: item_2.form_id })}
                                  /> */}
                                </TableCell>
                              )}
                              <TableCell colSpan={item_2.path === null ? 2 : 1} sx={{ p: '0 !important' }}>
                                <div style={{ paddingLeft: 18 }}>
                                  {item_2.path !== null &&
                                    item_2.permissions?.map(per => (
                                      <label key={`${item_1.form_id}-${item_2.form_id}-${per.value}`}>
                                        <Typography variant='caption' mr={1}>
                                          {per.label}
                                          <Checkbox
                                            color='secondary'
                                            sx={{ width: 40 }}
                                            disableRipple
                                            id={`${item_2.form_id}-${per.value}`}
                                            checked={isChecked({ id: item_2.form_id, rights: per.value })}
                                            onChange={event =>
                                              onCheckChanged({ event, id: item_2.form_id, rights: per.value })
                                            }
                                          />
                                        </Typography>
                                      </label>
                                    ))}
                                </div>
                                <Box key={item_2.form_id} m={0}>
                                  <Table size='small' m={0}>
                                    <TableBody>
                                      {item_2.children?.map((item_3, index) => {
                                        return (
                                          <TableRow key={`${item_1.form_id}-${item_2.form_id}-${item_3.form_id}`}>
                                            {index === 0 && (
                                              <TableCell
                                                rowSpan={item_2.children?.length}
                                                width={200}
                                                sx={{ p: 0 }}
                                                bgcolor={grey[200]}
                                              >
                                                {item_2.title}
                                              </TableCell>
                                            )}
                                            <TableCell width={150} sx={{ py: 0 }}>
                                              {item_3.title}
                                            </TableCell>
                                            <TableCell sx={{ py: 0 }}>
                                              {item_3.path !== null &&
                                                item_3.permissions.map(per => (
                                                  <label
                                                    key={`${item_1.form_id}-${item_2.form_id}-${item_3.form_id}-${per.value}`}
                                                  >
                                                    <Typography variant='caption' mr={1}>
                                                      {per.label}
                                                      <Checkbox
                                                        color='secondary'
                                                        sx={{ width: 40 }}
                                                        disableRipple
                                                        size='small'
                                                        id={`${item_3.form_id}-${per.value}`}
                                                        checked={isChecked({ id: item_3.form_id, rights: per.value })}
                                                        onChange={event =>
                                                          onCheckChanged({
                                                            event,
                                                            id: item_3.form_id,
                                                            rights: per.value
                                                          })
                                                        }
                                                      />
                                                    </Typography>
                                                  </label>
                                                ))}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      })}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              )
            })}
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
