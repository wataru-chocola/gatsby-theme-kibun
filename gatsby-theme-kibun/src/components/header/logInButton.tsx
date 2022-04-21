import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Button,
  DialogActions,
} from '@mui/material';
import { Collapse, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { loginActions } from '../../state/loginSlice';
import { githubAPIActions } from '../../state/githubAPISlice';
import { selectLoginState, selectLoginError } from '../../state/loginSelector';

export const LogInButton = React.forwardRef<HTMLButtonElement>((_props, ref) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [patoken, setPAToken] = React.useState<string>('');
  const loginState = useAppSelector((state) => selectLoginState(state));
  const loginError = useAppSelector((state) => selectLoginError(state));
  const dispatch = useAppDispatch();

  const updatePAToken = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPAToken(e.target.value);
    },
    [setPAToken],
  );

  const handleLoginBoxOpen = (_event: React.MouseEvent<HTMLElement>) => {
    dispatch(loginActions.clearState({}));
    setFormOpen(true);
  };
  const handleLoginBoxClose = () => {
    setFormOpen(false);
  };

  const clickLoginButton = () => {
    dispatch(githubAPIActions.login(patoken));
  };

  const loginForm = (
    <Dialog
      id="account-login-form"
      open={formOpen}
      onClose={handleLoginBoxClose}
      fullWidth={true}
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Sign in to GitHub</DialogTitle>
      <DialogContent>
        <TextField
          required
          id="input-password"
          label="personal access token"
          variant="outlined"
          type="password"
          autoComplete="current-password"
          sx={{
            display: 'block',
            marginTop: 2,
            marginBottom: 2,
          }}
          onChange={updatePAToken}
          fullWidth={true}
        />

        <Collapse in={loginState === 'succeeded'}>
          <Alert severity="success" sx={{ paddingY: 1 }}>
            success
          </Alert>
        </Collapse>
        <Collapse in={loginState === 'failed'}>
          <Alert severity="error" sx={{ paddingY: 1 }}>
            failed: {loginError}
          </Alert>
        </Collapse>
      </DialogContent>
      <DialogActions sx={{ marginBottom: 2, marginX: 2 }}>
        <Box sx={{ display: 'flex', position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginLeft: 'auto', display: 'block' }}
            onClick={clickLoginButton}
            disabled={loginState === 'progress' || loginState === 'succeeded'}
          >
            Log in to Github
          </Button>
          {(loginState === 'progress' || loginState === 'succeeded') && (
            <CircularProgress
              sx={{
                position: 'absolute',
                top: '30%',
                left: '75%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );

  return (
    <React.Fragment>
      <Button
        aria-label="open login form"
        aria-controls="account-login-form"
        aria-haspopup="true"
        onClick={handleLoginBoxOpen}
        ref={ref}
        variant="outlined"
        sx={{
          transition: (theme) =>
            theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.standard,
            }),
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white',
          },
        }}
      >
        Login
      </Button>
      {loginForm}
    </React.Fragment>
  );
});
LogInButton.displayName = 'SignInButton';
