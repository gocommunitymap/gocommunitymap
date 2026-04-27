import { Grid, Typography } from '@mui/material'
import { SmallPictureCard } from 'src/@core/components/picture-cards'
import { useTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'

export const FindYourNext = () => {
  const theme = useTheme()

  return (
    <>
      <Typography variant='h4' color={theme.palette.primary.main}>
        Find your next home rental with {themeConfig.templateName}
      </Typography>
      <Grid container spacing={3} pt={3}>
        <Grid item md={4} xs={12}>
          <SmallPictureCard width={60} title='Find your perfect rental property' url='/images/banners/banner-30.jpg' />
          <Typography variant='h6' color={theme.palette.dark}>
            Find your perfect rental property
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            Draw your own search area on a map and use advanced filters for tailored results
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <SmallPictureCard width={60} title='Reassurance when you need it' url='/images/banners/banner-30.jpg' />
          <Typography variant='h6' color={theme.palette.secondary.dark}>
            Reassurance when you need it
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            Learn what to do in every scenario (from boilers to bills) with our expert rental guides.
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <SmallPictureCard width={60} title='Never miss out' url='/images/banners/banner-30.jpg' />
          <Typography variant='h6' color={theme.palette.secondary.dark}>
            Never miss out
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            Get instant property alerts by email or our app when a new property rental hits the market.{' '}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}
