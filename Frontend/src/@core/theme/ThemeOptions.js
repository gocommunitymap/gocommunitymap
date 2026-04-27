// ** MUI Theme Provider
import { deepmerge } from '@mui/utils'

// ** User Theme Options
import UserThemeOptions from 'src/layouts/UserThemeOptions'

// ** Theme Override Imports
import palette from './palette'
import spacing from './spacing'
import shadows from './shadows'
import overrides from './overrides'
import typography from './typography'
import breakpoints from './breakpoints'

const isCommaRgb = value => typeof value === 'string' && /^\s*\d+\s*,\s*\d+\s*,\s*\d+\s*$/.test(value)

const normalizeColorValue = value => (isCommaRgb(value) ? `rgb(${value})` : value)

const normalizePaletteColor = colorObject => {
  if (!colorObject || typeof colorObject !== 'object') return colorObject

  return {
    ...colorObject,
    light: normalizeColorValue(colorObject.light),
    main: normalizeColorValue(colorObject.main),
    dark: normalizeColorValue(colorObject.dark)
  }
}

const themeOptions = (settings, overrideMode) => {
  // ** Vars
  const { skin, mode, direction, themeColor } = settings

  // ** Create New object before removing user component overrides and typography objects from userThemeOptions
  const userThemeConfig = Object.assign({}, UserThemeOptions())

  const mergedThemeConfig = deepmerge(
    {
      breakpoints: breakpoints(),
      direction,
      components: overrides(settings),
      palette: palette(mode === 'semi-dark' ? overrideMode : mode, skin),
      ...spacing,
      shape: {
        borderRadius: 10
      },
      mixins: {
        toolbar: {
          minHeight: 64
        }
      },
      shadows: shadows(mode === 'semi-dark' ? overrideMode : mode),
      typography
    },
    userThemeConfig
  )

  const fallbackPrimary = palette(mode === 'semi-dark' ? overrideMode : mode, skin).primary
  const selectedThemeColor = mergedThemeConfig.palette ? mergedThemeConfig.palette[themeColor] : fallbackPrimary

  return deepmerge(mergedThemeConfig, {
    palette: {
      primary: {
        ...normalizePaletteColor(selectedThemeColor || fallbackPrimary)
      }
    }
  })
}

export default themeOptions
