import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import SeoHead from 'src/components/SeoHead'
import BookingStepperHeader from 'src/views/pages/hotels/booking/BookingStepperHeader'
import BookingSummaryCard from 'src/views/pages/hotels/booking/BookingSummaryCard'
import { defaultPageFont } from 'src/@core/utils'
import { axios, postRequest } from 'src/configs/services/http'
import { API_URL } from 'src/configs'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#333333',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#aab7c4' }
    },
    invalid: { color: '#e53935', iconColor: '#e53935' }
  }
}

const StripeFieldBox = ({ label, error, children }) => (
  <Box>
    <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
      {label} *
    </Typography>
    <Box
      sx={{
        border: '1px solid',
        borderColor: error ? '#e53935' : 'rgba(0,0,0,0.23)',
        borderRadius: 1,
        px: 1.5,
        py: '9px',
        backgroundColor: '#fff',
        '&:hover': { borderColor: 'rgba(0,0,0,0.87)' },
        transition: 'border-color 0.15s'
      }}
    >
      {children}
    </Box>
    {error && (
      <Typography variant='caption' color='error' sx={{ mt: 0.5, display: 'block' }}>
        {error}
      </Typography>
    )}
  </Box>
)

const PaymentMethodTab = ({ icon, label, selected }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      px: 2,
      py: 1.2,
      borderRadius: 2,
      border: '2px solid',
      borderColor: selected ? '#27ae60' : '#e0e0e0',
      backgroundColor: selected ? '#f0faf4' : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.15s',
      minWidth: 90
    }}
  >
    <Icon icon={icon} style={{ fontSize: 22, color: selected ? '#27ae60' : '#777' }} />
    <Typography variant='caption' fontWeight={selected ? 700 : 500} color={selected ? '#27ae60' : 'text.secondary'}>
      {label}
    </Typography>
  </Box>
)

// ---- Inner component using Stripe hooks ----
const StripePaymentContent = ({ bookingData, selectedRooms = [] }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState('card')

  const [cardholderName, setCardholderName] = useState(
    `${bookingData.guestFirstName} ${bookingData.guestLastName}`.trim()
  )
  const [cardComplete, setCardComplete] = useState({ number: false, expiry: false, cvc: false })
  const [cardErrors, setCardErrors] = useState({ number: '', expiry: '', cvc: '' })
  const [sameAddress, setSameAddress] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stripeError, setStripeError] = useState('')

  const handleStripeChange = field => event => {
    setCardErrors(prev => ({ ...prev, [field]: event.error ? event.error.message : '' }))
    setCardComplete(prev => ({ ...prev, [field]: event.complete }))
  }

  const isCardReady =
    paymentMethod === 'card'
      ? cardholderName.trim() && cardComplete.number && cardComplete.expiry && cardComplete.cvc
      : true

  const handleComplete = async () => {
    if (paymentMethod === 'card' && (!stripe || !elements)) return
    setLoading(true)
    setStripeError('')

    try {
      let paymentIntentId = ''

      if (paymentMethod === 'card') {
        // Step 1: Create PaymentIntent via backend
        const piResponse = await axios({
          method: 'post',
          url: API_URL.CREATE_PAYMENT,
          data: {
            amount: bookingData.total,
            currency: 'usd',
            email: bookingData.guestEmail
          }
        })

        const piJson = piResponse.data

        if (!piJson?.clientSecret) {
          throw new Error('Failed to initiate payment')
        }

        // Step 2: Confirm card payment with Stripe (must run client-side)
        const { error, paymentIntent } = await stripe.confirmCardPayment(piJson.clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: cardholderName,
              email: bookingData.guestEmail
            }
          }
        })

        if (error) {
          setStripeError(error.message)

          return
        }

        paymentIntentId = paymentIntent.id
      }

      // Step 3: Persist booking via Next.js server-side route
      const paymentMethodLabel =
        paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Google Pay'

      const payload = {
        PROPERTY_ID: bookingData.propertyId,
        PROPERTY_NAME: bookingData.propertyName,
        CHECK_IN: bookingData.checkIn,
        CHECK_OUT: bookingData.checkOut,
        NIGHTS: bookingData.nights,
        ADULTS: bookingData.adults,
        CHILDREN: bookingData.children,
        ROOMS: bookingData.rooms,
        SUBTOTAL: bookingData.subtotal,
        SERVICE_FEE: bookingData.serviceFee,
        TOTAL: bookingData.total,
        GUEST_FIRST_NAME: bookingData.guestFirstName,
        GUEST_LAST_NAME: bookingData.guestLastName,
        GUEST_EMAIL: bookingData.guestEmail,
        GUEST_COUNTRY: bookingData.guestCountry,
        GUEST_PHONE: bookingData.guestPhone,
        ARRIVAL_TIME: bookingData.arrivalTime,
        PAYMENT_METHOD: paymentMethodLabel,
        PAYMENT_INTENT_ID: paymentIntentId
      }

      const bookingResponse = await postRequest(API_URL.CREATE_BOOKING, {
        data: payload,
        config: { toast: false }
      })

      const json = bookingResponse?.data
      const bookingRef = json?.[0]?.BOOKING_NO || ''

      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(bookingData).map(([k, v]) => [k, String(v)])),
        paymentMethod: paymentMethodLabel,
        bookingRef,
        selectedRooms: JSON.stringify(selectedRooms)
      })
      router.push(`/hotels/booking/confirmed?${params.toString()}`)
    } catch (err) {
      setStripeError(err?.response?.data?.error || err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container spacing={3}>
      {/* Left Column */}
      <Grid item xs={12} md={7}>
        {/* Select Payment Method */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2 }}>
            Select payment method
          </Typography>
          <Stack direction='row' spacing={2} flexWrap='wrap'>
            <Box onClick={() => setPaymentMethod('card')}>
              <PaymentMethodTab icon='tabler:credit-card' label='Credit/Debit' selected={paymentMethod === 'card'} />
            </Box>
            <Box onClick={() => setPaymentMethod('paypal')}>
              <PaymentMethodTab icon='tabler:brand-paypal' label='PayPal' selected={paymentMethod === 'paypal'} />
            </Box>
            <Box onClick={() => setPaymentMethod('google')}>
              <PaymentMethodTab icon='tabler:brand-google' label='Google Pay' selected={paymentMethod === 'google'} />
            </Box>
          </Stack>

          {/* Stripe Card Form */}
          {paymentMethod === 'card' && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='caption' fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                    Cardholder name *
                  </Typography>
                  <TextField
                    fullWidth
                    size='small'
                    placeholder='As shown on card'
                    value={cardholderName}
                    onChange={e => setCardholderName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon icon='tabler:user' style={{ fontSize: 18, color: '#888' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StripeFieldBox label='Card number' error={cardErrors.number}>
                    <CardNumberElement
                      options={{ ...STRIPE_ELEMENT_OPTIONS, showIcon: true }}
                      onChange={handleStripeChange('number')}
                    />
                  </StripeFieldBox>
                </Grid>

                <Grid item xs={6}>
                  <StripeFieldBox label='Expiry date' error={cardErrors.expiry}>
                    <CardExpiryElement options={STRIPE_ELEMENT_OPTIONS} onChange={handleStripeChange('expiry')} />
                  </StripeFieldBox>
                </Grid>

                <Grid item xs={6}>
                  <StripeFieldBox label='CVC / CVV' error={cardErrors.cvc}>
                    <CardCvcElement options={STRIPE_ELEMENT_OPTIONS} onChange={handleStripeChange('cvc')} />
                  </StripeFieldBox>
                </Grid>
              </Grid>
            </Box>
          )}

          {paymentMethod === 'paypal' && (
            <Box sx={{ mt: 3, textAlign: 'center', py: 3 }}>
              <Icon icon='tabler:brand-paypal' style={{ fontSize: 48, color: '#003087' }} />
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                You will be redirected to PayPal to complete your payment securely.
              </Typography>
            </Box>
          )}

          {paymentMethod === 'google' && (
            <Box sx={{ mt: 3, textAlign: 'center', py: 3 }}>
              <Icon icon='tabler:brand-google' style={{ fontSize: 48, color: '#4285F4' }} />
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                You will be redirected to Google Pay to complete your payment securely.
              </Typography>
            </Box>
          )}
        </Card>

        {/* Billing Address */}
        {paymentMethod === 'card' && (
          <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2 }}>
              Billing address
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sameAddress}
                  onChange={e => setSameAddress(e.target.checked)}
                  sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }}
                />
              }
              label={
                <Typography variant='body2' fontFamily={defaultPageFont}>
                  Same as contact details
                </Typography>
              }
            />
            {!sameAddress && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth size='small' placeholder='Street address' label='Address' />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size='small' placeholder='City' label='City' />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size='small' placeholder='ZIP / Postal code' label='Postal code' />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        )}

        {/* Final Review */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant='subtitle1' fontWeight={700} fontFamily={defaultPageFont} sx={{ mb: 2 }}>
            Final review
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              backgroundColor: '#f9f9f9',
              border: '1px solid #e8e8e8',
              mb: 2
            }}
          >
            <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
              Cancellation policy: Free cancellation until 48 hours before check-in. After that, the first night is
              non-refundable.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }}
              />
            }
            label={
              <Typography variant='body2' fontFamily={defaultPageFont}>
                I agree to the{' '}
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ color: '#27ae60', fontWeight: 600, cursor: 'pointer' }}
                >
                  Terms & Conditions
                </Typography>{' '}
                and{' '}
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ color: '#27ae60', fontWeight: 600, cursor: 'pointer' }}
                >
                  Privacy Policy
                </Typography>
              </Typography>
            }
          />
          <FormControlLabel
            sx={{ mt: 0.5 }}
            control={
              <Checkbox
                checked={marketingConsent}
                onChange={e => setMarketingConsent(e.target.checked)}
                sx={{ color: '#27ae60', '&.Mui-checked': { color: '#27ae60' } }}
              />
            }
            label={
              <Typography variant='body2' fontFamily={defaultPageFont}>
                Send me exclusive deals and travel inspiration
              </Typography>
            }
          />
        </Card>

        {/* Stripe / payment error */}
        {stripeError && (
          <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
            {stripeError}
          </Alert>
        )}

        {/* Complete Booking Button */}
        <Button
          fullWidth
          variant='contained'
          size='large'
          disabled={!agreeTerms || !isCardReady || loading}
          onClick={handleComplete}
          sx={{
            backgroundColor: '#27ae60',
            '&:hover': { backgroundColor: '#229954' },
            '&.Mui-disabled': { backgroundColor: '#a8d5b9', color: '#fff' },
            py: 1.8,
            fontSize: '1.05rem',
            fontWeight: 700,
            borderRadius: 2,
            fontFamily: defaultPageFont,
            gap: 1
          }}
        >
          <Icon icon={loading ? 'tabler:loader-2' : 'tabler:lock'} style={{ fontSize: 20 }} />
          {loading ? 'Processing…' : `Complete Booking – $ ${bookingData.total.toLocaleString()}`}
        </Button>

        <Stack direction='row' justifyContent='center' spacing={1} sx={{ mt: 2 }}>
          <Icon icon='tabler:shield-check' style={{ fontSize: 16, color: '#888' }} />
          <Typography variant='caption' color='text.secondary' fontFamily={defaultPageFont}>
            Secure SSL encrypted payment
          </Typography>
        </Stack>
      </Grid>

      {/* Right Column – Summary */}
      <Grid item xs={12} md={5}>
        <Box sx={{ position: 'sticky', top: 140 }}>
          <BookingSummaryCard
            propertyName={bookingData.propertyName}
            place={bookingData.place}
            image={bookingData.propertyImage}
            checkIn={bookingData.checkIn}
            checkOut={bookingData.checkOut}
            nights={bookingData.nights}
            pricePerNight={bookingData.pricePerNight}
            subtotal={bookingData.subtotal}
            serviceFee={bookingData.serviceFee}
            total={bookingData.total}
            selectedRooms={selectedRooms}
            showPriceSummary={true}
            showCancellation={false}
          />

          {/* SSL / Help */}
          <Card sx={{ p: 2.5, mt: 2, borderRadius: 2 }}>
            <Stack direction='row' spacing={1.5} alignItems='flex-start'>
              <Icon icon='tabler:lock' style={{ fontSize: 20, color: '#27ae60', marginTop: 2 }} />
              <Box>
                <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                  Your payment is secure
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  We use 256-bit SSL encryption to protect your payment information.
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction='row' spacing={1.5} alignItems='flex-start'>
              <Icon icon='tabler:headset' style={{ fontSize: 20, color: '#555', marginTop: 2 }} />
              <Box>
                <Typography variant='body2' fontWeight={700} fontFamily={defaultPageFont}>
                  Need help?
                </Typography>
                <Typography variant='caption' sx={{ color: '#27ae60', cursor: 'pointer' }}>
                  Contact Support
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

// ---- Page component ----
const HotelBookingPayment = () => {
  const router = useRouter()
  const q = router.query

  const pricePerNight = Number(q.pricePerNight) || 0
  const nights = Number(q.nights) || 1

  const selectedRooms = (() => {
    try {
      return JSON.parse(q.selectedRooms || '[]')
    } catch {
      return []
    }
  })()

  const rawSubtotal = Number(q.subtotal) || 0

  const roomsSubtotal =
    selectedRooms.length > 0 ? selectedRooms.reduce((sum, s) => sum + (s.price || 0) * (s.qty || 1) * nights, 0) : 0
  const computedSubtotal = roomsSubtotal > 0 ? roomsSubtotal : rawSubtotal > 0 ? rawSubtotal : pricePerNight * nights
  const computedServiceFee = Number(q.serviceFee) > 0 ? Number(q.serviceFee) : Math.round(computedSubtotal * 0.1)
  const computedTotal = Number(q.total) > 0 ? Number(q.total) : computedSubtotal + computedServiceFee

  const bookingData = {
    propertyId: q.propertyId || '',
    propertyName: q.propertyName || 'Hotel Property',
    propertyImage: q.propertyImage || '',
    place: q.place || '',
    pricePerNight,
    checkIn: q.checkIn || '',
    checkOut: q.checkOut || '',
    nights,
    adults: Number(q.adults) || 2,
    children: Number(q.children) || 0,
    rooms: Number(q.rooms) || 1,
    subtotal: computedSubtotal,
    serviceFee: computedServiceFee,
    total: computedTotal,
    guestFirstName: q.guestFirstName || '',
    guestLastName: q.guestLastName || '',
    guestEmail: q.guestEmail || '',
    guestCountry: q.guestCountry || '',
    guestPhone: q.guestPhone || '',
    arrivalTime: q.arrivalTime || ''
  }

  const selectedRoomsForChild = selectedRooms

  return (
    <>
      <SeoHead title='Payment – GoCommunityMap' description='Complete your hotel booking payment.' />
      <BookingStepperHeader currentStep={3} />

      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 }, pt: 4 }}>
          <Elements stripe={stripePromise}>
            <StripePaymentContent bookingData={bookingData} selectedRooms={selectedRoomsForChild} />
          </Elements>
        </Box>
      </Box>
    </>
  )
}

HotelBookingPayment.guestGuard = true
HotelBookingPayment.getLayout = page => page

export default HotelBookingPayment
