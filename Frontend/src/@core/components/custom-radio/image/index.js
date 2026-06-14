// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import IconifyIcon from '../../icon'
import { Typography } from '@mui/material'

const CustomRadioImg = props => {
  // ** Props
  const { name, data, selected, gridProps, handleChange, color = 'primary' } = props
  const { alt, img, value, title } = data

  const renderComponent = () => {
    return (
      <Grid item {...gridProps} sx={{ height: 60 }}>
        <Box
          onClick={() => handleChange(value)}
          sx={{
            height: '100%',

            display: 'flex',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            alignItems: 'center',

            flexDirection: 'column',
            justifyContent: 'center',
            borderBottom: theme => `2px solid ${theme.palette.divider}`,
            borderRight: theme => `2px solid ${theme.palette.divider}`,

            ...(selected === value
              ? { backgroundColor: `${color}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.mainChannel}, 0.25)` } }),

            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }
          }}
        >
          {/*<IconifyIcon icon='tabler:home' color={selected === value && 'white'} />*/}
          <Typography color={selected === value && 'white'}>{title}</Typography>

          <Radio
            name={name}
            size='small'
            value={value}
            onChange={handleChange}
            checked={selected === value}
            sx={{ zIndex: -1, position: 'absolute', visibility: 'hidden' }}
          />
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}

export default CustomRadioImg
