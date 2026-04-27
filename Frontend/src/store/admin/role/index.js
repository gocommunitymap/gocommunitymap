import { getRoleAPI, updateRoleAPI, deleteRoleAPI, createRoleAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'
import { getActiveProps } from 'src/@core/utils'

export const getRole = createAsyncThunk(API_URL.GET_ROLE, async data => {
  const response = await getRoleAPI(data)

  const _response = response.data.reduce((prev, curr) => {
    const rowPrev = prev.filter(a => a.role_code === curr.role_code)

    if (rowPrev.length > 0 && rowPrev[0].role_code === curr.role_code) {
      rowPrev[0].detail = [
        ...rowPrev[0].detail,
        { form_id: curr.form_id, form_name: curr.form_name, permissions: curr.permissions, parent_id: curr.parent_id }
      ]
    } else {
      prev = [
        ...prev,
        {
          role_code: curr.role_code,
          role_name: curr.role_name,
          active: curr.active,
          activeLabel: getActiveProps(curr.active).label,
          created_on: curr.created_on,
          detail: [
            {
              form_id: curr.form_id,
              form_name: curr.form_name,
              permissions: curr.permissions,
              parent_id: curr.parent_id
            }
          ]
        }
      ]
    }

    return prev
  }, [])

  return _response
})

export const updateRole = createAsyncThunk(API_URL.CREATE_ROLE, async (data, { dispatch, getState }) => {
  const isUpdate = data?.role_code?.toString()?.length > 0

  const postResponse = await (isUpdate ? updateRoleAPI(data) : createRoleAPI(data))

  const response = await dispatch(getRole(getState().user.params))

  return postResponse === false ? false : response.payload
})

export const deleteRole = createAsyncThunk(API_URL.DELETE_ROLE, async (data, { dispatch, getState }) => {
  const params = { role_code: data.role_code, api_type: 'D' }

  const postResponse = await deleteRoleAPI(params)

  const response = await dispatch(getRole(getState().role.params))

  return postResponse !== undefined && response.payload
})

export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getRole.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload
    })
  }
})

export default roleSlice.reducer
