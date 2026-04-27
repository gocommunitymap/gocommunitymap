import { Grid, Typography } from '@mui/material'
import { SmallPictureCard } from 'src/@core/components/picture-cards'
import { useTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import { Box } from '@mui/system'

export const QuestionsAboutNewBuild = () => {
  const theme = useTheme()

  return (
    <Box mt={3}>
      <Typography variant='h4' color={theme.palette.primary.main}>
        We answer your questions about new-build homes
      </Typography>
      <Grid container spacing={6} pt={6}>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What is a new-build home?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            A new-build home is a property that has been newly constructed and hasn’t ever been lived in before.
            Everything in the home, including fixtures, fittings and appliances is brand new.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Sometimes, if a property has been completely renovated to the point where almost everything is new, it can
            also count as a new-build home.
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            Is buying a new build a good investment?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Buying a new-build home can save you money in the long term for the following reasons:
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            <ul>
              <li style={{ paddingBottom: 10 }}>They come with 10 year warranties</li>
              <li style={{ paddingBottom: 10 }}>They often have EPC ratings of A or B</li>
              <li style={{ paddingBottom: 10 }}>They can save you money with day-to-day running costs</li>
            </ul>
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What schemes are available for buying a new build?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            <ul>
              <li style={{ paddingBottom: 10 }}>
                Shared Ownership lets you buy a portion of a property, meaning you only need to save up the deposit.
              </li>
              <li style={{ paddingBottom: 10 }}>
                Deposit Unlock and the Mortgage Guarantee Scheme enables you to buy a new-build home with just a 5%
                deposit.
              </li>
              <li style={{ paddingBottom: 10 }}>
                First Homes helps local first-time buyers and key workers by offering new-build homes at a 30% - 50%
                discount.
              </li>
            </ul>
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What is the average cost of new-build homes?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            The average price of a new-build home in the UK for 2023 is $389,659, according to the Land Registry. This
            price varies depending on where you are buying in the country.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            The average price for a new-build home in London is $634,100. That's around twice the national average.
            Whereas a new-build home in the North West is $297,100 and $461,800 in the South East.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
