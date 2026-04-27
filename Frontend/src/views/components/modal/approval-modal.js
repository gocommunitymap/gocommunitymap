import { LoadingButton } from '@mui/lab'
import { Alert, Button, Grid } from '@mui/material'
import { Modal } from 'src/views/components'

const ApprovalModal = ({
  onsubmit,
  onApproval,
  onCancel,
  handleDiscard,
  title,
  isSubmit,
  isOpenModal,
  children,
  isUnApproved = false
}) => {
  return (
    <Modal
      onsubmit={onsubmit}
      onClose={handleDiscard}
      isOpen={isOpenModal}
      title={`${isUnApproved ? 'Unapproved' : 'Approval'} ${title}`}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Alert severity='warning'>Are you sure, you want to {isUnApproved ? 'Unapproved' : 'Approved'} ?</Alert>
          {children}
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
          <LoadingButton
            loading={isSubmit}
            size='large'
            sx={{ mr: 2 }}
            variant='contained'
            color='secondary'
            onClick={onApproval}
          >
            {isUnApproved ? 'Unapproved' : 'Approved'}
          </LoadingButton>
          <Button type='reset' size='large' color='secondary' variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ApprovalModal
