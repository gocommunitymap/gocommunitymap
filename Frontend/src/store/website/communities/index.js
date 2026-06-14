import {
  API_URL,
  getCommunityAPI,
  createCommunityAPI,
  updateCommunityAPI,
  deleteCommunityAPI,
  updateFileAPI,
  deleteFileAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { FILE_DIRECTORIES, fetCurrentFullTime } from 'src/@core/utils'

export const getCommunities = createAsyncThunk(`${API_URL.GET_COMMUNITIES}/communities`, async data => {
  const response = await getCommunityAPI(data)

  return response?.data ?? []
})

export const updateCommunities = createAsyncThunk(
  `${API_URL.CREATE_COMMUNITIES}/communities`,
  async ({ data, file }, { dispatch, getState }) => {
    let payload = { ...data }
    const isUpdate = data?.COMMUNITY_ID !== null

    if (file) {
      const fileName = fetCurrentFullTime()
      const lastDot = file.name.lastIndexOf('.')
      const ext = file.name.substring(lastDot + 1)

      if (isUpdate && data.PICTURE_LINK) {
        const deleteFileName = data.PICTURE_LINK.substring(data.PICTURE_LINK.lastIndexOf('/') + 1)
        deleteFileAPI({ dir: FILE_DIRECTORIES.COMMUNITIES.WITHOUT_PREFIX, fileName: deleteFileName })
      }

      updateFileAPI({ dir: FILE_DIRECTORIES.COMMUNITIES.WITHOUT_PREFIX, fileName, file })
      const imageLink = `${FILE_DIRECTORIES.COMMUNITIES.WITH_PREFIX}${fileName}.${ext}`
      payload = { ...payload, PICTURE_LINK: imageLink }
    }

    const postResponse = await (isUpdate ? updateCommunityAPI(payload) : createCommunityAPI(payload))
    const response = await dispatch(getCommunities(getState().communities.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteCommunities = createAsyncThunk(
  `${API_URL.DELETE_COMMUNITIES}/communities`,
  async (data, { dispatch, getState }) => {
    if (data?.PICTURE_LINK) {
      const deleteFileName = data.PICTURE_LINK.substring(data.PICTURE_LINK.lastIndexOf('/') + 1)
      deleteFileAPI({ dir: FILE_DIRECTORIES.COMMUNITIES.WITHOUT_PREFIX, fileName: deleteFileName })
    }

    const postResponse = await deleteCommunityAPI({ ...data, COMMUNITY_ID: data.COMMUNITY_ID })
    const response = await dispatch(getCommunities(getState().communities.params))

    return postResponse !== undefined && response.payload
  }
)

export const communitiesSlice = createSlice({
  name: 'communities',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCommunities.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default communitiesSlice.reducer
