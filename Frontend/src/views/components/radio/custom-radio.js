// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CustomRadioImg from 'src/@core/components/custom-radio/image'

const CustomRadioWithImages = ({ setSelected, selected, data }) => {
  // ** State

  const handleChange = prop => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected(prop.target.value)
    }
  }

  return (
    <Grid container spacing={0}>
      {data.map((item, index) => (
        <CustomRadioImg
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-radios-img'
          handleChange={handleChange}
          gridProps={{ xs: 6 }}
        />
      ))}
    </Grid>
  )
}

export default CustomRadioWithImages
