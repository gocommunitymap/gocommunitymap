import {
  API_URL,
  getGlobalParametersAPI,
  createGlobalParametersAPI,
  deleteGlobalParametersAPI,
  updateGlobalParametersAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

const TYPE_CODE = GLOBAL_PARAMETER_TYPES.HOUSE_RULES
const ALLOWED = true

export const getHouseRule = createAsyncThunk(`${API_URL.GET_GLOBAL_PARAMETERS}/houseRule`, async data => {
  const response = await getGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

  return response?.data
})

export const updateHouseRule = createAsyncThunk(
  `${API_URL.CREATE_GLOBAL_PARAMETERS}/houseRule`,
  async (data, { dispatch, getState }) => {
    const isUpdate = data?.ID !== null
    const _data = { ...data, TYPE_CODE, ALLOWED }
    const postResponse = await (isUpdate ? updateGlobalParametersAPI(_data) : createGlobalParametersAPI(_data))

    const response = await dispatch(getHouseRule(getState().houseRule.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteHouseRule = createAsyncThunk(
  `${API_URL.DELETE_GLOBAL_PARAMETERS}/houseRule`,
  async (data, { dispatch, getState }) => {
    const postResponse = await deleteGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

    const response = await dispatch(getHouseRule(getState().houseRule.params))

    return postResponse !== undefined && response.payload
  }
)

export const houseRuleSlice = createSlice({
  name: 'houseRule',
  initialState: { data: [], total: 1, params: {}, allData: [] },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getHouseRule.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default houseRuleSlice.reducer
