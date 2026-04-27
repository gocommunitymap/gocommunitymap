// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { getNewsSectionsAPI } from 'src/configs'
import Link from 'next/link'
import { CardHeader, CardMedia, CssBaseline, Divider, Pagination } from '@mui/material'
import { dateConvert } from 'src/@core/utils'
import { Box, useMediaQuery } from '@mui/system'
import { useTheme } from '@mui/material/styles'

export const NewsSections = ({ data: news }) => {
  const [page, setPage] = useState(0)
  const breakpoint = useMediaQuery(theme => theme.breakpoints.down('md'))
  const [rowsPerPage, setRowsPerPage] = useState(3)
  const theme = useTheme()

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1)
  }

  return (
    <Card sx={{ p: 5, border: 0 }} variant='outlined'>
      <Grid container spacing={5}>
        {news?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
          <Grid key={index} item xs={12} md={4}>
            <Link href={`${data.PICTURE_LINK}`} style={{ textDecoration: 'none' }}>
              <Card color='primary' sx={{ height: 500 }}>
                <Box p={3} height={150}>
                  <Typography variant='h6'>{data.NEWS_TITLE}</Typography>
                  <Typography variant='subtitle2'>{dateConvert(data.NEWS_DATE)}</Typography>
                </Box>
                <CardMedia component='img' height='150' image={data.PICTURE_LINK} alt='' />
                <CardContent>
                  <Typography mb={10} variant='body1'>
                    {data.SHORT_DESCRIPTION}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
        <Grid item xs={12} mt={5}>
          <Divider />
          <Box mt={5} display={{ md: 'flex', xs: 'block' }} justifyContent='space-between' alignItems='center'>
            <Pagination
              count={Math.ceil(news?.length / rowsPerPage)}
              onChange={handleChangePage}
              variant='text'
              size='small'
              shape='rounded'
              color='primary'
            />
            <Typography variant='subtitle2' textAlign='right'>
              {page + 1}–{(page + 1) * rowsPerPage} of {news?.length}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}
