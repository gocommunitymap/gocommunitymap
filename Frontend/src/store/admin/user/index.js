import { getUserAPI, updateUserAPI, createUserAPI, API_URL, deleteUserAPI, getAgentUserAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getUser = createAsyncThunk(API_URL.GET_USER, async data => {
  const response = await getUserAPI(data)

  return response?.data
})

export const updateUser = createAsyncThunk(API_URL.CREATE_USER, async (data, { dispatch, getState }) => {
  const isUpdate = data?.USER_CODE?.toString()?.length > 0

  const postResponse = await (isUpdate ? updateUserAPI(data) : createUserAPI(data))

  const response = await dispatch(getUser(getState().user.params))

  return postResponse === false ? false : response.payload
})

export const deleteUser = createAsyncThunk(API_URL.DELETE_USER, async (data, { dispatch, getState }) => {
  const postResponse = await deleteUserAPI(data)

  const response = await dispatch(getUser(getState().user.params))

  return postResponse !== undefined && response.payload
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default userSlice.reducer
