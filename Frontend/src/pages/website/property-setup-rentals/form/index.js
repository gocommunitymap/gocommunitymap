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
import { useTheme } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { updatePropertySetupRental, deletePropertySetupRental } from 'src/store'
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
  FULLPOSTCODE: '',
  PROPERTY_NUM_NAME: '',
  STREET_NAME: '',
  AREA_TOWN_CITY: '',
  OWN_REF: '',
  LATITUDE: null,
  LONGITUDE: null,
  PLACE: '',
  COUNTRY: '',
  PROVINCE: '',
  CITY: '',
  MAP_URL: null,
  STAR_RATING: null,
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
  VIDEO_VIRTUALS_LINK: '',
  BEDROOMS_ID: null,
  BATHROOMS_ID: null,
  RECEPTIONS_ID: null,
  FLOORS_ID: null,
  PROPERTY_QUANTITY: null,
  SIZE: null,
  MAX_GUESTS: '',
  UNITS_ID: null,
  FURNISHED_ID: null,
  SUMMARY: '',
  FULLDESCRIPTION: '',
  PLANNING_CONSIDERATIONS: '',
  CURRENT_ERR_RATING: null,
  POTENTIAL_ERR_RATING: null,
  CONTENT_FILE_LINK: null,
  ACTIVE: true,
  CREATED_ON: null,
  POPULAR_COUNTRIES: [],
  POPULAR_REGIONS: [],
  AGENT_NAME: null,
  AGENT_BIO: null,
  IMPORTANT_INFO: null
}

const Form = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()
  const searchParams = useSearchParams()
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

  const [NEARBY_PLACES, setNEARBY_PLACES] = useState([{ ICON_ID: 0, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])
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
    setValue('COUNTRY', row.COUNTRY)
    setValue('PROVINCE', row.PROVINCE)
    setValue('CITY', row.CITY)
    setPLACE(row.PLACE)
    setValue('MAP_URL', row.MAP_URL)
    setValue('STAR_RATING', row.STAR_RATING ?? null)
    setValue('PROPERTY_TYPE_ID', { value: row.PROPERTY_TYPE_ID, label: row.PROPERTY_TYPE_DESC })
    setValue('RETIREMENT_HOME', row.RETIREMENT_HOME)
    setValue('SHARED_ACCOMMODATION', row.SHARED_ACCOMMODATION)
    setValue('SHORT_LET', row.SHORT_LET)
    setValue('STUDENT_ACCEPTED', row.STUDENT_ACCEPTED)
    setValue('TENURE_ID', { value: row.TENURE_ID, label: row.TENURE_DESC })
    setValue('COUNCIL_TAX_BAND_ID', { value: row.COUNCIL_TAX_BAND_ID, label: row.COUNCIL_TAX_BAND_DESC })
    setValue('ISEXEMPT', row.ISEXEMPT)
    setValue('PRICE', row.PRICE)
    setValue('LETTINGS_DEPOSIT_PAYABLE', {
      value: row.LETTINGS_DEPOSIT_PAYABLE_CODE,
      label: row.LETTINGS_DEPOSIT_PAYABLE_DESC
    })
    setValue('LETTING_ARRANGEMENTS', { value: row.LETTING_ARRANGEMENTS_CODE, label: row.LETTING_ARRANGEMENTS_DESC })
    setValue('FEE_APPLY_ID', { value: row.FEE_APPLY_ID, label: row.FEE_APPLY_DESC })
    setValue('RENTAL_FREQUENCY_ID', { value: row.RENTAL_FREQUENCY_ID, label: row.RENTAL_FREQUENCY_DESC })
    setValue('VIDEO_VIRTUALS_LINK', row.VIDEO_VIRTUALS_LINK)
    setValue('BEDROOMS_ID', { value: row.BEDROOMS_ID, label: row.BEDROOMS_DESC })
    setValue('BATHROOMS_ID', { value: row.BATHROOMS_ID, label: row.BATHROOMS_DESC })
    setValue('RECEPTIONS_ID', { value: row.RECEPTIONS_ID, label: row.RECEPTIONS_DESC })
    setValue('FLOORS_ID', { value: row.FLOORS_ID, label: row.FLOORS_DESC })
    setValue('PROPERTY_QUANTITY', row.PROPERTY_QUANTITY)
    setValue('SIZE', row.SIZE)
    setValue('MAX_GUESTS', row.MAX_GUESTS)
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
    setValue(
      'POPULAR_COUNTRIES',
      row.POPULAR_COUNTRIES
        ? Array.isArray(row.POPULAR_COUNTRIES)
          ? row.POPULAR_COUNTRIES
          : row.POPULAR_COUNTRIES.split(',')
        : []
    )
    setValue(
      'POPULAR_REGIONS',
      row.POPULAR_REGIONS
        ? Array.isArray(row.POPULAR_REGIONS)
          ? row.POPULAR_REGIONS
          : row.POPULAR_REGIONS.split(',')
        : []
    )
    setValue('AGENT_NAME', row.AGENT_NAME ?? null)
    setValue('AGENT_BIO', row.AGENT_BIO ?? null)
    setValue('IMPORTANT_INFO', row.IMPORTANT_INFO ?? null)
    setNEARBY_PLACES(
      row.NEARBY_PLACES?.length > 0
        ? JSON.parse(row.NEARBY_PLACES)
        : [{ ICON_ID: 0, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }]
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
      await getPropertySetupRentalAPI({ PROPERTY_ID: id }).then(response => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setNEARBY_PLACES([{ ICON_ID: 0, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])
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
    setNEARBY_PLACES([{ ICON_ID: 0, NAME: '', DISTANCE: '', ICON: 'tabler:map-pin' }])
    setPROPERTY_FAQS([{ FAQ_ID: null, QUESTION: '', ANSWER: '' }])
    setPROPERTY_RULES([{ RULE_ID: null, RULE: '', NOTE: '' }])
    setValue('POPULAR_COUNTRIES', [])
    setValue('POPULAR_REGIONS', [])
    setFile([])
    setFiles([])
  }

  const handleSampleData = () => {
    reset(defaultValues)
    setFiles([])
    setFile(null)
    setPICTURE_LINKS([])
    setCONTENT_TYPE_PICTURE_LINKS(null)
    setFeatures([])
    setUtilities([])
    setUsingPlanning([])

    setValue('SITE_STATUS_ID', { value: 1, label: 'Published' })
    setValue('LISTING_STATUS_ID', { value: 1, label: 'Active' })
    setValue('ACTIVE', true)
    setValue('FULLPOSTCODE', 'SW3 5RZ')
    setValue('PROPERTY_NUM_NAME', 'Chelsea Garden Apartment')
    setValue('STREET_NAME', 'Kings Road')
    setValue('AREA_TOWN_CITY', 'Chelsea, London')
    setValue('OWN_REF', 'RNT-2025-042')
    setValue('LATITUDE', 51.4874)
    setValue('LONGITUDE', -0.1678)
    setValue('PLACE', 'Kings Road, Chelsea, London SW3 5RZ, UK')
    setValue('COUNTRY', 'United Kingdom')
    setValue('PROVINCE', 'England')
    setValue('CITY', 'London')
    setPLACE('Kings Road, Chelsea, London SW3 5RZ, UK')
    setValue('MAP_URL', 'https://maps.google.com/?q=51.4874,-0.1678')
    setValue('STAR_RATING', 4.5)
    setValue('PROPERTY_TYPE_ID', { value: 1, label: 'Apartment' })
    setValue('RETIREMENT_HOME', false)
    setValue('SHARED_ACCOMMODATION', false)
    setValue('SHORT_LET', false)
    setValue('STUDENT_ACCEPTED', false)
    setValue('TENURE_ID', { value: 2, label: 'Leasehold' })
    setValue('COUNCIL_TAX_BAND_ID', { value: 3, label: 'Band C' })
    setValue('ISEXEMPT', false)
    setValue('PRICE', 2200)
    setValue('LETTINGS_DEPOSIT_PAYABLE', 2200)
    setValue(
      'LETTING_ARRANGEMENTS',
      'Long-term let available. Minimum 12-month tenancy. Professionally managed by Chelsea Properties Ltd. References and credit checks required.'
    )
    setValue('FEE_APPLY_ID', { value: 1, label: 'Tenant Fees Apply' })
    setValue('RENTAL_FREQUENCY_ID', { value: 1, label: 'Monthly' })
    setValue('VIDEO_VIRTUALS_LINK', 'https://www.youtube.com/watch?v=example-virtual-tour')
    setValue('BEDROOMS_ID', { value: 2, label: '2' })
    setValue('BATHROOMS_ID', { value: 2, label: '2' })
    setValue('RECEPTIONS_ID', { value: 1, label: '1' })
    setValue('FLOORS_ID', { value: 2, label: '2nd Floor' })
    setValue('PROPERTY_QUANTITY', 1)
    setValue('SIZE', 85)
    setValue('MAX_GUESTS', 4)
    setValue('UNITS_ID', { value: 1, label: 'sq m' })
    setValue('FURNISHED_ID', { value: 1, label: 'Furnished' })
    setValue(
      'SUMMARY',
      'Beautiful 2-bedroom apartment in the heart of Chelsea, featuring modern interiors, a private balcony with garden views, and premium appliances throughout. Minutes from Kings Road shops and Chelsea Physic Garden.'
    )
    setValue(
      'FULLDESCRIPTION',
      'This stunning Chelsea apartment offers an exceptional blend of period charm and contemporary living. The open-plan kitchen and living area opens onto a private balcony overlooking a leafy communal garden. Both bedrooms are generously sized with fitted wardrobes. The master bedroom features an en-suite bathroom with a walk-in rainfall shower. Residents benefit from secure entry, a dedicated bike store, and access to a beautifully maintained communal garden. Kings Road, with its boutique shops, restaurants, and cafes, is a short stroll away. Sloane Square Underground station is a 10-minute walk, providing excellent Central and District Line connections.'
    )
    setValue(
      'PLANNING_CONSIDERATIONS',
      'The property is located within the Royal Borough of Kensington and Chelsea Conservation Area. All external alterations require prior approval from the local planning authority. Grade II Listed status applies to certain structural features of the building.'
    )
    setValue('CURRENT_ERR_RATING', 'C')
    setValue('POTENTIAL_ERR_RATING', 'B')
    setValue('AGENT_NAME', 'Sophie Whitmore')
    setValue(
      'AGENT_BIO',
      'I have been specialising in prime London lettings for over 10 years, with a particular focus on Chelsea, Kensington, and Fulham. My approach is personal and professional — I work closely with landlords to present their properties at their best and match them with the right tenants quickly.'
    )
    setValue(
      'IMPORTANT_INFO',
      "Tenant is responsible for all utility bills including council tax. No smoking permitted anywhere on the property. Pets considered on a case-by-case basis — please enquire. A holding deposit equal to one week's rent is required to secure the property."
    )
    setValue('POPULAR_COUNTRIES', ['United Kingdom'])
    setValue('POPULAR_REGIONS', ['London'])

    setNEARBY_PLACES([
      { ICON_ID: 1, NAME: 'Sloane Square Underground', DISTANCE: '0.7 km away', ICON: 'tabler:building-community' },
      { ICON_ID: 2, NAME: 'Chelsea Physic Garden', DISTANCE: '0.4 km away', ICON: 'tabler:trees' },
      { ICON_ID: 3, NAME: 'Kings Road Shops', DISTANCE: '0.2 km away', ICON: 'tabler:building-store' },
      { ICON_ID: 4, NAME: 'Battersea Power Station', DISTANCE: '1.8 km away', ICON: 'tabler:bolt' },
      { ICON_ID: 5, NAME: 'Chelsea FC Stamford Bridge', DISTANCE: '1.5 km away', ICON: 'tabler:ball-football' },
      { ICON_ID: 6, NAME: 'Heathrow Airport', DISTANCE: '22 km away', ICON: 'tabler:plane' }
    ])
    setCUSTOM_FEATURES([
      { CUSTOM_FEATURES_ID: 1, DESCRIPTION: 'Private Balcony with Garden View', PROPERTY_ID: 0 },
      { CUSTOM_FEATURES_ID: 2, DESCRIPTION: 'Underfloor Heating Throughout', PROPERTY_ID: 0 },
      { CUSTOM_FEATURES_ID: 3, DESCRIPTION: 'Secure Video Entry System', PROPERTY_ID: 0 },
      { CUSTOM_FEATURES_ID: 4, DESCRIPTION: 'Allocated Parking Space', PROPERTY_ID: 0 }
    ])
    setPROPERTY_FAQS([
      {
        FAQ_ID: null,
        QUESTION: 'Is the property pet-friendly?',
        ANSWER:
          'Pets are considered on a case-by-case basis with landlord approval. A refundable pet deposit may be required. Please contact us to discuss your specific situation.'
      },
      {
        FAQ_ID: null,
        QUESTION: 'What is included in the rent?',
        ANSWER:
          'The monthly rent covers use of the property and all fixtures. Tenants are responsible for council tax, electricity, gas, water, and broadband. Building insurance is covered by the freeholder.'
      },
      {
        FAQ_ID: null,
        QUESTION: 'How long is the minimum tenancy?',
        ANSWER:
          'The minimum tenancy period is 12 months. Longer terms are preferred and may be negotiated. Short-let arrangements are not available for this property.'
      },
      {
        FAQ_ID: null,
        QUESTION: 'Is parking available?',
        ANSWER:
          'Yes — one allocated parking space is included in the rent. Additional parking permits for the surrounding area can be purchased from the Royal Borough of Kensington and Chelsea.'
      }
    ])
    setPROPERTY_RULES([
      { RULE_ID: null, RULE: 'No Smoking', NOTE: 'Strictly no smoking inside the property or on the balcony.' },
      { RULE_ID: null, RULE: 'No Parties', NOTE: 'Large gatherings and parties are not permitted at any time.' },
      {
        RULE_ID: null,
        RULE: 'Quiet Hours',
        NOTE: 'Please observe quiet hours between 10:00 PM and 8:00 AM to respect neighbouring residents.'
      },
      {
        RULE_ID: null,
        RULE: 'Property Care',
        NOTE: 'Tenants are responsible for maintaining the property in its current condition throughout the tenancy.'
      }
    ])
    toast.success('Sample data loaded — review and adjust before saving', { position: 'top-center', duration: 4000 })
  }

  const onSubmit = data => {
    setStates({ ...states, isSubmit: true })
    dispatch(
      updatePropertySetupRental({
        data: {
          PROPERTY_ID: data.PROPERTY_ID,
          SITE_STATUS_ID: data.SITE_STATUS_ID?.value,
          LISTING_STATUS_ID: listingTypes.RENTAL.LISTING_TYPE_ID, //data.LISTING_STATUS_ID?.value,
          FULLPOSTCODE: data.FULLPOSTCODE,
          PROPERTY_NUM_NAME: data.PROPERTY_NUM_NAME,
          STREET_NAME: data.STREET_NAME,
          AREA_TOWN_CITY: data.AREA_TOWN_CITY,
          OWN_REF: data.OWN_REF,
          LATITUDE: data.LATITUDE,
          LONGITUDE: data.LONGITUDE,
          PLACE,
          COUNTRY: data.COUNTRY,
          PROVINCE: data.PROVINCE,
          CITY: data.CITY,
          MAP_URL: data.MAP_URL,
          STAR_RATING: data.STAR_RATING || null,
          PROPERTY_TYPE_ID: data.PROPERTY_TYPE_ID?.value,
          RETIREMENT_HOME: data.RETIREMENT_HOME,
          SHARED_ACCOMMODATION: data.SHARED_ACCOMMODATION,
          SHORT_LET: data.SHORT_LET,
          STUDENT_ACCEPTED: data.STUDENT_ACCEPTED,
          TENURE_ID: data.TENURE_ID?.value,
          COUNCIL_TAX_BAND_ID: data.COUNCIL_TAX_BAND_ID?.value,
          ISEXEMPT: data.ISEXEMPT,
          PRICE: data.PRICE,
          LETTINGS_DEPOSIT_PAYABLE: data.LETTINGS_DEPOSIT_PAYABLE?.value,
          LETTING_ARRANGEMENTS: data.LETTING_ARRANGEMENTS?.value,
          FEE_APPLY_ID: data.FEE_APPLY_ID?.value,
          RENTAL_FREQUENCY_ID: data.RENTAL_FREQUENCY_ID?.value,
          VIDEO_VIRTUALS_LINK: data.VIDEO_VIRTUALS_LINK,
          BEDROOMS_ID: data.BEDROOMS_ID?.value,
          BATHROOMS_ID: data.BATHROOMS_ID?.value,
          RECEPTIONS_ID: data.RECEPTIONS_ID?.value,
          FLOORS_ID: data.FLOORS_ID?.value,
          PROPERTY_QUANTITY: data.PROPERTY_QUANTITY,
          SIZE: data.SIZE,
          MAX_GUESTS: data.MAX_GUESTS,
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
          POPULAR_COUNTRIES: data.POPULAR_COUNTRIES,
          POPULAR_REGIONS: data.POPULAR_REGIONS,
          AGENT_NAME: data.AGENT_NAME,
          AGENT_BIO: data.AGENT_BIO,
          IMPORTANT_INFO: data.IMPORTANT_INFO,
          NEARBY_PLACES: NEARBY_PLACES.filter(p => p.NAME?.trim()),
          PROPERTY_FAQS: PROPERTY_FAQS.filter(f => f.QUESTION?.trim()),
          PROPERTY_RULES: PROPERTY_RULES.filter(r => r.RULE?.trim()),
          ACTIVE: data.ACTIVE
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
                      sx={{ fontWeight: 600, fontSize: 11 }}
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
                  <Tooltip title='Fill all fields with a realistic sample rental — useful for testing and previewing the detail page'>
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
                      window.location.replace('/website/property-setup-rentals/form')
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
                    onClick={() => replace('/website/property-setup-rentals')}
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
                  <Button
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
                    onClick={() => {
                      setStates(prev => ({ ...prev, isSubmit: !prev.isSubmit }))
                    }}
                  >
                    Cancel Submit
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
    </>
  )
}

export default Form
