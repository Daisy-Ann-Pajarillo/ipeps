import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalPageSaved2 = (props) => {
  return (
    <Modal
      open={props.pageFinishedSaving}
      onClose={() => props.onClose()}
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{props.modalTitleMessage}</Typography>
          <IconButton onClick={() => props.onClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ mt: 2 }}>{props.modalBodyMessage}</Typography>
      </Box>
    </Modal>
  );
};

export default ModalPageSaved2;
