import {
  API_URL,
  getProductSetupAPI,
  updateProductSetupAPI,
  createProductSetupAPI,
  deleteProductSetupAPI,
  fileUpload,
  updateFileAPI,
  deleteFileAPI,
  getProductSetupListAPI
} from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { FILE_DIRECTORIES, fetCurrentFullTime } from 'src/@core/utils'

export const getProductSetup = createAsyncThunk(API_URL.GET_PRODUCT_SETUP, async data => {
  const response = await getProductSetupListAPI(data)

  return response?.data
})

export const updateProductSetup = createAsyncThunk(
  API_URL.CREATE_PRODUCT_SETUP,
  async ({ data, files, content_file }, { dispatch, getState }) => {
    const isUpdate = data?.PRODUCT_ID !== null
    let _data = data

    //--------------------File Process--------------------//
    if (files?.length > 0) {
      const links = []
      for (let i = 0; i < files?.length; i++) {
        const fileName = `product_furniture_${i}_${fetCurrentFullTime().toString()}`
        const lastDot = files[i].name.lastIndexOf('.')
        const ext = files[i].name.substring(lastDot + 1)

        const deleteFileName =
          data?.PICTURE_LINKS > 0 &&
          data?.PICTURE_LINKS?.substring(data.PICTURE_LINKS.lastIndexOf('/') + 1, data.PICTURE_LINKS?.length)
        if (deleteFileName?.length > 0) {
          deleteFileAPI({
            dir: FILE_DIRECTORIES.PRODUCT.WITHOUT_PREFIX,
            fileName: deleteFileName
          })
        }

        updateFileAPI({ dir: FILE_DIRECTORIES.PRODUCT.WITHOUT_PREFIX, fileName, file: files[i] })

        const link = `${FILE_DIRECTORIES.PRODUCT.WITH_PREFIX}${fileName}.${ext}`
        links.push({ LINK: link, NAME: fileName, SIZE: files[i]?.size, SORT: i + 1, IS_PRIMARY: i === 0 })
      }

      _data = { ..._data, PICTURE_LINKS: links }
    }

    //--------------------File Process--------------------//
    //--------------------Content File Process--------------------//
    if (content_file?.length > 0) {
      const links = []

      for (let i = 0; i < content_file?.length; i++) {
        const fileName = `content_${i}_${fetCurrentFullTime().toString()}`
        const lastDot = content_file[i].name.lastIndexOf('.')
        const ext = content_file[i].name.substring(lastDot + 1)

        const deleteFileName =
          data?.CONTENT_TYPE_PICTURE_LINKS?.length > 0 &&
          data?.CONTENT_TYPE_PICTURE_LINKS?.substring(
            data.CONTENT_TYPE_PICTURE_LINKS.lastIndexOf('/') + 1,
            data.CONTENT_TYPE_PICTURE_LINKS?.length
          )
        if (deleteFileName) {
          deleteFileAPI({
            dir: FILE_DIRECTORIES.CONTENT.WITHOUT_PREFIX,
            fileName: deleteFileName
          })
        }

        updateFileAPI({ dir: FILE_DIRECTORIES.CONTENT.WITHOUT_PREFIX, fileName, file: content_file[i] })

        const link = `${FILE_DIRECTORIES.CONTENT.WITH_PREFIX}${fileName}.${ext}`
        links.push({ LINK: link, NAME: fileName, SIZE: files[i]?.size, SORT: i + 1, IS_PRIMARY: i === 0 })
      }
      _data = { ..._data, CONTENT_TYPE_PICTURE_LINKS: links }
    }

    //--------------------Content File Process--------------------//

    const postResponse = await (isUpdate ? updateProductSetupAPI(_data) : createProductSetupAPI(_data))

    await dispatch(getProductSetup(getState().ProductSetup.params))

    return postResponse !== undefined && postResponse.data
  }
)

export const deleteProductSetup = createAsyncThunk(
  API_URL.DELETE_PRODUCT_SETUP,
  async (data, { dispatch, getState }) => {
    const PICTURE_LINKS_DATA = data.PICTURE_LINKS?.length > 0 ? JSON.parse(data.PICTURE_LINKS) : []
    for (let i = 0; i < PICTURE_LINKS_DATA?.length; i++) {
      const deleteFileName =
        PICTURE_LINKS_DATA[i]?.LINK?.length > 0 &&
        PICTURE_LINKS_DATA[i]?.LINK?.substring(
          PICTURE_LINKS_DATA[i]?.LINK.lastIndexOf('/') + 1,
          PICTURE_LINKS_DATA[i]?.LINK?.length
        )
      if (deleteFileName) {
        deleteFileAPI({
          dir: FILE_DIRECTORIES.PRODUCT.WITHOUT_PREFIX,
          fileName: deleteFileName
        })
      }
    }

    const CONTENT_TYPE_DATA =
      data.CONTENT_TYPE_PICTURE_LINKS?.length > 0 ? JSON.parse(data.CONTENT_TYPE_PICTURE_LINKS) : []
    for (let i = 0; i < CONTENT_TYPE_DATA?.length; i++) {
      const deleteFileName =
        CONTENT_TYPE_DATA[i].LINK?.length > 0 &&
        CONTENT_TYPE_DATA[i]?.LINK.substring(
          CONTENT_TYPE_DATA[i]?.LINK.lastIndexOf('/') + 1,
          CONTENT_TYPE_DATA[i]?.LINK?.length
        )
      if (deleteFileName) {
        deleteFileAPI({
          dir: FILE_DIRECTORIES.CONTENT.WITHOUT_PREFIX,
          fileName: deleteFileName
        })
      }
    }

    const postResponse = await deleteProductSetupAPI(data)

    const response = await dispatch(getProductSetup(getState().ProductSetup.params))

    return postResponse !== undefined && response.payload
  }
)

export const ProductSetupSlice = createSlice({
  name: 'ProductSetup',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProductSetup.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default ProductSetupSlice.reducer
