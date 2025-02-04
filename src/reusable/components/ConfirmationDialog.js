import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const ConfirmationDialog = (props) => {
  return (
    <Dialog open={props.show} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.message}</DialogContent>
      <DialogActions>
        <Button color='primary' onClick={props.onConfirm}>
          Confirm
        </Button>
        <Button color='secondary' onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
