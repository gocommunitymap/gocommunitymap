import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))
