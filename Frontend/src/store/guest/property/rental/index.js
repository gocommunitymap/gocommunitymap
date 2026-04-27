import { getPropertiesFullDetailsAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getRental = createAsyncThunk('rental', async data => {
  const response = await getPropertiesFullDetailsAPI({ ...data, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })

  return response?.data
})

export const rentalSlice = createSlice({
  name: 'rental',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getRental.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default rentalSlice.reducer
