import React from 'react';
import { Snackbar } from '@mui/material';

import { shallowEqual } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { snackMessageActions } from '../../state/snackMessageSlice';
import { selectSnackMessage } from '../../state/snackMessageSelector';
import Alert from '@mui/material/Alert';

export const SnackMessage: React.VFC<Record<string, never>> = () => {
  const msg = useAppSelector((state) => selectSnackMessage(state), shallowEqual);
  const dispatch = useAppDispatch();
  const handleClose = (_event: React.SyntheticEvent | React.MouseEvent, _reason?: string) => {
    dispatch(snackMessageActions.removeMessage({}));
  };

  return msg != null ? (
    <Snackbar
      open={msg.on}
      onClose={handleClose}
      autoHideDuration={msg.autoHideDuration}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Alert variant="filled" severity={msg.severity} sx={{ width: { xs: 300, md: 400 } }}>
        {msg.message}
      </Alert>
    </Snackbar>
  ) : null;
};
SnackMessage.displayName = 'SnackMessage';
