import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardHeader,
  Box,
  IconButton,
  Grid,
  Tooltip,
  CardContent,
  Button,
  Typography,
  Chip,
  alpha
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getPropertySetupHotels, updatePropertySetupHotels, deletePropertySetupHotels } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/website/property-setup-hotels/static-data'
import { dateConvert, getActiveProps, handleSearch, isAllowed } from 'src/@core/utils'
import { print, generatePDF } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModalForm } from 'src/views/pages/website/property-setup-hotels/form'
import DeleteModal from 'src/views/components/modal/delete-modal'
import Link from 'next/link'
import { getPropertySetupHotelsAPI, listingTypes } from 'src/configs'
import { useParams, useSearchParams } from 'next/navigation'
import FallbackSpinner from 'src/@core/components/spinner-with-logo'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/material/styles'

const pageTitle = 'Hotels Setup'

const defaultValues = {
  PROPERTY_ID: null,
  SITE_STATUS_ID: null,
  LISTING_STATUS_ID: null,
  FULLPOSTCODE: '',
  PROPERTY_NUM_NAME: '',
  STREET_NAME: '',
  AREA_TOWN_CITY: '',
  OWN_REF: '',
  LATITUDE: '',
  LONGITUDE: '',
  PLACE: '',
  MAP_URL: '',
  CURRENT_ERR_RATING: null,
  POTENTIAL_ERR_RATING: null,
  CONTENT_FILE_LINK: null,
  ACTIVE: true,
  CREATED_ON: null,
  STAR_RATING: null,
  HOTEL_TYPE: null,
  CHECK_IN_TIME: null,
  CHECK_OUT_TIME: null,
  AGENT_NAME: '',
  AGENT_BIO: '',
  IMPORTANT_INFO: '',
  SUMMARY: '',
  FULLDESCRIPTION: '',
  POPULAR_COUNTRIES: [],
  POPULAR_REGIONS: []
}

const Form = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const theme = useTheme()
  const submitRef = useRef(null)

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

  // const store = useSelector(state => state.propertySetupHotels)
  const [files, setFiles] = useState([])
  const [additionalFeatures, setAdditionalFeatures] = useState([{ value: 1, label: '' }])
  const [file, setFile] = useState()

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
  const [CONTENT_TYPE_PICTURE_LINKS, setCONTENT_TYPE_PICTURE_LINKS] = useState(null)
  const [NEARBY_PLACES, setNEARBY_PLACES] = useState([{ ICON_ID: 1, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])
  const [PROPERTY_FAQS, setPROPERTY_FAQS] = useState([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
  const [PROPERTY_RULES, setPROPERTY_RULES] = useState([{ RULE_ID: null, RULE: '', NOTE: '' }])

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
    setValue('STAR_RATING', row.STAR_RATING ?? null)
    setValue('HOTEL_TYPE', row.HOTEL_TYPE ?? null)
    setValue('CHECK_IN_TIME', row.CHECK_IN_TIME ?? null)
    setValue('CHECK_OUT_TIME', row.CHECK_OUT_TIME ?? null)
    setValue('AGENT_NAME', row.AGENT_NAME ?? null)
    setValue('AGENT_BIO', row.AGENT_BIO ?? null)
    setValue('IMPORTANT_INFO', row.IMPORTANT_INFO ?? null)
    setValue('SUMMARY', row.SUMMARY ?? '')
    setValue('FULLDESCRIPTION', row.FULLDESCRIPTION ?? '')
    setValue('POPULAR_COUNTRIES', row.POPULAR_COUNTRIES?.length > 0 ? row.POPULAR_COUNTRIES.split(',') : [])
    setValue('POPULAR_REGIONS', row.POPULAR_REGIONS?.length > 0 ? row.POPULAR_REGIONS.split(',') : [])

    console.log('JSON.parse(row.NEARBY_PLACES)', JSON.parse(row.NEARBY_PLACES))

    setNEARBY_PLACES(
      row.NEARBY_PLACES?.length > 0
        ? JSON.parse(row.NEARBY_PLACES)
        : [{ ICON_ID: 1, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }]
    )
    setPROPERTY_FAQS(
      row.PROPERTY_FAQS?.length > 0 ? JSON.parse(row.PROPERTY_FAQS) : [{ FAQ_ID: null, QUESTION: '', ANSWER: '' }]
    )
    setPROPERTY_RULES(
      row.PROPERTY_RULES?.length > 0 ? JSON.parse(row.PROPERTY_RULES) : [{ RULE_ID: null, RULE: '', NOTE: '' }]
    )
    setStates({ ...states, isEdit: true })
  }

  const initialized = async () => {
    const id = searchParams.get('id')
    if (id?.length > 0) {
      setStates({ ...states, isLoading: true })
      await getPropertySetupHotelsAPI({ PROPERTY_ID: id }).then(response => {
        if (response?.data?.length > 0) {
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
    setNEARBY_PLACES([{ ICON_ID: 1, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])
    setPROPERTY_FAQS([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
    setPROPERTY_RULES([{ RULE_ID: null, RULE: '', NOTE: '' }])
    setValue('POPULAR_COUNTRIES', [])
    setValue('POPULAR_REGIONS', [])
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
    setNEARBY_PLACES([{ ICON_ID: 1, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])
    setPROPERTY_FAQS([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
    setPROPERTY_RULES([{ RULE_ID: null, RULE: '', NOTE: '' }])
    setValue('POPULAR_COUNTRIES', [])
    setValue('POPULAR_REGIONS', [])
    setFile([])
    setFiles([])
  }

  const handleSampleData = () => {
    // Reset all form fields and state before applying sample values
    reset(defaultValues)
    setFiles([])
    setFile(null)
    setPICTURE_LINKS([])
    setCONTENT_TYPE_PICTURE_LINKS(null)
    setFeatures([])
    setUtilities([])
    setUsingPlanning([])

    setValue('SITE_STATUS_ID', { value: 1, label: 'Published' })
    setValue('ACTIVE', true)
    setValue('FULLPOSTCODE', 'SW1A 1AA')
    setValue('PROPERTY_NUM_NAME', 'The Grand Palace Hotel')
    setValue('STREET_NAME', 'Buckingham Palace Road')
    setValue('AREA_TOWN_CITY', 'London')
    setValue('OWN_REF', 'HTL-2025-001')
    setValue('LATITUDE', 51.5014)
    setValue('LONGITUDE', -0.1419)
    setValue('PLACE', 'London, United Kingdom')
    setPLACE('London, United Kingdom')
    setValue('STAR_RATING', 5)
    setValue('HOTEL_TYPE', 'Luxury Hotel')
    setValue('CHECK_IN_TIME', '3:00 PM')
    setValue('CHECK_OUT_TIME', '11:00 AM')
    setValue('AGENT_NAME', 'James Hartley')
    setValue(
      'AGENT_BIO',
      'I have been managing The Grand Palace Hotel for over 12 years. My team and I are dedicated to ensuring every guest experiences the finest standards of comfort and service that London has to offer.'
    )
    setValue(
      'IMPORTANT_INFO',
      'A 12% London hotel tax is collected at check-in. Photo ID is required for all guests at arrival. Early check-in available from 1:00 PM subject to availability -” please contact us in advance. Valet parking available at Â$45 per night. Pets are not permitted on the premises.'
    )

    setNEARBY_PLACES([
      { ICON_ID: 1, NAME: 'Buckingham Palace', DISTANCE: '0.3 km away', ICON: 'tabler:building-museum' },
      { ICON_ID: 2, NAME: 'Hyde Park', DISTANCE: '0.5 km away', ICON: 'tabler:trees' },
      { ICON_ID: 3, NAME: 'Victoria Station', DISTANCE: '0.8 km away', ICON: 'tabler:train' },
      { ICON_ID: 4, NAME: 'Harrods', DISTANCE: '1.2 km away', ICON: 'tabler:building-store' },
      { ICON_ID: 5, NAME: 'Heathrow Airport', DISTANCE: '34 km away', ICON: 'tabler:plane' },
      { ICON_ID: 6, NAME: 'The Ritz Restaurant', DISTANCE: '0.2 km away', ICON: 'tabler:tools-kitchen-2' }
    ])
    setCUSTOM_FEATURES([
      { CUSTOM_FEATURES_ID: 1, DESCRIPTION: 'Rooftop Infinity Pool', PROPERTY_ID: 0 },
      { CUSTOM_FEATURES_ID: 2, DESCRIPTION: 'Full-Service Spa & Wellness Centre', PROPERTY_ID: 0 },
      { CUSTOM_FEATURES_ID: 3, DESCRIPTION: 'Michelin-Star In-House Restaurant', PROPERTY_ID: 0 },
      { CUSTOM_FEATURES_ID: 4, DESCRIPTION: '24-Hour Butler Service', PROPERTY_ID: 0 }
    ])
    toast.success('Sample data loaded — review and adjust before saving', { position: 'top-center', duration: 4000 })
  }

  const onSubmit = data => {
    setStates({ ...states, isSubmit: true })
    dispatch(
      updatePropertySetupHotels({
        data: {
          PROPERTY_ID: data.PROPERTY_ID,
          SITE_STATUS_ID: data.SITE_STATUS_ID?.value,
          LISTING_STATUS_ID: 1, //data.LISTING_STATUS_ID?.value || null,
          FULLPOSTCODE: data.FULLPOSTCODE,
          PROPERTY_NUM_NAME: data.PROPERTY_NUM_NAME,
          STREET_NAME: data.STREET_NAME,
          AREA_TOWN_CITY: data.AREA_TOWN_CITY,
          OWN_REF: data.OWN_REF || null,
          LATITUDE: data.LATITUDE,
          LONGITUDE: data.LONGITUDE,
          PLACE,
          MAP_URL: data.MAP_URL,
          CURRENT_ERR_RATING: data.CURRENT_ERR_RATING || null,
          POTENTIAL_ERR_RATING: data.POTENTIAL_ERR_RATING || null,
          CONTENT_FILE_LINK: data.CONTENT_FILE_LINK || null,
          CONTENT_TYPE_ID: data.CONTENT_TYPE_ID?.value || null,
          PICTURE_LINKS,
          CONTENT_TYPE_PICTURE_LINKS: CONTENT_TYPE_PICTURE_LINKS || null,
          PROPERTY_FEATURES: features.length
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
          ACTIVE: data.ACTIVE,
          STAR_RATING: data.STAR_RATING || null,
          HOTEL_TYPE: data.HOTEL_TYPE || null,
          CHECK_IN_TIME: data.CHECK_IN_TIME || null,
          CHECK_OUT_TIME: data.CHECK_OUT_TIME || null,
          AGENT_NAME: data.AGENT_NAME || null,
          AGENT_BIO: data.AGENT_BIO || null,
          IMPORTANT_INFO: data.IMPORTANT_INFO || null,
          SUMMARY: data.SUMMARY || null,
          FULLDESCRIPTION: data.FULLDESCRIPTION || null,
          POPULAR_COUNTRIES: data.POPULAR_COUNTRIES?.length ? data.POPULAR_COUNTRIES : [],
          POPULAR_REGIONS: data.POPULAR_REGIONS?.length ? data.POPULAR_REGIONS : [],
          NEARBY_PLACES: NEARBY_PLACES.filter(p => p.NAME?.trim()).length
            ? NEARBY_PLACES.filter(p => p.NAME?.trim()).map(item => ({
                ICON_ID: item.ICON_ID,
                NAME: item.NAME,
                DISTANCE: item.DISTANCE
              }))
            : [],
          PROPERTY_FAQS: PROPERTY_FAQS.filter(f => f.QUESTION?.trim()).length
            ? PROPERTY_FAQS.filter(f => f.QUESTION?.trim()).map(item => ({
                FAQ_ID: item.FAQ_ID,
                QUESTION: item.QUESTION,
                ANSWER: item.ANSWER,
                PROPERTY_ID: data.PROPERTY_ID
              }))
            : [],
          PROPERTY_RULES: PROPERTY_RULES.filter(r => r.RULE?.trim()).length
            ? PROPERTY_RULES.filter(r => r.RULE?.trim()).map(item => ({
                RULE_ID: item.RULE_ID,
                RULE: item.RULE,
                NOTE: item.NOTE,
                PROPERTY_ID: data.PROPERTY_ID
              }))
            : []
        },
        files,
        content_file: file
      })
    ).then(response => {
      if (response.payload && response.payload[0]?.ERROR) {
        toast.error(response.payload[0]?.ERROR, { position: 'top-center' })
        setStates({ ...states, isSubmit: false })

        return
      } else if (response.payload && data.PROPERTY_ID == null) {
        setValue('PROPERTY_ID', response.payload[0]?.CODE)
      }

      setStates({ ...states, isSubmit: false, isEdit: false })

      //handleDiscard()
    })
  }

  const handleConfirm = data => {
    setStates({ ...states, modalForm: 'd' })
    setDeleteStates(data)
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deletePropertySetupHotels(deleteStates)).then(response => {
      if (response.payload !== false) handleRefresh()
    })
  }

  return states.isLoading ? (
    <FallbackSpinner />
  ) : (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 900, mx: 'auto', py: 4 }}>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Card
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                mb: 1,
                position: { xs: 'initial', md: 'sticky' },
                top: { xs: 100, md: 150 },
                zIndex: 100,
                p: 3
              }}
            >
              <Grid container alignItems='center' justifyContent='space-between' spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant='h6' fontWeight={700} color='primary.contrastText'>
                      {pageTitle}
                    </Typography>
                    <Chip
                      variant='filled'
                      label={watch('PROPERTY_ID') !== null ? 'Editing' : 'New'}
                      color={watch('PROPERTY_ID') !== null ? 'warning' : 'primary'}
                      size='small'
                      sx={{
                        fontWeight: 600,
                        fontSize: 11
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    gap: 1.5,
                    flexWrap: 'wrap'
                  }}
                >
                  <LoadingButton
                    type='submit'
                    onClick={() => submitRef.current?.click()}
                    loading={states.isSubmit}
                    variant='contained'
                    size='small'
                    sx={{
                      background: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 700,
                      fontSize: 9,
                      px: 3,
                      borderRadius: 2,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`
                      }
                    }}
                  >
                    <Icon icon='tabler:device-floppy' fontSize={18} style={{ marginRight: 6 }} />
                    {watch('PROPERTY_ID') !== null ? 'Update' : 'Save'}
                  </LoadingButton>
                  <Tooltip title='Fill all fields with a realistic sample hotel -” useful for testing and previewing the detail page'>
                    <Button
                      onClick={handleSampleData}
                      variant='contained'
                      sx={{
                        background: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 700,
                        fontSize: 9,
                        px: 3,
                        borderRadius: 2,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`
                        }
                      }}
                    >
                      <Icon icon='tabler:wand' fontSize={18} style={{ marginRight: 6 }} />
                      Sample Data
                    </Button>
                  </Tooltip>
                  <Button
                    onClick={() => {
                      window.location.replace('/website/property-setup-hotels/form')
                    }}
                    variant='contained'
                    sx={{
                      background: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 700,
                      px: 3,
                      fontSize: 9,
                      borderRadius: 2,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`
                      }
                    }}
                  >
                    <Icon icon='tabler:plus' fontSize={18} style={{ marginRight: 6 }} />
                    New
                  </Button>
                  <Button
                    onClick={() => replace('/website/property-setup-hotels')}
                    variant='contained'
                    sx={{
                      background: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 700,
                      px: 3,
                      fontSize: 9,
                      borderRadius: 2,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`
                      }
                    }}
                  >
                    <Icon icon='tabler:arrow-left' fontSize={18} style={{ marginRight: 6 }} />
                    Back
                  </Button>
                </Grid>
              </Grid>
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
              submitRef={submitRef}
              NEARBY_PLACES={NEARBY_PLACES}
              setNEARBY_PLACES={setNEARBY_PLACES}
              PROPERTY_FAQS={PROPERTY_FAQS}
              setPROPERTY_FAQS={setPROPERTY_FAQS}
              PROPERTY_RULES={PROPERTY_RULES}
              setPROPERTY_RULES={setPROPERTY_RULES}
              propertyId={watch('PROPERTY_ID') || null}
            />
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Form
