import { decUserData } from 'src/@core/utils'
import { listingTypes } from './constant-data'

export const setURL = url => {
  const splitURL = url.split('?')
  if (splitURL.length > 1) {
    return `${splitURL[0]}?${splitURL[1]}`
  } else {
    return `${url}`
  }
}

let userDetail = null
try {
  userDetail = window !== undefined && decUserData(window.localStorage.getItem('userData'))
} catch (error) {
  userDetail = null
}
userDetail = userDetail && JSON.parse(userDetail)

export const updateParams = params => {
  try {
    const usercode = JSON.parse(decUserData(window.localStorage.getItem('userData'))).usercode

    // return { ...params, USER: usercode }
    return params
  } catch (error) {
    return params
  }
}

export const staticParams = params => {
  return { ...params, usercode: 0 }
}

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos - 1) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export const getListingType = LISTING_TYPE_ID => {
  let data = {}

  const listingType = Object.keys(listingTypes).map(i => {
    if (listingTypes[i].LISTING_TYPE_ID === LISTING_TYPE_ID) {
      data = listingTypes[i]
    }
  })

  return data
}
