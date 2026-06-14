import {
  API_URL,
  getRoomDetailAPI,
  createRoomDetailAPI,
  updateRoomDetailAPI,
  deleteRoomDetailAPI,
  fileUpload,
  updateFileAPI,
  deleteFileAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { FILE_DIRECTORIES, fetCurrentFullTime } from 'src/@core/utils'

export const getRoomDetail = createAsyncThunk(API_URL.GET_ROOM_DETAIL, async data => {
  const response = await getRoomDetailAPI(data)

  return response?.data
})

export const updateRoomDetail = createAsyncThunk(
  API_URL.CREATE_ROOM_DETAIL,
  async ({ data, files }, { dispatch, getState }) => {
    const isUpdate = data?.ROOM_ID !== null && data?.ROOM_ID !== undefined
    let _data = data

    if (files?.length > 0) {
      const links = []
      for (let i = 0; i < files.length; i++) {
        const fileName = `room_${i}_${fetCurrentFullTime().toString()}`
        const lastDot = files[i].name.lastIndexOf('.')
        const ext = files[i].name.substring(lastDot + 1)

        updateFileAPI({ dir: FILE_DIRECTORIES.PROPERTY.WITHOUT_PREFIX, fileName, file: files[i] })

        links.push({
          LINK: `${FILE_DIRECTORIES.PROPERTY.WITH_PREFIX}${fileName}.${ext}`,
          NAME: fileName,
          SIZE: files[i]?.size,
          SORT: i + 1,
          IS_PRIMARY: i === 0
        })
      }
      _data = { ..._data, ROOM_PICTURE_LINKS: links }
    }

    const postResponse = await (isUpdate ? updateRoomDetailAPI(_data) : createRoomDetailAPI(_data))

    await dispatch(getRoomDetail({ PROPERTY_ID: data.PROPERTY_ID, ...getState().roomDetail.params }))

    return postResponse !== undefined && postResponse.data
  }
)

export const deleteRoomDetail = createAsyncThunk(API_URL.DELETE_ROOM_DETAIL, async (data, { dispatch, getState }) => {
  const postResponse = await deleteRoomDetailAPI(data)

  await dispatch(getRoomDetail({ PROPERTY_ID: data.PROPERTY_ID, ...getState().roomDetail.params }))

  return postResponse !== undefined && postResponse.data
})

export const roomDetailSlice = createSlice({
  name: 'roomDetail',
  initialState: {
    data: [],
    total: 0,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getRoomDetail.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default roomDetailSlice.reducer
