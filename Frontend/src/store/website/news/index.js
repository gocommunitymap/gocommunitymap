import {
  API_URL,
  getNewsAPI,
  updateNewsAPI,
  createNewsAPI,
  deleteNewsAPI,
  fileUpload,
  updateFileAPI,
  deleteFileAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { FILE_DIRECTORIES, fetCurrentFullTime } from 'src/@core/utils'

export const getNews = createAsyncThunk(API_URL.GET_NEWS, async data => {
  const response = await getNewsAPI(data)

  return response?.data
})

export const updateNews = createAsyncThunk(API_URL.CREATE_NEWS, async ({ data, file }, { dispatch, getState }) => {
  let _data = data
  const isUpdate = data?.NEWS_ID !== null

  // File Process //
  if (file) {
    const fileName = fetCurrentFullTime()
    const lastDot = file.name.lastIndexOf('.')
    const ext = file.name.substring(lastDot + 1)

    const deleteFileName = data.PICTURE_LINK.substring(
      data.PICTURE_LINK.lastIndexOf('/') + 1,
      data.PICTURE_LINK?.length
    )
    deleteFileAPI({
      dir: FILE_DIRECTORIES.NEWS.WITHOUT_PREFIX,
      fileName: deleteFileName
    })

    updateFileAPI({ dir: FILE_DIRECTORIES.NEWS.WITHOUT_PREFIX, fileName, file })

    const link = `${FILE_DIRECTORIES.NEWS.WITH_PREFIX}${fileName}.${ext}`
    _data = { ...data, PICTURE_LINK: link }
  }

  // File Process //

  const postResponse = await (isUpdate ? updateNewsAPI(_data) : createNewsAPI(_data))

  const response = await dispatch(getNews(getState().news.params))

  return postResponse !== undefined && response.payload
})

export const deleteNews = createAsyncThunk(API_URL.DELETE_NEWS, async (data, { dispatch, getState }) => {
  const deleteFileName = data.PICTURE_LINK.substring(data.PICTURE_LINK.lastIndexOf('/') + 1, data.PICTURE_LINK?.length)
  deleteFileAPI({
    dir: FILE_DIRECTORIES.NEWS.WITHOUT_PREFIX,
    fileName: deleteFileName
  })

  const postResponse = await deleteNewsAPI(data)

  const response = await dispatch(getNews(getState().news.params))

  return postResponse !== undefined && response.payload
})

export const newsSlice = createSlice({
  name: 'news',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getNews.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default newsSlice.reducer
