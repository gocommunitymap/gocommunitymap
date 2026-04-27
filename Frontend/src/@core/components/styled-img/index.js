import { styled } from '@mui/material/styles'

export const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: '100%',
  position: 'absolute',
  zIndex: -1,
  height: '100%'
}))
