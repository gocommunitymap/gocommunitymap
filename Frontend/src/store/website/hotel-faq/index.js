import {
  API_URL,
  getGlobalParametersAPI,
  createGlobalParametersAPI,
  deleteGlobalParametersAPI,
  updateGlobalParametersAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

const TYPE_CODE = GLOBAL_PARAMETER_TYPES.HOTEL_FAQ
const ALLOWED = true

export const getHotelFaq = createAsyncThunk(`${API_URL.GET_GLOBAL_PARAMETERS}/hotelFaq`, async data => {
  const response = await getGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

  return response?.data
})

export const updateHotelFaq = createAsyncThunk(
  `${API_URL.CREATE_GLOBAL_PARAMETERS}/hotelFaq`,
  async (data, { dispatch, getState }) => {
    const isUpdate = data?.ID !== null
    const _data = { ...data, TYPE_CODE, ALLOWED }
    const postResponse = await (isUpdate ? updateGlobalParametersAPI(_data) : createGlobalParametersAPI(_data))

    const response = await dispatch(getHotelFaq(getState().hotelFaq.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteHotelFaq = createAsyncThunk(
  `${API_URL.DELETE_GLOBAL_PARAMETERS}/hotelFaq`,
  async (data, { dispatch, getState }) => {
    const postResponse = await deleteGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

    const response = await dispatch(getHotelFaq(getState().hotelFaq.params))

    return postResponse !== undefined && response.payload
  }
)

export const hotelFaqSlice = createSlice({
  name: 'hotelFaq',
  initialState: { data: [], total: 1, params: {}, allData: [] },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getHotelFaq.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default hotelFaqSlice.reducer
