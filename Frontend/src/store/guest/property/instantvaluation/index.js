import { CreateValuation, API_URL } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const createForvaluation = createAsyncThunk('instantvaluation', async data => {
  const response = await CreateValuation(data)

  return response?.data
})

export const forInstantValuationSlice = createSlice({
  name: 'instantvaluation',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createForvaluation.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default forInstantValuationSlice.reducer
