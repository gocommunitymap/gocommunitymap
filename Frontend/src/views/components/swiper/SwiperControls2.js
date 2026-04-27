// ** React Imports
import { useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import LinkSaveButton from '../buttons/link-save-button'
import ShareButton from '../buttons/share-button'

const SwiperControls2 = ({ direction, data, ACTIVE, PROPERTY_ID }) => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openGallery, setOpenGallery] = useState(false)
  const [dialogSlide, setDialogSlide] = useState(0)
  const safeImages = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const previewImages = useMemo(() => safeImages.slice(0, 5), [safeImages])

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider({
    rtl: direction === 'rtl',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  if (!safeImages.length) return null

  return (
    <>
      <Box className='navigation-wrapper'>
        <KeenSliderWrapper>
          <Box
            ref={sliderRef}
            className='keen-slider'
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                top: 16,
                right: 16,
                display: 'flex',
                gap: 1
              }}
            >
              <ShareButton URL={currentUrl} />
              <LinkSaveButton ACTIVE={ACTIVE} PROPERTY_ID={PROPERTY_ID} />
            </Box> */}

            {safeImages?.length > 4 && (
              <Box sx={{ position: 'absolute', zIndex: 2, bottom: 16, right: 16 }}>
                <Button
                  size='small'
                  variant='contained'
                  onClick={e => {
                    e.stopPropagation()
                    setOpenGallery(true)
                  }}
                  sx={{
                    bgcolor: '#fff',
                    color: '#101828',
                    boxShadow: '0 6px 18px rgba(16,24,40,0.15)',
                    '&:hover': { bgcolor: '#f8fafc' }
                  }}
                  startIcon={<Icon icon='tabler:photo' />}
                >
                  View all photos ({safeImages?.length || ''})
                </Button>
              </Box>
            )}

            {previewImages.slice(0, 3).map((row, index) => (
              <Box
                key={row?.ID || index}
                className='keen-slider__slide'
                sx={{
                  height: { md: 500, xs: 300 },
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <img
                  src={`${(row?.LINK || '').replace('.webp', '.jpg')}`}
                  alt={`property-${index + 1}`}
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
            {loaded && instanceRef.current && (
              <Box
                height='100%'
                width='100%'
                position='absolute'
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <IconButton
                  size='small'
                  sx={{
                    p: 0,
                    mx: 1,
                    width: 44,
                    height: 44,
                    bgcolor: '#ffffffd9',
                    '&:hover': { bgcolor: '#fff' }
                  }}
                >
                  <Icon
                    icon='mdi:chevron-left'
                    style={{ color: '#101828', fontSize: 32, opacity: currentSlide === 0 ? 0.35 : 1 }}
                    onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
                  />
                </IconButton>
                <IconButton
                  size='small'
                  sx={{
                    p: 0,
                    mx: 1,
                    width: 44,
                    height: 44,
                    bgcolor: '#ffffffd9',
                    '&:hover': { bgcolor: '#fff' }
                  }}
                >
                  <Icon
                    icon='mdi:chevron-right'
                    style={{
                      color: '#101828',
                      fontSize: 32,
                      opacity: currentSlide === instanceRef.current.track.details.slides.length - 1 ? 0.35 : 1
                    }}
                    onClick={e => e.stopPropagation() || instanceRef.current?.next()}
                  />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              mt: 1.5,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(5, minmax(0, 1fr))',
                md: 'repeat(5, minmax(0, 1fr))'
              },
              gap: 1
            }}
          >
            {previewImages.map((row, index) => {
              const isActive = index === currentSlide

              return (
                <Box
                  key={`thumb-${row?.ID || index}`}
                  onClick={() => instanceRef.current?.moveToIdx(index)}
                  sx={{
                    height: { xs: 54, md: 66 },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: isActive ? '#22c55e' : 'transparent',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.86,
                    transition: 'all .2s ease'
                  }}
                >
                  <img
                    src={`${(row?.LINK || '').replace('.webp', '.jpg')}`}
                    alt={`property-thumb-${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )
            })}
          </Box>

          <Dialog
            open={openGallery}
            onClose={() => setOpenGallery(false)}
            maxWidth='lg'
            fullWidth
            aria-labelledby='all-photos-dialog-title'
            PaperProps={{ sx: { borderRadius: 2 } }}
          >
            <DialogTitle
              id='all-photos-dialog-title'
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}
            >
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                All photos ({safeImages.length})
              </Typography>
              <IconButton aria-label='close gallery' onClick={() => setOpenGallery(false)}>
                <Icon icon='tabler:x' />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 1.2, md: 2 } }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#0f172a',
                  height: { xs: 280, sm: 380, md: 400 }
                }}
              >
                <Box
                  key={`dialog-slide-${dialogSlide}`}
                  component='img'
                  src={`${(safeImages[dialogSlide]?.LINK || '').replace('.webp', '.jpg')}`}
                  alt={`all-photos-${dialogSlide + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    animation: 'dialogSlideIn .28s ease',
                    '@keyframes dialogSlideIn': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateX(20px)'
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateX(0)'
                      }
                    }
                  }}
                />

                <IconButton
                  size='small'
                  onClick={() => setDialogSlide(prev => Math.max(prev - 1, 0))}
                  disabled={dialogSlide === 0}
                  sx={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 34,
                    height: 34,
                    bgcolor: '#ffffffd9',
                    '&:hover': { bgcolor: '#fff' }
                  }}
                >
                  <Icon icon='mdi:chevron-left' style={{ color: '#101828', fontSize: 24 }} />
                </IconButton>

                <IconButton
                  size='small'
                  onClick={() => setDialogSlide(prev => Math.min(prev + 1, safeImages.length - 1))}
                  disabled={dialogSlide === safeImages.length - 1}
                  sx={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 34,
                    height: 34,
                    bgcolor: '#ffffffd9',
                    '&:hover': { bgcolor: '#fff' }
                  }}
                >
                  <Icon icon='mdi:chevron-right' style={{ color: '#101828', fontSize: 24 }} />
                </IconButton>
              </Box>

              <Box
                sx={{
                  mt: 1.2,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                  gap: 0.8,
                  maxHeight: 180,
                  overflowY: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  pr: 0.5
                }}
              >
                {safeImages.map((row, index) => {
                  const isActive = index === dialogSlide

                  return (
                    <Box
                      key={`modal-img-${row?.ID || index}`}
                      onClick={() => setDialogSlide(index)}
                      sx={{
                        height: { xs: 54, md: 90 },
                        borderRadius: 1,
                        overflow: 'hidden',

                        border: '2px solid',
                        borderColor: isActive ? '#22c55e' : 'transparent',
                        cursor: 'pointer',
                        opacity: isActive ? 1 : 0.82,
                        transition: 'all .2s ease'
                      }}
                    >
                      <img
                        src={`${(row?.LINK || '').replace('.webp', '.jpg')}`}
                        alt={`all-photos-thumb-${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </DialogContent>
          </Dialog>
        </KeenSliderWrapper>
      </Box>
    </>
  )
}

export default SwiperControls2
