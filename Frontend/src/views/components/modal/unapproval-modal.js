import { LoadingButton } from '@mui/lab'
import { Alert, Button, Grid } from '@mui/material'
import { Modal } from 'src/views/components'

const UnApprovalModal = ({ onsubmit, onClick, onCancel, handleDiscard, title, isSubmit, isOpenModal, children }) => {
  return (
    <Modal onsubmit={onsubmit} onClose={handleDiscard} isOpen={isOpenModal} title={`Unapproved ${title}`}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Alert severity='error'>Are you sure, you want to Approved?</Alert>
          {children}
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
          <LoadingButton
            loading={isSubmit}
            size='large'
            sx={{ mr: 2 }}
            variant='contained'
            color='error'
            onClick={onClick}
          >
            Unapproved
          </LoadingButton>
          <Button type='reset' size='large' color='secondary' variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default UnApprovalModal
