import {
  API_URL,
  getGlobalParametersAPI,
  createGlobalParametersAPI,
  deleteGlobalParametersAPI,
  updateGlobalParametersAPI,
  listingTypes
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GLOBAL_PARAMETER_TYPES } from 'src/@core/utils'

const TYPE_CODE = GLOBAL_PARAMETER_TYPES.PROPERTY_TYPE
const ALLOWED = true

export const getPropertyTypes = createAsyncThunk(API_URL.GET_GLOBAL_PARAMETERS, async data => {
  const response = await getGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

  const _response = response?.data?.map(item => ({
    ...item,
    LISTING_TYPE:
      Object.values(listingTypes).find(listing => listing.LISTING_TYPE_ID == item.PARAMETER_CODE_4)?.LABEL || ''
  }))

  return _response || []
})

export const updatePropertyTypes = createAsyncThunk(
  API_URL.CREATE_GLOBAL_PARAMETERS,
  async (data, { dispatch, getState }) => {
    const isUpdate = data?.ID !== null
    const _data = { ...data, TYPE_CODE, ALLOWED }
    const postResponse = await (isUpdate ? updateGlobalParametersAPI(_data) : createGlobalParametersAPI(_data))

    const response = await dispatch(getPropertyTypes(getState().propertyTypes.params))

    return postResponse !== undefined && response.payload
  }
)

export const deletePropertyTypes = createAsyncThunk(
  API_URL.DELETE_GLOBAL_PARAMETERS,
  async (data, { dispatch, getState }) => {
    const postResponse = await deleteGlobalParametersAPI({ ...data, TYPE_CODE, ALLOWED })

    const response = await dispatch(getPropertyTypes(getState().propertyTypes.params))

    return postResponse !== undefined && response.payload
  }
)

export const propertyTypesSlice = createSlice({
  name: 'propertyTypes',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPropertyTypes.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default propertyTypesSlice.reducer
