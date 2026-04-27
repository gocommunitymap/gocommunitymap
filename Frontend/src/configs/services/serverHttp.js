/**
 * Server-side HTTP client — safe to use inside getServerSideProps.
 * Does NOT import `window`, `localStorage`, or any browser-only APIs.
 * Requires NEXT_PUBLIC_BASEURL to be an absolute URL (e.g. https://api.example.com).
 */
import axios from 'axios'
import https from 'https'

// const serverBaseURL = process.env.NEXT_PUBLIC_BASEURL || ''

// const allowSelfSignedLocalCert =
//   process.env.NODE_ENV !== 'production' && /^https:\/\/(localhost|127\.0\.0\.1)/i.test(serverBaseURL)

// const guestDefaults = { usercode: 0, active: true }

// const localHttpsAgent = allowSelfSignedLocalCert ? new https.Agent({ rejectUnauthorized: false }) : undefined

const serverBaseURL = process.env.NEXT_PUBLIC_BASEURL || ''

const isLocalHttps = /^https:\/\/(localhost|127\.0\.0\.1)/i.test(serverBaseURL)

const allowSelfSignedLocalCert = process.env.ALLOW_SELF_SIGNED_LOCAL_CERT === 'true' && isLocalHttps

const localHttpsAgent = allowSelfSignedLocalCert ? new https.Agent({ rejectUnauthorized: false }) : undefined

const serverAxios = axios.create({
  baseURL: serverBaseURL,
  ...(localHttpsAgent ? { httpsAgent: localHttpsAgent } : {}),
  timeout: 8000
})

const performGet = async (url, params = {}, config = {}) => {
  try {
    const response = await serverAxios.get(url, { params, ...config })

    return response?.data ?? []
  } catch (err) {
    console.error('[serverGet] failed', err)

    return []
  }
}

/**
 * GET request for public (guest) endpoints — no auth token needed.
 * Automatically adds usercode: 0 to match the staticParams convention.
 */
export const serverGet = async (url, params = {}) => {
  return performGet(url, { ...params, ...guestDefaults })
}

export const serverGetRaw = async (url, params = {}) => performGet(url, params)

/**
 * GET request for authenticated endpoints — reads token from SSR cookie.
 */
export const serverGetAuth = async (url, token, params = {}) => {
  try {
    const response = await serverAxios.get(url, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    })

    return response?.data ?? []
  } catch {
    return []
  }
}

/**
 * POST request for authenticated endpoints — sends token in Authorization header.
 */
export const serverPost = async (url, token, data = {}) => {
  try {
    const response = await serverAxios.post(url, data, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response?.data ?? null
  } catch (err) {
    return null
  }
}
