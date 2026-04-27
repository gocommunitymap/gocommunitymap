import { getPropertiesFullDetailsAPI, API_URL, listingTypes } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getNewHomes = createAsyncThunk('newHomes', async data => {
  const response = await getPropertiesFullDetailsAPI({
    ...data,
    LISTING_TYPE_ID: listingTypes.HOTELS.LISTING_TYPE_ID,
    NEW_BUILD: true
  })

  return response?.data
})

export const newHomesSlice = createSlice({
  name: 'newHomes',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getNewHomes.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default newHomesSlice.reducer
