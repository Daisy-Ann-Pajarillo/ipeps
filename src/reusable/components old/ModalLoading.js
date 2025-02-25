import React from 'react';
import { Modal, Backdrop, CircularProgress } from '@mui/material';

const ModalLoading = (props) => {
  return (
    <Modal
      open={props.isPageSaving}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: 'transparent' },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color='primary' style={{ width: '4rem', height: '4rem' }} />
      </div>
    </Modal>
  );
};

export default ModalLoading;
