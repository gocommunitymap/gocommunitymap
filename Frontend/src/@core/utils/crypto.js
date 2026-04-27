import AES from 'crypto-js/aes'
import { enc } from 'crypto-js'

const key = process.env.NEXT_PUBLIC_SECRET

const encryptId = str => {
  const cipherText = AES.encrypt(str, key)

  return encodeURIComponent(cipherText.toString())
}

const decryptId = str => {
  const decodedStr = decodeURIComponent(str)

  return AES.decrypt(decodedStr, key)?.toString(enc.Utf8)
}

export const encUserData = data => {
  return encryptId(JSON.stringify(data))
}

export const decUserData = data => {
  return data == null ? null : decryptId(data)
}

export const encParams = data => {
  return encryptId(JSON.stringify(data))
}

export const decParams = data => {
  return JSON.parse(decryptId(data))
}
