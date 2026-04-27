import {
  API_URL,
  getUsingAndPlanningAPI,
  createUsingAndPlanningAPI,
  deleteUsingAndPlanningAPI,
  updateUsingAndPlanningAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getUsingPlanning = createAsyncThunk(API_URL.GET_USING_AND_PLANNING, async data => {
  const response = await getUsingAndPlanningAPI(data)

  return response?.data
})

export const updateUsingPlanning = createAsyncThunk(
  API_URL.CREATE_USING_AND_PLANNING,
  async (data, { dispatch, getState }) => {
    const isUpdate = data?.UAP_ID !== null
    const postResponse = await (isUpdate ? updateUsingAndPlanningAPI(data) : createUsingAndPlanningAPI(data))

    const response = await dispatch(getUsingPlanning(getState().usingPlanning.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteUsingPlanning = createAsyncThunk(
  API_URL.DELETE_USING_AND_PLANNING,
  async (data, { dispatch, getState }) => {
    const postResponse = await deleteUsingAndPlanningAPI(data)

    const response = await dispatch(getUsingPlanning(getState().usingPlanning.params))

    return postResponse !== undefined && response.payload
  }
)

export const usingPlanningSlice = createSlice({
  name: 'usingPlanning',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsingPlanning.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default usingPlanningSlice.reducer
