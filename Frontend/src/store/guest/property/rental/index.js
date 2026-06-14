import { getPropertiesAPI, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getRentals = createAsyncThunk('rental', async data => {
  const response = await getPropertiesAPI({ ...data, LISTING_TYPE_ID: listingTypes.RENTAL.LISTING_TYPE_ID })

  return response?.data
})

// Backward compatibility for existing imports that still use getRental
export const getRental = getRentals

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
    builder.addCase(getRentals.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default rentalSlice.reducer
