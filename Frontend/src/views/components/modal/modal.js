import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'

export const Modal = ({ isOpen, children, title, onClose, modelMaxWidth = 500, height = 'auto' }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby='user-view-edit'
      aria-describedby='user-view-edit-description'
      sx={{ '& .MuiPaper-root': { width: '100%', height, maxWidth: modelMaxWidth } }}
    >
      <DialogTitle
        id='user-view-edit'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(5)} !important`],
          pt: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(5)} !important`]
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
