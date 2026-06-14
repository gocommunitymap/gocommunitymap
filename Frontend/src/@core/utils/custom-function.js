import createCache from '@emotion/cache'
import { green, red } from '@mui/material/colors'
import { format, differenceInDays, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import { getGlobalParametersAPI, getGlobalParametersByTypeCodesAPI, getGlobalParametersGuestAPI } from 'src/configs'
import { fieldTypeOptions } from './constant'
import IconifyIcon from '../components/icon'
import { jwtDecode } from 'jwt-decode'

const imageTypeList = ['jpg', 'jpeg', 'png', 'gif']

export const createEmotionCache = () => {
  return createCache({ key: 'css' })
}

export const validateFileFormat = (file, type) => {
  const lastDot = file.name.lastIndexOf('.')
  const ext = file.name.substring(lastDot + 1)
  if (type === 'image') {
    const isValid = imageTypeList.find(i => i === ext.toLowerCase())

    return isValid?.length > 0
  }

  return createCache({ key: 'css' })
}

export const getDateRange = (startDate, endDate) => {
  const days = differenceInDays(endDate, startDate)

  return [...Array(days + 1).keys()].map(i => format(addDays(startDate, i), 'MM/dd/yyyy'))
}

export const isAllowed = (permissions, value) => {
  const f = permissions?.find(i => i === value)

  return f === value
}

// ** Returns initials from string
export const getInitials = string => string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

/**
 ** Hex color to RGBA color
 */
export const hexToRGBA = (hexCode, opacity) => {
  let hex = hexCode.replace('#', '')
  if (hex?.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const isFloat = n => {
  return typeof n === 'number' && n % 1 !== 0
}

/**
 ** RGBA color to Hex color with / without opacity
 */
export const rgbaToHex = (rgba, forceRemoveAlpha = false) => {
  return (
    '#' +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => (string?.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
      .join('')
  )
}

export function amountWithComma(n) {
  if (n !== null) {
    return n?.toLocaleString()
  } else {
    return n
  }
}

export function validatePercentage(val) {
  try {
    const allowChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
    const valueArray = val.toString().split('')

    let validateValue = val
    let isValid = false
    for (let i2 = 0; i2 < valueArray?.length; i2++) {
      for (let i1 = 0; i1 < allowChar?.length; i1++) {
        if (allowChar[i1] === valueArray[i2].toString()) {
          isValid = true
          break
        }
      }
      if (!isValid) {
        validateValue = validateValue.replace(valueArray[i2], '')
      }
    }
    const value = validateValue
    if (value < 0) return 0
    else if (value > 100) return 100
    else if (value >= 0 && value <= 100) {
      const valueLength = value?.length - 1
      if (value?.length > 1) {
        const firstValue = value.substring(0, 1)
        const secondValue = value.substring(1, 2)
        if (firstValue === '0' && secondValue !== '.') {
          return value.substring(1, value?.length)
        }
      }
      const dotIndex = value.lastIndexOf('.')
      if (dotIndex) {
        const decimalPlaces = value.substring(dotIndex, valueLength)?.length
        if (decimalPlaces > 2) {
          return value.substring(0, value.toString()?.length - 1)
        } else if (dotIndex === valueLength) {
          return value.replace('..', '.')
        }
      }

      return val
    } else return 0
  } catch {
    return val.substring(0, val.toString()?.length - 1)
  }
}

export const getQueryStringParams = query => {
  return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
    const [key, value] = param.split('=')
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''

    return params
  }, {})
}

export const amountInWords = number => {
  const first = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen '
  ]
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const mad = ['', 'thousand', 'million', 'billion', 'trillion']
  let word = ''

  for (let i = 0; i < mad?.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i))
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word = `${first[Math.floor(tempNumber / Math.pow(1000, i))]}${mad[i]} ${word}`
      } else {
        word = `${tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))]}-${
          first[Math.floor(tempNumber / Math.pow(1000, i)) % 10]
        }${mad[i]} ${word}`
      }
    }

    tempNumber = number % Math.pow(1000, i + 1)
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word = `${first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))]}hundred ${word}`
  }

  return word && `${word} only`
}

export const dateConvert = (data, format = 'dd-mm-yyyy') => {
  const getMonth2Digits = value => {
    const mm = `0${value}`

    return mm.substring(mm?.length - 2, mm?.length)
  }

  if (data) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const today = new Date(data)
    const dd = String(today.getDate()).padStart(2, '0')
    const mmW = monthNames[today.getMonth()] //January is 0!
    const mm = getMonth2Digits(today.getMonth() + 1) //January is 0!
    const yyyy = today.getFullYear()
    if (format === 'dd-mm-yyyy') {
      return `${dd}-${mmW}-${yyyy}`
    } else if (format.toLowerCase() === 'yyyymmdd') {
      return `${yyyy}${mm}${dd}`
    }
  } else {
    return ''
  }
}

export const fetCurrentFullTime = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = today.getMonth() + 1 //January is 0!
  const yyyy = today.getFullYear()
  const hh = today.getHours()
  const mi = today.getMinutes()
  const ss = today.getSeconds()
  const ms = today.getMilliseconds()

  return `${dd}${mm}${yyyy}${hh}${ss}${ms}`
}

export function jsonToQueryString(json) {
  return (
    '?' +
    Object.keys(json)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
      .join('&')
  )
}

export const getValueFromOptions = (options, value) => {
  const option = options.find(object => object.value === value)

  return option === undefined ? '' : option
}

export const escapeRegExp = value => {
  return value?.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export const setRedirectUrl = ({ url, data }) => {
  return `${url}${jsonToQueryString(data)}`
}

export const handleSearch = ({ value, data, setSearchStates }) => {
  const searchRegex = new RegExp(escapeRegExp(value), 'i')

  const filteredRows = data?.filter(row => {
    return Object.keys(row).some(field => {
      // @ts-ignore

      return searchRegex.test(row[field] === null ? '' : row[field].toString())
    })
  })
  if (value?.length) {
    setSearchStates({ filteredData: filteredRows, searchText: value })
  } else {
    setSearchStates({ filteredData: [], searchText: value })
  }
}

export const imageUrl = ({ preFix = '', url = '' }) =>
  `${window.location.origin}/images${preFix?.length > 0 ? `/${preFix}` : ''}/${url}`

export const getActiveProps = value => {
  const label = value ? 'Yes' : 'No'
  const color = value ? green[500] : red[500]
  const backgroundColor = value ? green[100] : red[100]

  const icon = value ? (
    <IconifyIcon style={{ color: green[500] }} icon='tabler:circle-check-filled' />
  ) : (
    <IconifyIcon style={{ color: red[500] }} icon='tabler:circle-x-filled' />
  )

  return { label, color, backgroundColor, icon }
}

export const getGlobalParametersLOV = async TYPE_CODE => {
  const response = await getGlobalParametersGuestAPI({ TYPE_CODE, ALLOWED: true, ACTIVE: true })
  if (response?.error) {
    toast.error(response.error.message)

    return []
  }

  return response?.data?.map(item => ({ value: item.PARAMETER_CODE_3, label: item.PARAMETER_DESCRIPTION_3 }))

  // return []
}

export const getGlobalParametersGroupsLOV = async TYPE_CODES => {
  const response = await getGlobalParametersByTypeCodesAPI({ TYPE_CODES })
  if (response?.error) {
    toast.error(response.error.message)

    return []
  }

  return response?.data?.map(item => ({
    TYPE_CODE: item.TYPE_CODE,
    value: item.PARAMETER_CODE_3,
    label: item.PARAMETER_DESCRIPTION_3,
    extra: item.PARAMETER_DESCRIPTION_4 || null
  }))
}

export const getOptionsByTypeCode = (globalParametersLOVData, typeCode) => {
  return (Array.isArray(globalParametersLOVData) ? globalParametersLOVData : [])
    .filter(item => item.TYPE_CODE === typeCode)
    .map(item => ({ value: item.value, label: item.label, extra: item.extra || null }))
}

//get global parameters LOV With 2 params
export const getGlobalParametersLOV_W2P = async (TYPE_CODE, PARAMETER_CODE_2) => {
  const response = await getGlobalParametersAPI({ TYPE_CODE, PARAMETER_CODE_2, ALLOWED: true, ACTIVE: true })
  if (response?.error) {
    toast.error(response.error.message)

    return []
  }

  return response?.data?.map(item => ({
    PARAMETER_CODE_2: item.PARAMETER_CODE_2,
    PARAMETER_DESCRIPTION_2: item.PARAMETER_DESCRIPTION_2,
    value: item.PARAMETER_CODE_3,
    label: item.PARAMETER_DESCRIPTION_3
  }))
}

// Returns { value, label, extra } — extra maps to PARAMETER_DESCRIPTION_4
// Used for HOTELTYPE (icon name) and CNCLPOLICY (short badge code)
export const getGlobalParametersLOV_Extended = async TYPE_CODE => {
  const response = await getGlobalParametersAPI({ TYPE_CODE, ALLOWED: true, ACTIVE: true })
  if (response?.error) {
    toast.error(response.error.message)

    return []
  }

  return response?.data?.map(item => ({
    value: item.PARAMETER_CODE_3,
    label: item.PARAMETER_DESCRIPTION_3,
    extra: item.PARAMETER_DESCRIPTION_4 || null
  }))
}

export const getFieldTypeOptions = value => {
  const _data = fieldTypeOptions.find(i => i.value == value)

  return _data ?? null
}

export const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const isTokenExpired = token => {
  if (!token) return true

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    return decoded.exp < currentTime
  } catch (e) {
    return true
  }
}

export const getPostCode = place => {
  let postCode = null
  if (place?.address_components?.length > 0) {
    for (var i = 0; i < place.address_components.length; i++) {
      for (var j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] == 'postal_code') {
          postCode = place?.address_components[i]?.long_name
        }
      }
    }
  }

  return postCode
}

export const debounce = (func, delay) => {
  let timeoutId

  return function (...args) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export const setFieldFocus = key => {
  document.querySelector(`[name="${key}"]`)?.focus()
}
