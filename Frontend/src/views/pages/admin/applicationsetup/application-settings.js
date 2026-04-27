import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Switch from '@mui/material/Switch'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import { Icon } from '@iconify/react'
import { getGlobalParametersAPI, updateGlobalParametersAPI } from 'src/configs'
import { Card, CardHeader, Divider } from '@mui/material'

// Normalise PARAMETER_DESCRIPTION_2 to one of: text | number | checkbox | switch
const resolveType = raw => {
  const t = String(raw || 'text')
    .toLowerCase()
    .trim()
  if (t === 'number') return 'number'
  if (t === 'checkbox') return 'checkbox'
  if (t === 'switch') return 'switch'

  return 'text'
}

const isTruthy = val => val === '1' || val === 'true' || val === true

export const ApplicationSettings = () => {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')

  const loadSettings = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getGlobalParametersAPI({ TYPE_CODE: 'APPSET' })
      const data = res?.data || []
      setSettings(
        data.map(item => ({
          ...item,
          _desc3: item.PARAMETER_DESCRIPTION_3 ?? '',
          _desc4: item.PARAMETER_DESCRIPTION_4 ?? ''
        }))
      )
    } catch {
      setError('Failed to load application settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const startEdit = item => {
    setEditingId(item.ID)
    setEditValue(item._desc4)
  }

  // For checkbox/switch: toggle immediately and save
  const handleBooleanToggle = async (item, checked) => {
    const newVal = checked ? '1' : '0'
    setSavingId(item.ID)
    try {
      await updateGlobalParametersAPI({
        ID: item.ID,
        TYPE_CODE: item.TYPE_CODE,
        TYPE_DESCRIPTION: item.TYPE_DESCRIPTION,
        PARAMETER_CODE_1: item.PARAMETER_CODE_1,
        PARAMETER_DESCRIPTION_1: item.PARAMETER_DESCRIPTION_1,
        PARAMETER_CODE_2: item.PARAMETER_CODE_2,
        PARAMETER_DESCRIPTION_2: item.PARAMETER_DESCRIPTION_2,
        PARAMETER_CODE_3: item.PARAMETER_CODE_3,
        PARAMETER_DESCRIPTION_3: item._desc3,
        PARAMETER_CODE_4: item.PARAMETER_CODE_4,
        PARAMETER_DESCRIPTION_4: newVal,
        ACTIVE: item.ACTIVE
      })
      setSettings(prev => prev.map(x => (x.ID === item.ID ? { ...x, _desc4: newVal } : x)))
    } catch {
      setError('Failed to save setting.')
    } finally {
      setSavingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleSave = async id => {
    const s = settings.find(x => x.ID === id)
    if (!s) return
    setSavingId(id)
    try {
      await updateGlobalParametersAPI({
        ID: s.ID,
        TYPE_CODE: s.TYPE_CODE,
        TYPE_DESCRIPTION: s.TYPE_DESCRIPTION,
        PARAMETER_CODE_1: s.PARAMETER_CODE_1,
        PARAMETER_DESCRIPTION_1: s.PARAMETER_DESCRIPTION_1,
        PARAMETER_CODE_2: s.PARAMETER_CODE_2,
        PARAMETER_DESCRIPTION_2: s.PARAMETER_DESCRIPTION_2,
        PARAMETER_CODE_3: s.PARAMETER_CODE_3,
        PARAMETER_DESCRIPTION_3: s._desc3,
        PARAMETER_CODE_4: s.PARAMETER_CODE_4,
        PARAMETER_DESCRIPTION_4: editValue,
        ACTIVE: s.ACTIVE
      })
      setSettings(prev => prev.map(x => (x.ID === id ? { ...x, _desc4: editValue } : x)))
      setEditingId(null)
      setEditValue('')
    } catch {
      setError('Failed to save setting.')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' py={6}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  const groups = settings.reduce((acc, item) => {
    const key = item.PARAMETER_CODE_1 || 'OTHER'
    if (!acc[key]) acc[key] = { label: item.PARAMETER_DESCRIPTION_1, items: [] }
    acc[key].items.push(item)

    return acc
  }, {})

  return (
    <Stack spacing={4}>
      {Object.entries(groups).map(([code, group]) => (
        <Card variant='elevation' key={code}>
          {/* Group header */}
          <CardHeader sx={{ py: 0, pt: 1, m: 0 }} title={group.label} />
          <Divider sx={{ borderColor: '#eee', m: 0, p: 0 }} />

          {/* Cards grid */}
          <Grid container spacing={3} sx={{ ml: 1, my: 3 }}>
            {group.items.map(item => {
              const isEditing = editingId === item.ID
              const isSaving = savingId === item.ID
              const fieldType = resolveType(item.PARAMETER_DESCRIPTION_2)
              const isBool = fieldType === 'checkbox' || fieldType === 'switch'
              const boolChecked = isTruthy(item._desc4)

              return (
                <Grid item key={item.ID} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      backgroundColor: isEditing ? 'transparent' : 'primary.light',
                      borderRadius: 2,
                      borderColor: isEditing ? 'primary.main !important' : 'transparent',
                      p: 2.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: 3 }
                    }}
                  >
                    {/* Field label */}
                    <Typography
                      variant='caption'
                      color='text.disabled'
                      sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}
                    >
                      {item._desc3}
                    </Typography>

                    {/* Value / edit control */}
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        {isBool ? (
                          fieldType === 'switch' ? (
                            <Switch
                              checked={boolChecked}
                              disabled={isSaving}
                              color='primary'
                              onChange={e => handleBooleanToggle(item, e.target.checked)}
                            />
                          ) : (
                            <Checkbox
                              checked={boolChecked}
                              disabled={isSaving}
                              color='primary'
                              onChange={e => handleBooleanToggle(item, e.target.checked)}
                            />
                          )
                        ) : isEditing ? (
                          <TextField
                            autoFocus
                            fullWidth
                            size='small'
                            type={fieldType === 'number' ? 'number' : 'text'}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSave(item.ID)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                          />
                        ) : (
                          <Typography variant='h6' fontWeight={700} color='text.primary'>
                            {item._desc4 || '—'}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {isBool ? (
                          isSaving && <CircularProgress size={16} />
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1, mx: 1 }}>
                            {isEditing ? (
                              <>
                                <Tooltip title='Save'>
                                  <span>
                                    <IconButton
                                      size='small'
                                      disabled={isSaving}
                                      onClick={() => handleSave(item.ID)}
                                      sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                                      }}
                                    >
                                      {isSaving ? (
                                        <CircularProgress size={14} sx={{ color: 'white' }} />
                                      ) : (
                                        <Icon icon='tabler:check' width={16} />
                                      )}
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title='Cancel'>
                                  <IconButton size='small' color='error' onClick={cancelEdit}>
                                    <Icon icon='tabler:x' width={16} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip title='Edit'>
                                <IconButton size='small' onClick={() => startEdit(item)}>
                                  <Icon icon='tabler:edit' width={16} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Card>
      ))}
    </Stack>
  )
}
