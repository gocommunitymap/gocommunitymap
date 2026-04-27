import { Grid, Typography } from '@mui/material'
import { SmallPictureCard } from 'src/@core/components/picture-cards'
import { useTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import { Box } from '@mui/system'

export const OurExpertsAnswer = () => {
  const theme = useTheme()

  return (
    <Box mt={3}>
      <Typography variant='h4' color={theme.palette.primary.main}>
        Our experts answer your questions about renting a home
      </Typography>
      <Grid container spacing={6} pt={6}>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What are the steps rental a property?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            <ol>
              <li style={{ paddingBottom: 10 }}>
                Firstly, you'll need to work out your budget for rent. That also includes the bills you’ll be
                responsible for as a renter.
              </li>
              <li style={{ paddingBottom: 10 }}>
                Be clear on what you're looking for in your next property. Have questions to ask at the viewing; our
                rental viewing checklist will help.
              </li>
              <li style={{ paddingBottom: 10 }}>
                Prepare your documents (such as references and identification) to get ahead of the competition.
              </li>
            </ol>
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What do you need rental a house?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Rental a house you'll need to provide character references from your current landlord and employer. You'll
            also need to prove your income by providing payslips and bank statements.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            The letting agent will run a credit check on you to understand if you can afford to pay the rent and if
            you're likely to pay it on time.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            Learn more about the references and checks rental a home
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            Where are the cheapest places rental?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            The North East is the cheapest region rental a home in the UK. Average rents here are $671 per month.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            Northern Ireland, Scotland and Yorkshire and the Humber all sit at the cheaper end of the scale too, with
            rents averaging less than $800 per month.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark}>
            Find out the cheapest places rental in the UK
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography variant='h5' color={theme.palette.secondary.dark}>
            What is a tenancy agreement?
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            A tenancy agreement or Assured Short hold Tenancy Agreement (AST) is the standard contract for the vast
            majority of rental properties.
          </Typography>
          <Typography variant='subtitle2' color={theme.palette.secondary.dark} mb={2}>
            This type of agreement comes with various protections, including for your rental deposit. Make sure you know
            what to watch out for in your rental agreement before signing it.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
