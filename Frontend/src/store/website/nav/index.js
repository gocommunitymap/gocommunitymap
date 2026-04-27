import { API_URL, getNavAPI, updateNavAPI, createNavAPI, deleteNavAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getNav = createAsyncThunk(API_URL.GET_NAV, async data => {
  const response = await getNavAPI({ ...data, TYPE: 3 })

  return response?.data
})

export const updateNav = createAsyncThunk(API_URL.CREATE_NAV, async (data, { dispatch, getState }) => {
  const isUpdate = data?.NAV_ID !== null
  const _data = { ...data, TYPE: 3 }
  const postResponse = await (isUpdate ? updateNavAPI(_data) : createNavAPI(_data))

  const response = await dispatch(getNav(getState().nav.params))

  return postResponse !== undefined && response.payload
})

export const deleteNav = createAsyncThunk(API_URL.DELETE_NAV, async (data, { dispatch, getState }) => {
  const postResponse = await deleteNavAPI(data)

  const response = await dispatch(getNav(getState().nav.params))

  return postResponse !== undefined && response.payload
})

export const navSlice = createSlice({
  name: 'nav',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getNav.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default navSlice.reducer
