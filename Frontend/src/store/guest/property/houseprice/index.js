import { getPropertiesFullDetailsAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getHousePrice = createAsyncThunk('housePrice', async data => {
  const response = await getPropertiesFullDetailsAPI({
    ...data,
    LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID
  })

  return response?.data
})

export const housePriceSlice = createSlice({
  name: 'housePrice',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getHousePrice.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default housePriceSlice.reducer
