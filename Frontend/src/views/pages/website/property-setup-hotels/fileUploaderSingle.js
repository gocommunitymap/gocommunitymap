// ** React Imports
import { Fragment, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled, useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { Card } from '@mui/material'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const FileUploaderSingle = ({ file, setFile, CONTENT_TYPE_PICTURE_LINKS, setCONTENT_TYPE_PICTURE_LINKS }) => {
  const theme = useTheme()

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      '*': ['.png', '.jpg', '.jpeg', '.gif', '.xlsx', '.xls', '.txt', '.pdf', '.doc', '.docx', '.ppt', '.pptx']
    },
    onDrop: acceptedFiles => {
      setFile(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  const renderFilePreview = ({ fileType }) => {
    // if (file?.type?.startsWith('image') || isEdit) {
    //   return <Icon icon='tabler:tile-type-png' />
    // } else {
    return <Icon icon={`tabler:file-type-${fileType?.substring(0, 3)}`} />

    // }
  }

  const handleRemoveFile = () => {
    setFile([])
    setCONTENT_TYPE_PICTURE_LINKS('')
  }

  const fileList = file?.map(file => {
    return (
      <ListItem key={file?.name}>
        <Card
          variant='outlined'
          sx={{ p: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box display='flex'>
            {renderFilePreview({
              fileType: file?.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
            })}
            <Typography className='file-name'>{file?.name}</Typography>
            {/* <Typography className='file-size' variant='body2'>
              {Math.round(file?.size / 100) / 10 > 1000
                ? `${(Math.round(file?.size / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file?.size / 100) / 10).toFixed(1)} kb`}
            </Typography> */}
          </Box>
          <IconButton onClick={() => handleRemoveFile(file)}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Card>
      </ListItem>
    )
  })

  const fileListExists = (
    <ListItem key={CONTENT_TYPE_PICTURE_LINKS[0]?.ID}>
      <Card
        variant='outlined'
        sx={{ p: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Link
          href={CONTENT_TYPE_PICTURE_LINKS[0]?.LINK}
          target='_blank'
          style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}
        >
          <Box display='flex'>
            {renderFilePreview({
              fileType: CONTENT_TYPE_PICTURE_LINKS[0]?.LINK.substring(
                CONTENT_TYPE_PICTURE_LINKS[0].LINK.lastIndexOf('.') + 1,
                CONTENT_TYPE_PICTURE_LINKS[0].LINK.length
              )
            })}

            <Typography className='file-name'>{CONTENT_TYPE_PICTURE_LINKS[0]?.NAME}</Typography>
            {/* <Typography className='file-size' variant='body2'>
              {Math.round(file?.size / 100) / 10 > 1000
                ? `${(Math.round(file?.size / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file?.size / 100) / 10).toFixed(1)} kb`}
            </Typography> */}
          </Box>
        </Link>
        <IconButton onClick={() => handleRemoveFile()}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Card>
    </ListItem>
  )

  const handleRemoveAllFiles = () => {
    setFile([])
  }

  return (
    <DropzoneWrapper>
      <Fragment>
        {file?.length || CONTENT_TYPE_PICTURE_LINKS?.length ? (
          <></>
        ) : (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                <HeadingTypography variant='h5'>
                  Drop file here or click to upload.
                  <Typography color='textSecondary' variant='body2' fontSize={12}>
                    .png, .jpg, .jpeg, .gif,.xlsx, .xls, .txt, .pdf, .doc, .docx, .ppt, .pptx
                  </Typography>
                </HeadingTypography>

                <Typography color='textSecondary' sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}>
                  Drop file here or click
                  <Link style={{ margin: 3 }} href='/' onClick={e => e.preventDefault()}>
                    browse
                  </Link>
                  through your machine
                </Typography>
              </Box>
            </Box>
          </div>
        )}

        {file?.length || CONTENT_TYPE_PICTURE_LINKS?.length ? (
          <Fragment>
            <List>{CONTENT_TYPE_PICTURE_LINKS?.length > 0 ? fileListExists : fileList}</List>
          </Fragment>
        ) : null}
      </Fragment>
    </DropzoneWrapper>
  )
}

export default FileUploaderSingle
