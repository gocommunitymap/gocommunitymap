// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import { grey } from '@mui/material/colors'
import { IconButton } from '@mui/material'

const SwiperControls = ({ direction, data }) => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

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

  return (
    <>
      <Box className='navigation-wrapper'>
        <KeenSliderWrapper>
          <Box ref={sliderRef} className='keen-slider'>
            {data.map(row => (
              <Box
                key={row.ID}
                className='keen-slider__slide'
                sx={{
                  height: { md: 335, xs: 200 } /* Fixed height for the container */,
                  overflow: 'hidden' /* Hides overflow content */,
                  position: 'relative' /* Establishes containing block for absolutely positioned child */
                }}
              >
                {/* src={`${row.LINK.replace('.webp', '.jpg')}`} */}
                <img
                  src={`${row.LINK}`}
                  alt='swiper 1'
                  style={{
                    height: '100%' /* Sets the image height to 100% of the container's height */,
                    width: 'auto' /* Ensures the image width follows its natural size */,
                    minWidth: '100%',
                    position: 'absolute' /* Allows positioning relative to the container */,
                    objectFit: 'cover' /* Ensures the image covers the entire container */
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
                <IconButton size='small' sx={{ p: 0, mx: 1, bgcolor: '#00000024' }}>
                  <Icon
                    icon='mdi:chevron-left'
                    style={{ color: '#fff', fontSize: 40 }}
                    className={clsx('arrow arrow-left', {
                      'arrow-disabled': currentSlide === 0
                    })}
                    onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
                  />
                </IconButton>
                <IconButton size='small' sx={{ p: 0, mx: 1, bgcolor: '#00000024' }}>
                  <Icon
                    icon='mdi:chevron-right'
                    style={{ color: '#fff', fontSize: 40 }}
                    className={clsx('arrow arrow-right', {
                      'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
                    })}
                    onClick={e => e.stopPropagation() || instanceRef.current?.next()}
                  />
                </IconButton>
              </Box>
            )}
            {loaded && instanceRef.current && (
              <Box className='swiper-dots'>
                {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                  return (
                    <Badge
                      key={idx}
                      variant='dot'
                      component='div'
                      className={clsx({
                        active: currentSlide === idx
                      })}
                      onClick={() => {
                        instanceRef.current?.moveToIdx(idx)
                      }}
                    ></Badge>
                  )
                })}
              </Box>
            )}
          </Box>
        </KeenSliderWrapper>
      </Box>
    </>
  )
}

export default SwiperControls
