import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ModalPageSaved = (props) => {
  return (
    <Modal
      open={props.pageFinishedSaving}
      onClose={() => {
        props.setIsPageSaving(false);
        props.setPageFinishedSaving(false);
        if (props.setRedirectPage) {
          props.setRedirectPage(true);
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {props.modalTitleMessage}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {props.modalBodyMessage}
        </Typography>
        <Button onClick={() => {
          props.setIsPageSaving(false);
          props.setPageFinishedSaving(false);
          if (props.setRedirectPage) {
            props.setRedirectPage(true);
          }
        }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ModalPageSaved;
