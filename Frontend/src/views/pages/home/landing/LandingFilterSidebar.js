import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

import { defaultPageFont } from 'src/@core/utils'

const SidebarBlock = ({ title, children }) => (
  <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #e8eff2', mb: 2.5, backgroundColor: '#ffffff' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Typography
        sx={{
          fontSize: '0.8rem',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: '#2a3f5f',
          fontWeight: 800,
          fontFamily: defaultPageFont,
          mb: 1.8
        }}
      >
        {title}
      </Typography>
      <Box>{children}</Box>
    </CardContent>
  </Card>
)

const LandingFilterSidebar = ({ filterConfig, filterState, setFilterState, viewMode = 'list', onViewModeChange }) => {
  const toggleCheckbox = (groupId, optionId) => {
    const current = filterState[groupId] || {}
    setFilterState(prev => ({
      ...prev,
      [groupId]: {
        ...current,
        [optionId]: !current[optionId]
      }
    }))
  }

  const setRadio = (groupId, value) => {
    setFilterState(prev => ({ ...prev, [groupId]: value }))
  }

  const updateCounter = (groupId, counterId, delta) => {
    const current = filterState[groupId] || {}
    const currentValue = current[counterId] || 0
    setFilterState(prev => ({
      ...prev,
      [groupId]: {
        ...current,
        [counterId]: Math.max(0, currentValue + delta)
      }
    }))
  }

  const setRange = (groupId, value) => {
    setFilterState(prev => ({ ...prev, [groupId]: value }))
  }

  const setSwitch = (groupId, checked) => {
    setFilterState(prev => ({ ...prev, [groupId]: checked }))
  }

  return (
    <Box>
      <Card elevation={0}>
        <Box sx={{ position: 'relative', p: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: 140,
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
              position: 'relative'
            }}
          >
            {/* Map-like grid pattern */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            {/* Map location markers */}
            <Box sx={{ position: 'absolute', top: '30%', left: '25%', width: 8, height: 8 }}>
              <IconifyIcon icon='tabler:map-pin-filled' fontSize='1.5rem' color='#10B981' />
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', left: '60%', width: 8, height: 8 }}>
              <IconifyIcon icon='tabler:map-pin-filled' fontSize='1.5rem' color='#10B981' />
            </Box>
            <Box sx={{ position: 'absolute', top: '65%', left: '35%', width: 8, height: 8 }}>
              <IconifyIcon icon='tabler:map-pin-filled' fontSize='1.5rem' color='#10B981' />
            </Box>
            {/* Decorative roads */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M 0 50 Q 100 30, 200 60 T 400 50' stroke='rgba(16, 185, 129, 0.2)' strokeWidth='3' fill='none' />
              <path d='M 50 0 Q 80 80, 100 140' stroke='rgba(16, 185, 129, 0.2)' strokeWidth='3' fill='none' />
            </svg>
          </Box>
          <Card
            elevation={2}
            onClick={() => onViewModeChange?.(viewMode === 'list' ? 'map' : 'list')}
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: 18,
              borderRadius: 5,
              px: 1.6,
              py: 0.8,
              cursor: 'pointer',
              transition: 'all 0.2s',
              bgcolor: viewMode === 'map' ? '#10B981' : '#ffffff',
              '&:hover': {
                transform: 'translateX(-50%) translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            <Stack direction='row' spacing={0.7} alignItems='center'>
              <IconifyIcon
                icon={viewMode === 'map' ? 'tabler:list' : 'tabler:map-2'}
                fontSize='0.9rem'
                color={viewMode === 'map' ? '#ffffff' : '#23314a'}
              />
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  color: viewMode === 'map' ? '#ffffff' : '#23314a',
                  fontWeight: 700,
                  fontFamily: defaultPageFont
                }}
              >
                {viewMode === 'map' ? 'Show as list' : 'Show on map'}
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Card>

      {filterConfig?.map(group => {
        // Counter type for bedrooms/bathrooms
        if (group.type === 'counter') {
          return (
            <SidebarBlock key={group.id} title={group.title}>
              <Stack spacing={5}>
                {group.counters.map(counter => {
                  const value = filterState[group.id]?.[counter.id] ?? counter.value

                  return (
                    <Stack key={counter.id} direction='row' alignItems='center' justifyContent='space-between'>
                      <Typography
                        sx={{ fontSize: '12px', color: '#1f2e47', fontFamily: defaultPageFont, fontWeight: 800 }}
                      >
                        {counter.label}
                      </Typography>
                      <Stack direction='row' alignItems='center' spacing={1.5}>
                        <IconButton
                          size='small'
                          onClick={() => updateCounter(group.id, counter.id, -1)}
                          disabled={value <= counter.min}
                          sx={{
                            border: '1.5px solid #94A3B8',

                            width: 24,
                            height: 24,
                            borderRadius: 0.5,
                            color: '#2a3f5f'
                          }}
                        >
                          <IconifyIcon icon='tabler:minus' fontSize='12px' />
                        </IconButton>
                        <Typography
                          sx={{
                            minWidth: 20,
                            textAlign: 'center',
                            fontWeight: 600,
                            color: '#1f2e47',
                            fontFamily: defaultPageFont,
                            fontSize: '12px'
                          }}
                        >
                          {value}
                        </Typography>
                        <IconButton
                          size='small'
                          onClick={() => updateCounter(group.id, counter.id, 1)}
                          sx={{
                            border: '1.5px solid #10B981',
                            width: 24,
                            height: 24,
                            borderRadius: 0.5,
                            color: '#10B981'
                          }}
                        >
                          <IconifyIcon icon='tabler:plus' fontSize='12px' />
                        </IconButton>
                      </Stack>
                    </Stack>
                  )
                })}
              </Stack>
            </SidebarBlock>
          )
        }

        // Radio type for budget and review score
        if (group.type === 'radio') {
          const selectedValue = filterState[group.id]

          return (
            <SidebarBlock key={group.id} title={group.title}>
              <RadioGroup value={selectedValue || ''} onChange={e => setRadio(group.id, e.target.value)}>
                <Stack spacing={0.8}>
                  {group.options?.map(option => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio size='small' sx={{ py: 0.3, '&.Mui-checked': { color: '#10B981' } }} />}
                      label={
                        <Stack
                          direction='row'
                          alignItems='center'
                          justifyContent='space-between'
                          sx={{ flex: 1, ml: 0.5 }}
                        >
                          <Typography
                            sx={{ fontSize: '0.88rem', color: '#1f2e47', fontFamily: defaultPageFont, fontWeight: 500 }}
                          >
                            {option.label}
                          </Typography>
                          {/* {option.count !== undefined && (
                            <Typography sx={{ fontSize: '0.82rem', color: '#7a8ca0', fontFamily: defaultPageFont  }}>
                              {option.count}
                            </Typography>
                          )} */}
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  ))}
                </Stack>
              </RadioGroup>
            </SidebarBlock>
          )
        }

        // Checkbox type for facilities and activities
        if (group.type === 'checkbox') {
          return (
            <SidebarBlock key={group.id} title={group.title}>
              <Stack spacing={0.8}>
                {group?.options?.map(option => {
                  const checked = filterState[group.id]?.[option.id] ?? Boolean(option.defaultChecked)

                  return (
                    <FormControlLabel
                      key={option.id}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleCheckbox(group.id, option.id)}
                          size='small'
                          sx={{ py: 0.3, '&.Mui-checked': { color: '#10B981' } }}
                        />
                      }
                      label={
                        <Stack
                          direction='row'
                          alignItems='center'
                          justifyContent='space-between'
                          sx={{ flex: 1, ml: 0.5 }}
                        >
                          <Typography
                            sx={{ fontSize: '0.88rem', color: '#1f2e47', fontFamily: defaultPageFont, fontWeight: 500 }}
                          >
                            {option.label}
                          </Typography>
                          {/* {option.count !== undefined && (
                            <Typography sx={{ fontSize: '0.82rem', color: '#7a8ca0', fontFamily: defaultPageFont  }}>
                              {option.count}
                            </Typography>
                          )} */}
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  )
                })}
              </Stack>
            </SidebarBlock>
          )
        }

        // Range type for sliders (price range, property size)
        if (group.type === 'range') {
          const value = filterState[group.id] || [group.min, group.max]

          return (
            <SidebarBlock key={group.id} title={group.title}>
              <Stack spacing={2}>
                <Slider
                  value={value}
                  onChange={(e, newValue) => setRange(group.id, newValue)}
                  min={group.min}
                  max={group.max}
                  valueLabelDisplay='auto'
                  sx={{
                    color: '#10B981',
                    '& .MuiSlider-thumb': {
                      width: 18,
                      height: 18
                    }
                  }}
                />
                <Stack direction='row' spacing={1}>
                  <Card sx={{ flex: 1, backgroundColor: '#f8fafb' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#7a8ca0', fontFamily: defaultPageFont, mb: 0.5 }}>
                        Min
                      </Typography>
                      <Typography
                        sx={{ fontSize: '0.9rem', color: '#1f2e47', fontFamily: defaultPageFont, fontWeight: 600 }}
                      >
                        {group.formatValue ? group.formatValue(value[0]) : value[0]}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, backgroundColor: '#f8fafb' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#7a8ca0', fontFamily: defaultPageFont, mb: 0.5 }}>
                        Max
                      </Typography>
                      <Typography
                        sx={{ fontSize: '0.9rem', color: '#1f2e47', fontFamily: defaultPageFont, fontWeight: 600 }}
                      >
                        {group.formatValue ? group.formatValue(value[1]) : value[1]}
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            </SidebarBlock>
          )
        }

        // Switch type for boolean toggles (allow pets)
        if (group.type === 'switch') {
          const checked = filterState[group.id] ?? Boolean(group.defaultChecked)

          return (
            <SidebarBlock key={group.id} title={group.title}>
              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    onChange={e => setSwitch(group.id, e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10B981'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-  track': {
                        backgroundColor: '#10B981'
                      }
                    }}
                  />
                }
                label={group.label}
              />
            </SidebarBlock>
          )
        }

        return null
      })}
    </Box>
  )
}

export default LandingFilterSidebar
