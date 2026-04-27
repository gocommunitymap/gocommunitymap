import { CreateAgentValuation, API_URL } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const createForagentvaluation = createAsyncThunk('agentvaluation', async data => {
  const response = await CreateAgentValuation(data)

  return response?.data
})

export const forAgentValuationSlice = createSlice({
  name: 'agentvaluation',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createForagentvaluation.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default forAgentValuationSlice.reducer
