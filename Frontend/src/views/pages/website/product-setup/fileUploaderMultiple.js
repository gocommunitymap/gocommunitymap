// ** React Imports
import { Fragment, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { Avatar, Grid, useTheme } from '@mui/material'

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

const FileUploaderMultiple = ({ files, setFiles, PICTURE_LINKS, setPICTURE_LINKS }) => {
  // ** Hooks
  const theme = useTheme()

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  const renderFilePreview = ({ file, isEdit = false }) => {
    if (file?.type?.startsWith('image') || isEdit) {
      return (
        <Avatar
          variant='rounded'
          sx={{ width: '100%', height: '100%', mr: 3 }}
          src={isEdit ? file.LINK : URL.createObjectURL(file)}
        />
      )
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = (file, isEdit = false) => {
    const uploadedFiles = files
    const filtered = uploadedFiles?.filter(i => i.name !== file.name)
    setPICTURE_LINKS(PICTURE_LINKS?.filter(i => i.NAME !== file.NAME))
    setFiles([...filtered])
  }

  const fileList = files.map(file => {
    return (
      <Grid item xs={12} sm={6} md={4} key={file.name}>
        <div className='file-details' style={{ paddingTop: 5, position: 'relative' }}>
          <div className='file-preview'>{renderFilePreview({ file })}</div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, fontSize: 9 }}>{file.name}</Typography>
            <span style={{ marginLeft: 2, fontSize: 8, color: theme.palette.secondary.dark }}>
              (
              {Math.round(file.size / 100) / 10 > 1000
                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
              )
            </span>
          </Box>
          <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => handleRemoveFile(file)}>
            <Icon
              icon='mdi:close-circle'
              style={{
                backgroundColor: 'white',
                borderRadius: '50%',
                color: theme.palette.error.dark
              }}
              fontSize={20}
            />
          </IconButton>
        </div>
      </Grid>
    )
  })

  const fileListExists = PICTURE_LINKS?.map(file => {
    return (
      <Grid item xs={12} sm={6} md={4} key={file.ID}>
        <div className='file-details' style={{ paddingTop: 5, position: 'relative' }}>
          <div className='file-preview'>{renderFilePreview({ file, isEdit: true })}</div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, fontSize: 9 }}>{file.NAME}</Typography>
            <span style={{ marginLeft: 2, fontSize: 8, color: theme.palette.secondary.dark }}>
              (
              {Math.round(file.SIZE / 100) / 10 > 1000
                ? `${(Math.round(file.SIZE / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file.SIZE / 100) / 10).toFixed(1)} kb`}
              )
            </span>
          </Box>
          <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => handleRemoveFile(file, true)}>
            <Icon
              icon='mdi:close-circle'
              style={{
                backgroundColor: 'white',
                borderRadius: '50%',
                color: theme.palette.error.dark
              }}
              fontSize={20}
            />
          </IconButton>
        </div>
      </Grid>
    )
  })

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <DropzoneWrapper>
      <Fragment>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
              <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography>
              <Typography color='textSecondary' sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}>
                Drop files here or click{' '}
                <Link href='/' onClick={e => e.preventDefault()}>
                  browse
                </Link>{' '}
                through your machine
              </Typography>
            </Box>
          </Box>
        </div>
        {files.length || PICTURE_LINKS?.length ? (
          <Fragment>
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} textAlign='right'>
                <Button variant='outlined' size='small' color='error' onClick={handleRemoveAllFiles}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 1 }}>
                      Clear All Files
                    </Typography>
                    <Icon
                      icon='mdi:close-circle'
                      style={{
                        color: theme.palette.error.dark
                      }}
                      fontSize={18}
                    />
                  </Box>
                </Button>
              </Grid>
              {PICTURE_LINKS?.length > 0 ? fileListExists : fileList}
            </Grid>
          </Fragment>
        ) : null}
      </Fragment>
    </DropzoneWrapper>
  )
}

export default FileUploaderMultiple
