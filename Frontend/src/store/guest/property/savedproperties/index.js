import { getPropertiesByUserAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getPropertiesByUser = createAsyncThunk('saved', async data => {
  const response = await getPropertiesByUserAPI(data)

  return response?.data
})

export const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPropertiesByUser.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default savedSlice.reducer
