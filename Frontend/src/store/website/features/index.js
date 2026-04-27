import { API_URL, getFeaturesAPI, createFeaturesAPI, deleteFeaturesAPI, updateFeaturesAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getFeatures = createAsyncThunk(API_URL.GET_FEATURES, async data => {
  const response = await getFeaturesAPI(data)

  return response?.data
})

export const updateFeatures = createAsyncThunk(API_URL.CREATE_FEATURES, async (data, { dispatch, getState }) => {
  const isUpdate = data?.FEATURES_ID !== null
  const postResponse = await (isUpdate ? updateFeaturesAPI(data) : createFeaturesAPI(data))

  const response = await dispatch(getFeatures({ ...getState().features.params, TYPE: 0 }))

  return postResponse !== undefined && response.payload
})

export const deleteFeatures = createAsyncThunk(API_URL.DELETE_FEATURES, async (data, { dispatch, getState }) => {
  const postResponse = await deleteFeaturesAPI(data)

  const response = await dispatch(getFeatures({ ...getState().features.params, TYPE: 0 }))

  return postResponse !== undefined && response.payload
})

export const featuresSlice = createSlice({
  name: 'features',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getFeatures.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default featuresSlice.reducer
