import React from 'react';
import { Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { shallowEqual } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { snackMessageActions } from '../state/snackMessageSlice';
import { selectSnackMessage } from '../state/snackMessageSelector';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  alert: {
    [theme.breakpoints.up('xs')]: {
      width: 300,
    },
    [theme.breakpoints.up('md')]: {
      width: 400,
    },
  },
}));

export const SnackMessage: React.VFC<Record<string, never>> = () => {
  const msg = useAppSelector((state) => selectSnackMessage(state), shallowEqual);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    dispatch(snackMessageActions.removeMessage({}));
  };

  return msg != null ? (
    <Snackbar
      open={msg.on}
      onClose={handleClose}
      autoHideDuration={msg.autoHideDuration}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Alert className={classes.alert} variant="filled" severity={msg.severity}>
        {msg.message}
      </Alert>
    </Snackbar>
  ) : null;
};
SnackMessage.displayName = 'SnackMessage';
