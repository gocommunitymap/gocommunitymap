import {
  API_URL,
  getGlobalParametersAPI,
  createGlobalParametersAPI,
  deleteGlobalParametersAPI,
  updateGlobalParametersAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

const TYPE_CODE = GLOBAL_PARAMETER_TYPES.NEARBY_ICON
const ALLOWED = true

export const getNearbyIcon = createAsyncThunk(`${API_URL.GET_GLOBAL_PARAMETERS}/nearbyIcon`, async data => {
  const response = await getGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

  return response?.data
})

export const updateNearbyIcon = createAsyncThunk(
  `${API_URL.CREATE_GLOBAL_PARAMETERS}/nearbyIcon`,
  async (data, { dispatch, getState }) => {
    const isUpdate = data?.ID !== null
    const _data = { ...data, TYPE_CODE, ALLOWED }
    const postResponse = await (isUpdate ? updateGlobalParametersAPI(_data) : createGlobalParametersAPI(_data))

    const response = await dispatch(getNearbyIcon(getState().nearbyIcon.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteNearbyIcon = createAsyncThunk(
  `${API_URL.DELETE_GLOBAL_PARAMETERS}/nearbyIcon`,
  async (data, { dispatch, getState }) => {
    const postResponse = await deleteGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

    const response = await dispatch(getNearbyIcon(getState().nearbyIcon.params))

    return postResponse !== undefined && response.payload
  }
)

export const nearbyIconSlice = createSlice({
  name: 'nearbyIcon',
  initialState: { data: [], total: 1, params: {}, allData: [] },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getNearbyIcon.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default nearbyIconSlice.reducer
