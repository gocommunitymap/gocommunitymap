import { Breadcrumbs, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import IconifyIcon from 'src/@core/components/icon'

const BreadCrumbs = ({ list, title }) => {
  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      separator={<IconifyIcon icon='tabler:chevron-right' style={{ fontSize: 14, color: '#98A2B3' }} />}
      sx={{
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center'
        }
      }}
    >
      {list.map((item, index) => (
        <NextLink style={{ textDecoration: 'none' }} key={index} href={item.link}>
          <Link
            sx={{
              fontSize: 12,
              letterSpacing: '.04em',
              textTransform: 'uppercase',
              color: '#667085',
              fontWeight: 600,
              '&:hover': { color: '#344054' }
            }}
          >
            {item.title}
          </Link>
        </NextLink>
      ))}
      <Typography
        sx={{
          fontSize: 12,
          letterSpacing: '.04em',
          textTransform: 'uppercase',
          color: '#0F172A',
          fontWeight: 700
        }}
      >
        {title}
      </Typography>
    </Breadcrumbs>
  )
}

export default BreadCrumbs
