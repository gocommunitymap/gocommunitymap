import {
  API_URL,
  getSectionsAPI,
  updateSectionApi,
  createSectionsAPI,
  deleteSectionsAPI,
  updateSectionsAPI,
  updateFileAPI,
  deleteFileAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { FILE_DIRECTORIES, fetCurrentFullTime } from 'src/@core/utils'

export const getSections = createAsyncThunk(API_URL.GET_SECTIONS, async data => {
  const response = await getSectionsAPI(data)

  return response?.data
})

export const updateSections = createAsyncThunk(
  API_URL.CREATE_SECTIONS,
  async ({ data, file }, { dispatch, getState }) => {
    let _data = data

    const isUpdate = data?.SECTION_ID !== null

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
        dir: FILE_DIRECTORIES.SECTIONS.WITHOUT_PREFIX,
        fileName: deleteFileName
      })

      updateFileAPI({ dir: FILE_DIRECTORIES.SECTIONS.WITHOUT_PREFIX, fileName, file })

      const link = `${FILE_DIRECTORIES.SECTIONS.WITH_PREFIX}${fileName}.${ext}`
      _data = { ..._data, PICTURE_LINK: link }
    }

    _data = { ..._data, TYPE: 3 }

    const postResponse = await (isUpdate ? updateSectionsAPI(_data) : createSectionsAPI(_data))

    const response = await dispatch(getSections(getState().sections.params))

    return postResponse !== undefined && response.payload
  }
)

export const deleteSections = createAsyncThunk(API_URL.DELETE_SECTIONS, async (data, { dispatch, getState }) => {
  const deleteFileName = data.PICTURE_LINK.substring(data.PICTURE_LINK.lastIndexOf('/') + 1, data.PICTURE_LINK?.length)
  deleteFileAPI({
    dir: FILE_DIRECTORIES.SECTIONS.WITHOUT_PREFIX,
    fileName: deleteFileName
  })

  const postResponse = await deleteSectionsAPI(data)

  const response = await dispatch(getSections(getState().sections.params))

  return postResponse !== undefined && response.payload
})

export const sectionsSlice = createSlice({
  name: 'sections',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSections.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default sectionsSlice.reducer
