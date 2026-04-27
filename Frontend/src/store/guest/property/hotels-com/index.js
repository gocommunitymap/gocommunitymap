import { getPropertiesFullDetailsAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getHotelsCom = createAsyncThunk('hotels-com', async data => {
  const response = await getPropertiesFullDetailsAPI({
    ...data,
    LISTING_TYPE_ID: listingTypes.HOTELS_COM.LISTING_TYPE_ID
  })

  return response?.data
})

export const hotelsComSlice = createSlice({
  name: 'HotelsCom',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getHotelsCom.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default hotelsComSlice.reducer
