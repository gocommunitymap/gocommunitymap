import {
  API_URL,
  getGlobalParametersAPI,
  createGlobalParametersAPI,
  deleteGlobalParametersAPI,
  updateGlobalParametersAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

const TYPE_CODE = GLOBAL_PARAMETER_TYPES.POPULAR_REGION
const ALLOWED = true

export const getCommunityRegions = createAsyncThunk(`${API_URL.GET_GLOBAL_PARAMETERS}/communityRegions`, async data => {
  const response = await getGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

  return response?.data
})

export const updateCommunityRegions = createAsyncThunk(
  `${API_URL.CREATE_GLOBAL_PARAMETERS}/communityRegions`,
  async (data, { dispatch, getState }) => {
    const isUpdate = data?.ID !== null
    const payload = { ...data, TYPE_CODE, ALLOWED }
    const postResponse = await (isUpdate ? updateGlobalParametersAPI(payload) : createGlobalParametersAPI(payload))

    const response = await dispatch(getCommunityRegions(getState().communityRegions.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteCommunityRegions = createAsyncThunk(
  `${API_URL.DELETE_GLOBAL_PARAMETERS}/communityRegions`,
  async (data, { dispatch, getState }) => {
    const postResponse = await deleteGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

    const response = await dispatch(getCommunityRegions(getState().communityRegions.params))

    return postResponse !== undefined && response.payload
  }
)

export const communityRegionsSlice = createSlice({
  name: 'communityRegions',
  initialState: { data: [], total: 1, params: {}, allData: [] },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCommunityRegions.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default communityRegionsSlice.reducer
