import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Grid2 as Grid,
  Typography
} from '@mui/material';

const ConfirmationDialogUploadCV = (props) => {
  const [showError, setShowError] = useState(false);
  return (
    <Dialog open={props.show} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <div style={{ paddingBottom: 25 }}>
          {props.message}
        </div>
        <InputLabel>Upload your Resume/CV</InputLabel>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <input
              className='custom-file-input'
              id='custom-file-input'
              type='file'
              accept=".pdf, .png, .jpg, .jpeg, .doc, .docm, .docx, .dot, .dotx"
              onChange={(e) => {
                props.setSelectedFile(e.target.files[0]);
                props.setSelectedFileName(e.target.files[0].name);
              }}
            />
            <label className='custom-file-label' htmlFor='custom-file-input'>
              {props.selectedFileName}
            </label>
          </Grid>
        </Grid>
        {showError ? (
          <Grid item xs={12}>
            <Typography color='error'>Please upload your resume file.</Typography>
          </Grid>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={() => {
          if (props.selectedFileName && props.selectedFile) {
            props.onConfirm();
          } else {
            setShowError(true);
          }
        }}>
          Confirm
        </Button>
        <Button color='secondary' onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialogUploadCV;
