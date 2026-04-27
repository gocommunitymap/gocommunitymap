import { API_URL, getUtilitiesAPI, createUtilitiesAPI, deleteUtilitiesAPI, updateUtilitiesAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getUtilities = createAsyncThunk(API_URL.GET_UTILITIES, async data => {
  const response = await getUtilitiesAPI(data)

  return response?.data
})

export const updateUtilities = createAsyncThunk(API_URL.CREATE_UTILITIES, async (data, { dispatch, getState }) => {
  const isUpdate = data?.UTILITY_ID !== null
  const postResponse = await (isUpdate ? updateUtilitiesAPI(data) : createUtilitiesAPI(data))

  const response = await dispatch(getUtilities(getState().utilities.params))

  return postResponse !== undefined && response.payload
})

export const deleteUtilities = createAsyncThunk(API_URL.DELETE_UTILITIES, async (data, { dispatch, getState }) => {
  const postResponse = await deleteUtilitiesAPI(data)

  const response = await dispatch(getUtilities(getState().utilities.params))

  return postResponse !== undefined && response.payload
})

export const utilitiesSlice = createSlice({
  name: 'utilities',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUtilities.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default utilitiesSlice.reducer
