import { Card } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { themeConfig } from 'src/configs/themeConfig'

export const SmallPictureCard = props => {
  const { style, width = 30, url, title } = props
  const { replace } = useRouter()

  return (
    <Box {...props} sx={{ cursor: 'pointer', backgroundClip: 'white', borderRadius: 10 }}>
      <img src={url} width={width} style={{ ...style, borderRadius: 10 }} title={title} alt={title} />
    </Box>
  )
}
