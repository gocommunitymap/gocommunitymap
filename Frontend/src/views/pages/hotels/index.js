import {
  Autocomplete,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  LoadingButton
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import {
  bedsOptions,
  priceOptions,
  radiusOptions,
  propertyTypesOptions,
  mustHavesOptions,
  propertyStatusOptions,
  addedToSiteOptions,
  ieoOptions
} from 'src/configs'

const defaultValues = {
  radius: radiusOptions[0],
  minBeds: bedsOptions[0],
  maxBeds: bedsOptions[0],
  minPrice: priceOptions[0],
  maxPrice: priceOptions[0],
  propertyType: propertyTypesOptions[0].value,
  newHomes: ieoOptions[0].value,
  retirementHomes: ieoOptions[0].value,
  sharedOwnership: ieoOptions[0].value,
  auction: ieoOptions[0].value,
  mustHaves: [true, false, false],
  propertyStatus: null,
  addedToSite: addedToSiteOptions[0],
  keywords: null
}

export const FilterDrawer = ({ isDrawerOpen, setIsDrawerOpen, filterState, setFilterState, store }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    setIsDrawerOpen(false)
    setFilterState(data)
  }

  useEffect(() => {
    if (filterState) {
      const obj = Object?.keys(filterState)
      for (let i = 0; i < obj?.length; i++) {
        setValue(obj[i], data[obj[i]])
      }
    }
  }, [isDrawerOpen])

  return (
    <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Typography variant='h5' m={5} display='flex' alignItems='center'>
          Advance Filter
          <IconifyIcon icon='tabler:filter-search' style={{ fontSize: 30 }} />
        </Typography>
        <Box px={5} sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <List sx={{ minWidth: 400 }}>
            <ListItem>
              <FormControl fullWidth size='small'>
                <Controller
                  name='radius'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        size='small'
                        options={radiusOptions}
                        disableClearable
                        value={field.value?.value ? field.value : null}
                        getOptionLabel={option => option.label}
                        onChange={(_, data) => field.onChange(data)}
                        renderInput={params => (
                          <TextField {...params} label='Radius' placeholder='select Radius' variant='outlined' />
                        )}
                      />
                    )
                  }}
                />
              </FormControl>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Bedrooms
                </Typography>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='minBeds'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={bedsOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Min' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='maxBeds'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={bedsOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Max' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Price
                </Typography>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='minPrice'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={priceOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Min' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size='small'>
                      <Controller
                        name='maxPrice'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                              size='small'
                              options={priceOptions}
                              disableClearable
                              value={field.value?.value ? field.value : null}
                              getOptionLabel={option => option.label}
                              onChange={(_, data) => field.onChange(data)}
                              renderInput={params => <TextField {...params} label='Max' variant='outlined' />}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Property type
                </Typography>
                <FormControl fullWidth size='small' variant='filled'>
                  <RadioGroup
                    row
                    aria-label='propertyTypes-label'
                    name='propertyTypes-group'
                    defaultValue='primary'
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {propertyTypesOptions.map(item => (
                      <Controller
                        key={item.value}
                        name='propertyType'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            sx={{ minWidth: 110 }}
                            value={item.value}
                            onChange={onChange}
                            control={<Radio color='secondary' checked={item.value === value} />}
                            label={item.label}
                          />
                        )}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold' mb={3}>
                  Property type
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            New Homes:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='newHomes'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            Retirement Homes:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='retirementHomes'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            Shared Ownership:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='sharedOwnership'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <Typography variant='body2' fontWeight='bold' my={3} mr={2}>
                            Auction:
                          </Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <ButtonGroup>
                            {ieoOptions.map(item => (
                              <Controller
                                key={item.value}
                                name='auction'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Button
                                    onClick={() => onChange}
                                    sx={{ width: 120, height: 40, fontSize: 12, p: 1 }}
                                    variant={item.value === value ? 'contained' : 'outlined'}
                                  >
                                    {item.label}
                                    <FormControlLabel
                                      sx={{
                                        m: 0,
                                        p: 0,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        opacity: 0
                                      }}
                                      value={item.value}
                                      onChange={onChange}
                                      control={
                                        <Radio color='secondary' id={item.value} checked={item.value === value} />
                                      }
                                    />
                                  </Button>
                                )}
                              />
                            ))}
                          </ButtonGroup>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Must Have
                </Typography>
                <FormGroup>
                  <Grid container spacing={3}>
                    {mustHavesOptions.map((item, index) => (
                      <Grid key={index} item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={`mastHave-${item.value}`}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              label={item.label}
                              control={<Checkbox color='secondary' checked={value} onChange={onChange} />}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Property Status
                </Typography>
                <FormGroup>
                  <Grid container spacing={3}>
                    {propertyStatusOptions.map((item, index) => (
                      <Grid key={index} item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={`propertyStatus-${item.value}`}
                          render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                              label={item.label}
                              control={<Checkbox color='secondary' checked={value} onChange={onChange} />}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Added to site
                </Typography>
                <FormGroup>
                  <RadioGroup name='addedToSite-group' defaultValue={addedToSiteOptions[0]}>
                    <Grid container spacing={3}>
                      {addedToSiteOptions.map(item => (
                        <Controller
                          key={item.value}
                          name='addedToSite'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              label={item.label}
                              value={item.value}
                              onChange={onChange}
                              control={<Radio color='secondary' id={item.value} checked={item.value === value} />}
                            />
                          )}
                        />
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormGroup>
              </Box>
            </ListItem>
            <Divider component='li' sx={{ my: 3 }} />
            <ListItem>
              <Box sx={{ width: { md: 600, xs: '100%' } }}>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Keywords
                </Typography>

                <Controller
                  name='keywords'
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      inputProps={{ maxLength: 100 }}
                      label='Keywords'
                      onChange={onChange}
                      placeholder='NAME'
                      size='small'
                    />
                  )}
                />
                <Typography variant='body2'>
                  Search for phrases by using quotation marks e.g. “double garage”, or exclude terms by prefixing them
                  with a minus sign e.g. -studio.
                </Typography>
              </Box>
            </ListItem>
          </List>
        </Box>
        <Box textAlign='center' p={5}>
          <Button variant='outlined' onClick={() => setIsDrawerOpen(false)} sx={{ mr: 3 }}>
            Clear Filter
          </Button>
          <LoadingButton type='submit' variant='contained'>
            Apply Filter
          </LoadingButton>
        </Box>
      </form>
    </Drawer>
  )
}
