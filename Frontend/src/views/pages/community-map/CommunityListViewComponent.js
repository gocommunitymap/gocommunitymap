import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'

import {
  getCommunitiesAPI,
  getGlobalParametersAPI,
  updateCommunityMemberAPI,
  getCommunitiesMemberListAPI
} from 'src/configs'
import { defaultPageFont, GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'
import LoginModal from 'src/layouts/components/horizontal/LoginModal'
import { Modal } from 'src/views/components'

const DEFAULT_COMMUNITY_IMAGE = '/images/default/default-picture.png'

const normalizeCommunity = row => ({
  id: row?.COMMUNITY_ID ?? row?.id ?? row?.SECTION_ID ?? null,
  name: row?.COMMUNITY_NAME ?? row?.name ?? row?.SECTION_TITLE ?? '',
  location: row?.LOCATION ?? row?.location ?? row?.HEADING ?? '',
  members: row?.MEMBERS ?? row?.members ?? row?.DESCRIPTION ?? '0',
  countryCode: row?.COUNTRY_CODE ?? row?.countryCode ?? row?.MORE_BUTTON_LINK ?? '',
  region: row?.REGION ?? row?.region ?? row?.MORE_BUTTON_TEXT ?? '',
  image: row?.PICTURE_LINK ?? row?.image ?? DEFAULT_COMMUNITY_IMAGE,
  isJoined: Boolean(row?.IS_JOINED ?? row?.IS_MEMBER ?? row?.JOINED)
})

const getCommunityIdFromRow = row => row?.COMMUNITY_ID ?? row?.SECTION_ID ?? row?.ID ?? row?.id ?? null

const getApiRows = response => {
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.data)) return response.data.data
  if (Array.isArray(response)) return response

  return []
}

const CommunityListViewComponent = () => {
  const { user } = useAuth()
  const [communities, setCommunities] = useState([])
  const [regions, setRegions] = useState(['All Regions'])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    isSubmit: false,
    communityId: null,
    communityName: '',
    action: 'join'
  })

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    Promise.all([
      getCommunitiesAPI({ ACTIVE: true }),
      getGlobalParametersAPI({ TYPE_CODE: GLOBAL_PARAMETER_TYPES.POPULAR_REGION, ACTIVE: true }),
      user?.usercode ? getCommunitiesMemberListAPI({ ACTIVE: true }) : Promise.resolve([])
    ])
      .then(([communitiesResponse, regionsResponse, membersResponse]) => {
        if (!isMounted) return

        const apiRows = getApiRows(communitiesResponse)
        const regionRows = getApiRows(regionsResponse)
        const memberRows = getApiRows(membersResponse)

        const activeMemberCommunityIds = new Set(
          memberRows
            .filter(item => (item?.ACTIVE ?? item?.active ?? true) === true)
            .map(item => getCommunityIdFromRow(item))
            .filter(Boolean)
        )

        const regionOptions = Array.from(
          new Set(
            regionRows
              .filter(item => item?.ACTIVE !== false)
              .map(item => item?.PARAMETER_DESCRIPTION_3)
              .filter(Boolean)
          )
        )

        setCommunities(
          apiRows.map(row => {
            const community = normalizeCommunity(row)

            return {
              ...community,
              isJoined: activeMemberCommunityIds.has(community.id) || community.isJoined
            }
          })
        )
        setRegions(['All Regions', ...regionOptions])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user?.usercode])

  useEffect(() => {
    if (!regions.includes(selectedRegion)) {
      setSelectedRegion('All Regions')
    }
  }, [regions, selectedRegion])

  useEffect(() => {
    if (!user?.usercode || !pendingAction) return

    setShowLoginModal(false)
    setConfirmState({
      isOpen: true,
      isSubmit: false,
      communityId: pendingAction.communityId,
      communityName: pendingAction.communityName,
      action: pendingAction.action
    })
    setPendingAction(null)
  }, [user?.usercode, pendingAction])

  const handleJoinLeaveClick = community => {
    const action = community.isJoined ? 'leave' : 'join'

    if (!user?.usercode) {
      setPendingAction({
        communityId: community.id,
        communityName: community.name,
        action
      })
      setShowLoginModal(true)

      return
    }

    setConfirmState({
      isOpen: true,
      isSubmit: false,
      communityId: community.id,
      communityName: community.name,
      action
    })
  }

  const handleConfirmMembership = () => {
    if (!confirmState.communityId) return
    const nextActive = confirmState.action === 'join'

    setConfirmState(prev => ({ ...prev, isSubmit: true }))

    updateCommunityMemberAPI({ COMMUNITY_ID: confirmState.communityId, ACTIVE: nextActive })
      .then(response => {
        if (response === false || response === undefined) return

        setCommunities(prev =>
          prev.map(item =>
            item.id === confirmState.communityId
              ? {
                  ...item,
                  isJoined: nextActive
                }
              : item
          )
        )

        toast.success(confirmState.action === 'join' ? 'Community joined successfully' : 'Community left successfully')

        setConfirmState({
          isOpen: false,
          isSubmit: false,
          communityId: null,
          communityName: '',
          action: 'join'
        })
      })
      .finally(() => {
        setConfirmState(prev => ({ ...prev, isSubmit: false }))
      })
  }

  const filteredCommunities = communities.filter(community => {
    const communityName = String(community.name || '').toLowerCase()
    const communityLocation = String(community.location || '').toLowerCase()
    const query = String(searchQuery || '').toLowerCase()

    const matchesSearch = communityName.includes(query) || communityLocation.includes(query)

    const matchesRegion = selectedRegion === 'All Regions' || community.region === selectedRegion

    return matchesSearch && matchesRegion
  })

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          sx={{
            fontSize: '1.1rem',
            color: '#6f7f98',
            fontFamily: defaultPageFont
          }}
        >
          Discover Your Community Around the World
        </Typography>
      </Box>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder='Search for a city or community...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconifyIcon icon='tabler:search' fontSize='1.5rem' color='#6f7f98' />
              </InputAdornment>
            )
          }}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            display: 'block',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              fontFamily: defaultPageFont,
              fontSize: '1rem',
              '& fieldset': {
                borderColor: '#e0e7ed'
              },
              '&:hover fieldset': {
                borderColor: '#10B981'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#10B981'
              }
            }
          }}
        />
      </Box>

      {/* Region Filter Pills */}
      <Stack
        direction='row'
        spacing={1.5}
        sx={{
          mb: 5,
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        {regions.map(region => (
          <Chip
            key={region}
            label={region}
            onClick={() => setSelectedRegion(region)}
            sx={{
              bgcolor: selectedRegion === region ? '#10B981' : 'white',
              color: selectedRegion === region ? 'white' : '#0b1730',
              fontFamily: defaultPageFont,
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
              height: 'auto',
              border: '1px solid',
              borderColor: selectedRegion === region ? '#10B981' : '#e0e7ed',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: selectedRegion === region ? '#059669' : '#f0f4f8',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
              }
            }}
          />
        ))}
      </Stack>

      {/* Communities Grid */}
      <Box
        key={`${selectedRegion}-${searchQuery}`}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          '@keyframes fadeInUp': {
            from: {
              opacity: 0,
              transform: 'translateY(20px)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        {filteredCommunities.map((community, index) => (
          <Card
            key={community.id ?? `${community.name}-${index}`}
            sx={{
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
              maxWidth: { xs: '100%', sm: 400, md: 380 },
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e8eff2',
              animation: 'fadeInUp 0.5s ease-out',
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'both',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 35px rgba(16, 185, 129, 0.2)',
                borderColor: '#10B981'
              }
            }}
          >
            {/* Community Image */}
            <Box
              sx={{
                position: 'relative',
                height: 180,
                backgroundImage: `url(${community.image || DEFAULT_COMMUNITY_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                bgcolor: '#e0e7ed'
              }}
            >
              {/* Country Flag Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,

                  // bgcolor: 'white',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: defaultPageFont
                }}
              >
                {/* <span style={{ fontSize: '1.2rem' }}>{community.flag}</span> */}
                <span>{community.countryCode}</span>
              </Box>
            </Box>

            {/* Community Info */}
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0b1730',
                  fontFamily: defaultPageFont,
                  mb: 1.5
                }}
              >
                {community.name}
              </Typography>

              <Stack spacing={1} sx={{ mb: 2.5 }}>
                <Stack direction='row' alignItems='center' spacing={0.8}>
                  <IconifyIcon icon='tabler:map-pin' fontSize='1.1rem' color='#6f7f98' />
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#6f7f98',
                      fontFamily: defaultPageFont
                    }}
                  >
                    {community.location}
                  </Typography>
                </Stack>

                <Stack direction='row' alignItems='center' spacing={0.8}>
                  <IconifyIcon icon='tabler:users' fontSize='1.1rem' color='#6f7f98' />
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#6f7f98',
                      fontFamily: defaultPageFont
                    }}
                  >
                    {community.members} members
                  </Typography>
                </Stack>
              </Stack>

              <Button
                fullWidth
                variant='contained'
                onClick={() => handleJoinLeaveClick(community)}
                sx={{
                  bgcolor: community.isJoined ? '#ef4444' : '#10B981',
                  color: 'white',
                  fontFamily: defaultPageFont,
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.2,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: community.isJoined ? '#dc2626' : '#059669',
                    boxShadow: community.isJoined
                      ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                      : '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }
                }}
              >
                {community.isJoined ? 'Left Community' : 'Join Community'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            sx={{
              fontSize: '1.2rem',
              color: '#6f7f98',
              fontFamily: defaultPageFont
            }}
          >
            Loading communities...
          </Typography>
        </Box>
      )}

      {/* No Results */}
      {!isLoading && filteredCommunities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            sx={{
              fontSize: '1.2rem',
              color: '#6f7f98',
              fontFamily: defaultPageFont
            }}
          >
            No communities found. Try a different search.
          </Typography>
        </Box>
      )}

      <Modal
        isOpen={confirmState.isOpen}
        onClose={() =>
          setConfirmState({ isOpen: false, isSubmit: false, communityId: null, communityName: '', action: 'join' })
        }
        title={confirmState.action === 'join' ? 'Join Community' : 'Leave Community'}
      >
        <Stack spacing={3}>
          <Alert severity='warning'>
            {confirmState.action === 'join'
              ? 'Are you sure you want to join this community?'
              : 'Are you sure you want to leave this community?'}
          </Alert>

          <Typography sx={{ textAlign: 'center', color: '#0b1730', fontFamily: defaultPageFont, fontWeight: 700 }}>
            {confirmState.communityName}
          </Typography>

          <Stack direction='row' spacing={2} justifyContent='center'>
            <Button
              variant='contained'
              color={confirmState.action === 'join' ? 'success' : 'error'}
              disabled={confirmState.isSubmit}
              onClick={handleConfirmMembership}
            >
              Yes
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              disabled={confirmState.isSubmit}
              onClick={() =>
                setConfirmState({
                  isOpen: false,
                  isSubmit: false,
                  communityId: null,
                  communityName: '',
                  action: 'join'
                })
              }
            >
              No
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <div style={{ display: 'none' }}>
        <LoginModal
          isDirectOpen={showLoginModal}
          callBack={() => {
            setShowLoginModal(false)
            if (!user?.usercode) {
              setPendingAction(null)
            }
          }}
        />
      </div>
    </>
  )
}

export default CommunityListViewComponent
