// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { getHomeSectionsAPI } from 'src/configs'
import Link from 'next/link'
import { Divider, Zoom } from '@mui/material'

export const SecondSections = ({ data: sections }) => {
  return (
    sections?.length && (
      <>
        <Grid container spacing={3}>
          {sections?.map((data, index) => (
            <Grid key={index} item xs={12} display='flex' justifyContent='center'>
              <Card color='primary' sx={{ width: '100%', border: 0, boxShadow: 0 }}>
                <CardContent>
                  <Grid container>
                    <Grid item md={6} xs={12}>
                      <br></br>
                      <br></br>
                      <Typography mb={10} variant='h4'>
                        {data.SECTION_TITLE}
                      </Typography>
                      <Typography mb={10}>{data.DESCRIPTION}</Typography>
                      <Link key={index} href={data.MORE_BUTTON_LINK} style={{ textDecoration: 'none' }}>
                        <Button color='primary' variant='contained'>
                          {data.MORE_BUTTON_TEXT}
                        </Button>
                      </Link>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                      display='flex'
                      alignItems='center'
                      justifyContent={{ xs: 'center', md: 'end' }}
                      mt={{ xs: 3, md: 0 }}
                    >
                      <img width={400} height={325} src={data.PICTURE_LINK} alt='' />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </>
    )
  )
}
