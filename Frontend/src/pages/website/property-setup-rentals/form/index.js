import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip, CardContent, Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getPropertySetupRental, updatePropertySetupRental, deletePropertySetupRental } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/property-setup-rentals/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/property-setup-rentals/form'
import DeleteModal from 'src/views/components/modal/delete-modal'
import Link from 'next/link'
import { getPropertySetupRentalAPI, listingTypes } from 'src/configs'
import { useParams, useSearchParams } from 'next/navigation'
import FallbackSpinner from 'src/@core/components/spinner-with-logo'
import { useRouter } from 'next/router'

const pageTitle = 'Rental Properties Setup'

const defaultValues = {
  PROPERTY_ID: null,
  SITE_STATUS_ID: null,
  LISTING_STATUS_ID: null,
  FULLPOSTCODE: null,
  PROPERTY_NUM_NAME: null,
  STREET_NAME: null,
  AREA_TOWN_CITY: null,
  OWN_REF: null,
  LATITUDE: null,
  LONGITUDE: null,
  PLACE: null,
  MAP_URL: null,
  PROPERTY_TYPE_ID: null,
  RETIREMENT_HOME: false,
  SHARED_ACCOMMODATION: false,
  SHORT_LET: false,
  STUDENT_ACCEPTED: false,
  TENURE_ID: null,
  COUNCIL_TAX_BAND_ID: null,
  ISEXEMPT: null,
  PRICE: null,
  LETTINGS_DEPOSIT_PAYABLE: null,
  LETTING_ARRANGEMENTS: null,
  FEE_APPLY_ID: null,
  RENTAL_FREQUENCY_ID: null,
  VIDEO_VIRTUALS_LINK: null,
  BEDROOMS_ID: null,
  BATHROOMS_ID: null,
  RECEPTIONS_ID: null,
  FLOORS_ID: null,
  SIZE: null,
  UNITS_ID: null,
  FURNISHED_ID: null,
  SUMMARY: null,
  FULLDESCRIPTION: null,
  PLANNING_CONSIDERATIONS: null,
  CURRENT_ERR_RATING: null,
  POTENTIAL_ERR_RATING: null,
  CONTENT_FILE_LINK: null,
  ACTIVE: true,
  CREATED_ON: null
}

const Form = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()
  const searchParams = useSearchParams()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({ defaultValues })

  // const store = useSelector(state => state.propertySetupRental)
  const [files, setFiles] = useState([])
  const [additionalFeatures, setAdditionalFeatures] = useState([{ value: 1, label: '' }])
  const [file, setFile] = useState([])
  const { replace } = useRouter()

  const [states, setStates] = useState({
    isLoading: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [deleteStates, setDeleteStates] = useState({ PROPERTY_ID: null, PROPERTY_NUM_NAME: null })
  const [PICTURE_LINKS, setPICTURE_LINKS] = useState([])
  const [features, setFeatures] = useState([])
  const [utilities, setUtilities] = useState([])
  const [usingPlanning, setUsingPlanning] = useState([])

  const [PLACE, setPLACE] = useState('')

  const [CUSTOM_FEATURES, setCUSTOM_FEATURES] = useState([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])
  const [CONTENT_TYPE_PICTURE_LINKS, setCONTENT_TYPE_PICTURE_LINKS] = useState('')

  const handleEdit = row => {
    setValue('PROPERTY_ID', row.PROPERTY_ID)
    setValue('SITE_STATUS_ID', { value: row.SITE_STATUS_ID, label: row.SITE_STATUS_DESC })
    setValue('LISTING_STATUS_ID', { value: row.LISTING_STATUS_ID, label: row.LISTING_STATUS_DESC })
    setValue('FULLPOSTCODE', row.FULLPOSTCODE)
    setValue('PROPERTY_NUM_NAME', row.PROPERTY_NUM_NAME)
    setValue('STREET_NAME', row.STREET_NAME)
    setValue('AREA_TOWN_CITY', row.AREA_TOWN_CITY)
    setValue('OWN_REF', row.OWN_REF)
    setValue('LATITUDE', row.LATITUDE)
    setValue('LONGITUDE', row.LONGITUDE)
    setValue('PLACE', row.PLACE)
    setPLACE(row.PLACE)
    setValue('MAP_URL', row.MAP_URL)
    setValue('PROPERTY_TYPE_ID', { value: row.PROPERTY_TYPE_ID, label: row.PROPERTY_TYPE_DESC })
    setValue('RETIREMENT_HOME', row.RETIREMENT_HOME)
    setValue('SHARED_ACCOMMODATION', row.SHARED_ACCOMMODATION)
    setValue('SHORT_LET', row.SHORT_LET)
    setValue('STUDENT_ACCEPTED', row.STUDENT_ACCEPTED)
    setValue('TENURE_ID', { value: row.TENURE_ID, label: row.TENURE_DESC })
    setValue('COUNCIL_TAX_BAND_ID', { value: row.COUNCIL_TAX_BAND_ID, label: row.COUNCIL_TAX_BAND_DESC })
    setValue('ISEXEMPT', row.ISEXEMPT)
    setValue('PRICE', row.PRICE)
    setValue('LETTINGS_DEPOSIT_PAYABLE', row.LETTINGS_DEPOSIT_PAYABLE)
    setValue('LETTING_ARRANGEMENTS', row.LETTING_ARRANGEMENTS)
    setValue('FEE_APPLY_ID', { value: row.FEE_APPLY_ID, label: row.FEE_APPLY_DESC })
    setValue('RENTAL_FREQUENCY_ID', { value: row.RENTAL_FREQUENCY_ID, label: row.RENTAL_FREQUENCY_DESC })
    setValue('VIDEO_VIRTUALS_LINK', row.VIDEO_VIRTUALS_LINK)
    setValue('BEDROOMS_ID', { value: row.BEDROOMS_ID, label: row.BEDROOMS_DESC })
    setValue('BATHROOMS_ID', { value: row.BATHROOMS_ID, label: row.BATHROOMS_DESC })
    setValue('RECEPTIONS_ID', { value: row.RECEPTIONS_ID, label: row.RECEPTIONS_DESC })
    setValue('FLOORS_ID', { value: row.FLOORS_ID, label: row.FLOORS_DESC })
    setValue('SIZE', row.SIZE)
    setValue('UNITS_ID', { value: row.UNITS_ID, label: row.UNITS_DESC })
    setValue('FURNISHED_ID', { value: row.FURNISHED_ID, label: row.FURNISHED_DESC })
    setValue('SUMMARY', row.SUMMARY)
    setValue('FULLDESCRIPTION', row.FULLDESCRIPTION)
    setValue('PLANNING_CONSIDERATIONS', row.PLANNING_CONSIDERATIONS)
    setValue('CURRENT_ERR_RATING', row.CURRENT_ERR_RATING)
    setValue('POTENTIAL_ERR_RATING', row.POTENTIAL_ERR_RATING)
    setValue('CONTENT_TYPE_ID', { value: row.CONTENT_TYPE_ID, label: row.CONTENT_TYPE_DESC })
    setValue('CONTENT_FILE_LINK', row.CONTENT_FILE_LINK)
    setValue('ACTIVE', row.ACTIVE)
    setPICTURE_LINKS(row.PICTURE_LINKS?.length > 0 ? JSON.parse(row.PICTURE_LINKS) : '')
    setCONTENT_TYPE_PICTURE_LINKS(
      row.CONTENT_TYPE_PICTURE_LINKS?.length > 0 ? JSON.parse(row.CONTENT_TYPE_PICTURE_LINKS) : ''
    )
    setFeatures(row.PROPERTY_FEATURES?.length > 0 ? JSON.parse(row.PROPERTY_FEATURES) : [])
    setUtilities(row.PROPERTY_UTILITIES?.length > 0 ? JSON.parse(row.PROPERTY_UTILITIES) : [])
    setUsingPlanning(row.PROPERTY_UAP?.length > 0 ? JSON.parse(row.PROPERTY_UAP) : [])
    setCUSTOM_FEATURES(row.CUSTOM_FEATURES?.length > 0 ? JSON.parse(row.CUSTOM_FEATURES) : [])
    setStates({ ...states, isEdit: true })
  }

  const initialized = async () => {
    const id = searchParams.get('id')
    if (id?.length > 0) {
      setStates({ ...states, isLoading: true })
      await getPropertySetupRentalAPI({ PROPERTY_ID: id }).then(response => {
        const row = response?.data?.find(row => row.PROPERTY_ID == id)
        if (response.data.length > 0) {
          const row = response?.data?.find(row => row.PROPERTY_ID == id)

          handleEdit(row)
        } else {
          toast.error('No Data Found!', { position: 'top-center' })
        }
        setStates({ ...states, isLoading: false })
      })
    }
  }
  useEffect(() => {
    initialized()
  }, [searchParams])

  const handleDiscard = () => {
    reset()

    setFiles([])
    setFile([])
    setAdditionalFeatures({ value: 1, label: '' })
    setDeleteStates({ PROPERTY_ID: null, PROPERTY_NUM_NAME: null })
    setPICTURE_LINKS([])
    setFeatures([])
    setUtilities([])
    setUsingPlanning([])
    setPLACE('')
    setCUSTOM_FEATURES([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])
    setCONTENT_TYPE_PICTURE_LINKS('')
    setStates({ ...states, isOpenModal: false, isEdit: false })
    setPICTURE_LINKS([])
    document.getElementById('icons-start-adornment').value = ''
  }

  const handleRefresh = () => {
    reset()
    setStates({
      isLoading: false,
      pageSize: 5,
      modalForm: 'c',
      isSubmit: false
    })

    setPICTURE_LINKS([])
    setCONTENT_TYPE_PICTURE_LINKS('')
    setFeatures([])
    setUtilities([])
    setUsingPlanning([])
    setCUSTOM_FEATURES([{ CUSTOM_FEATURES_ID: 1, DESCRIPTION: '', PROPERTY_ID: 0 }])
    setFile([])
    setFiles([])
  }

  const onSubmit = data => {
    setStates({ ...states, isSubmit: true })
    dispatch(
      updatePropertySetupRental({
        data: {
          PROPERTY_ID: data.PROPERTY_ID,
          SITE_STATUS_ID: data.SITE_STATUS_ID.value,
          LISTING_STATUS_ID: data.LISTING_STATUS_ID.value,
          FULLPOSTCODE: data.FULLPOSTCODE,
          PROPERTY_NUM_NAME: data.PROPERTY_NUM_NAME,
          STREET_NAME: data.STREET_NAME,
          AREA_TOWN_CITY: data.AREA_TOWN_CITY,
          OWN_REF: data.OWN_REF,
          LATITUDE: data.LATITUDE,
          LONGITUDE: data.LONGITUDE,
          PLACE,
          MAP_URL: data.MAP_URL,
          PROPERTY_TYPE_ID: data.PROPERTY_TYPE_ID?.value,
          RETIREMENT_HOME: data.RETIREMENT_HOME,
          SHARED_ACCOMMODATION: data.SHARED_ACCOMMODATION,
          SHORT_LET: data.SHORT_LET,
          STUDENT_ACCEPTED: data.STUDENT_ACCEPTED,
          TENURE_ID: data.TENURE_ID?.value,
          COUNCIL_TAX_BAND_ID: data.COUNCIL_TAX_BAND_ID?.value,
          ISEXEMPT: data.ISEXEMPT,
          PRICE: data.PRICE,
          LETTINGS_DEPOSIT_PAYABLE: data.LETTINGS_DEPOSIT_PAYABLE,
          LETTING_ARRANGEMENTS: data.LETTING_ARRANGEMENTS,
          FEE_APPLY_ID: data.FEE_APPLY_ID.value,
          RENTAL_FREQUENCY_ID: data.RENTAL_FREQUENCY_ID?.value,
          VIDEO_VIRTUALS_LINK: data.VIDEO_VIRTUALS_LINK,
          BEDROOMS_ID: data.BEDROOMS_ID?.value,
          BATHROOMS_ID: data.BATHROOMS_ID?.value,
          RECEPTIONS_ID: data.RECEPTIONS_ID?.value,
          FLOORS_ID: data.FLOORS_ID?.value,
          SIZE: data.SIZE,
          UNITS_ID: data.UNITS_ID?.value,
          FURNISHED_ID: data.FURNISHED_ID?.value,
          LISTING_TYPE_ID: listingTypes?.HOTELS.LISTING_TYPE_ID,
          SUMMARY: data.SUMMARY,
          FULLDESCRIPTION: data.FULLDESCRIPTION,
          PLANNING_CONSIDERATIONS: data.PLANNING_CONSIDERATIONS,
          CURRENT_ERR_RATING: data.CURRENT_ERR_RATING,
          POTENTIAL_ERR_RATING: data.POTENTIAL_ERR_RATING,
          CONTENT_FILE_LINK: data.CONTENT_FILE_LINK,
          CONTENT_TYPE_ID: data.CONTENT_TYPE_ID?.value,
          PICTURE_LINKS,
          CONTENT_TYPE_PICTURE_LINKS,
          PROPERTY_FEATURES: features?.length
            ? features?.map(item => ({ FEATURES_ID: item.FEATURES_ID, PROPERTY_ID: data.PROPERTY_ID }))
            : [],
          PROPERTY_UTILITIES: utilities.length
            ? utilities?.map(item => ({ UTILITY_ID: item.UTILITY_ID, PROPERTY_ID: data.PROPERTY_ID }))
            : [],
          PROPERTY_UAP: usingPlanning.length
            ? usingPlanning?.map(item => ({
                UAP_ID: item.UAP_ID,
                SELECT_VALUE: item.SELECT_VALUE,
                PROPERTY_ID: data.PROPERTY_ID
              }))
            : [],
          CUSTOM_FEATURES: CUSTOM_FEATURES.length
            ? CUSTOM_FEATURES.map(item => ({
                CUSTOM_FEATURES_ID: item.CUSTOM_FEATURES_ID,
                DESCRIPTION: item.DESCRIPTION,
                PROPERTY_ID: data.PROPERTY_ID
              }))
            : [],
          ACTIVE: data.ACTIVE
        },
        files,
        content_file: file
      })
    ).then(response => {
      if (data.PROPERTY_ID !== null) {
        setValue('PROPERTY_ID', response.payload[0].CODE)
      }

      setStates({ ...states, isSubmit: false, isEdit: false })

      // handleDiscard()
    })
  }

  const handleConfirm = data => {
    setStates({ ...states, modalForm: 'd' })
    setDeleteStates(data)
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deletePropertySetupRental(deleteStates)).then(response => {
      if (response.payload !== false) handleRefresh()
    })
  }

  return states.isLoading ? (
    <FallbackSpinner />
  ) : (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Grid container>
                <Grid item xs={6}>
                  <CardHeader sx={{ p: 1 }} title={pageTitle} />
                </Grid>
                <Grid item xs={6} display='flex' alignItems='center' justifyContent='end'>
                  <Button variant='outlined' onClick={() => replace('/website/property-setup-rentals')} sx={{ mr: 2 }}>
                    <Icon icon='tabler:arrow-left' />
                    Back
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => {
                      // replace('/website/property-setup-rentals/form')
                      window.location.replace('/website/property-setup-rentals/form')
                    }}
                  >
                    <Icon icon='tabler:plus' />
                    New
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <ModalForm
            control={control}
            states={states}
            setStates={setStates}
            handleDiscard={handleDiscard}
            errors={errors}
            setError={setError}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            pageTitle={pageTitle}
            setValue={setValue}
            file={file}
            setFile={setFile}
            files={files}
            setFiles={setFiles}
            additionalFeatures={additionalFeatures}
            setAdditionalFeatures={setAdditionalFeatures}
            watch={watch}
            clearErrors={clearErrors}
            PICTURE_LINKS={PICTURE_LINKS}
            setPICTURE_LINKS={setPICTURE_LINKS}
            CONTENT_TYPE_PICTURE_LINKS={CONTENT_TYPE_PICTURE_LINKS}
            setCONTENT_TYPE_PICTURE_LINKS={setCONTENT_TYPE_PICTURE_LINKS}
            features={features}
            setFeatures={setFeatures}
            utilities={utilities}
            setUtilities={setUtilities}
            usingPlanning={usingPlanning}
            setUsingPlanning={setUsingPlanning}
            CUSTOM_FEATURES={CUSTOM_FEATURES}
            setCUSTOM_FEATURES={setCUSTOM_FEATURES}
            setPLACE={setPLACE}
            PLACE={PLACE}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Form
