import { getPropertiesFullDetailsAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getRentalCom = createAsyncThunk('rental-com', async data => {
  const response = await getPropertiesFullDetailsAPI({
    ...data,
    LISTING_TYPE_ID: listingTypes.RENTAL_COM.LISTING_TYPE_ID
  })

  return response?.data
})

export const rentalComSlice = createSlice({
  name: 'rentalCom',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getRentalCom.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default rentalComSlice.reducer
