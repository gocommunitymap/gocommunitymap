import { getPropertiesAPI, getPropertiesFullDetailsAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getHotels = createAsyncThunk('hotels', async data => {
  const response = await getPropertiesAPI({
    ...data,
    LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID
  })

  return response?.data
})

export const hotelsSlice = createSlice({
  name: 'hotels',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getHotels.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default hotelsSlice.reducer
