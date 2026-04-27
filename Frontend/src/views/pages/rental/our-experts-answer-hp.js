import { Grid, Typography } from '@mui/material'
import { SmallPictureCard } from 'src/@core/components/picture-cards'
import { useTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import { Box } from '@mui/system'

export const OurExpertsAnswerHp = () => {
  const theme = useTheme()

  return (
    <Box mt={3}>
      <Typography variant='h4' color={theme.palette.primary.main}>
        Our experts answer your questions
      </Typography>
      <Grid container spacing={6} pt={6}>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            Are UK house prices falling?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Yes, UK house prices are falling slowly as the market continues to get used to higher mortgage rates. The
            average house price in the UK is now $263,600. This is no change compared to a month ago and a fall of -0.5%
            (or $1,200) compared to a year ago.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Read more in our House Price Index: February 2024.
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            Will property prices keep falling in 2024?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            It depends where in the country you live as the trends vary based on the overall affordability of homes and
            the level of house prices in each property market. The rate of falls will continue to slow and house prices
            are likely to broadly track sideways at current levels during 2024.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            What's happening with UK house prices?
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            How do mortgage rates affect house prices?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            When mortgage rates are higher, it makes borrowing money to buy a house more expensive. This reduces demand
            and usually means lower house price growth.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Average mortgage rates are currently between 4% and 5% and are likely to stay at this level for the
            foreseeable. Try our mortgage calculator to see how much you could borrow.
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            Does {themeConfig.templateName} have all sold house prices in the UK?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            We get our sold house prices from HM Land Registry and Registers of Scotland each month, but it can take up
            to 6 months hotelss to appear in our data. They also don't provide some property prices, such as the sale of
            a share or a transfer after a divorce. If we don’t have a sold house price, get an instant valuation
            instead.
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            Why are UK house prices so high?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            The biggest house price growth in recent times came between 2020 and 2022, when low mortgage rates and then
            the pandemic boosted demand from buyers. 12 in 13 homes increased in value by an average of $19,000 in 2022.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            In 2023, this rate of growth slowed down. 3 in 5 homeowners saw their homes hold their value or rise - by
            $7,800 on average.
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What's happening with London property prices?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            London has the most expensive homes in the UK, but the average value of a London home is just 8% higher than
            7 years ago. For the rest of the UK, this figure is 28% higher, showing that London homes are becoming
            better value for money.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            The cheapest places to buy a home in London are Plumstead, Deptford and Thamesmead East.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
