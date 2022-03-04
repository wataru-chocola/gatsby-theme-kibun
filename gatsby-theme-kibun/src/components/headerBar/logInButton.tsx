import React from 'react';
import { Popover, TextField, Box, Typography, Button } from '@mui/material';
import { Collapse, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { loginActions } from '../../state/loginSlice';
import { githubAPIActions } from '../../state/githubAPISlice';
import { selectLoginState, selectLoginError } from '../../state/loginSelector';

export const LogInButton = React.forwardRef<HTMLButtonElement>((_props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [patoken, setPAToken] = React.useState<string>('');
  const loginState = useAppSelector((state) => selectLoginState(state));
  const loginError = useAppSelector((state) => selectLoginError(state));
  const dispatch = useAppDispatch();

  const isMenuOpen = Boolean(anchorEl);

  const updatePAToken = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPAToken(e.target.value);
    },
    [setPAToken],
  );

  const handleLoginBoxOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(loginActions.clearState({}));
    setAnchorEl(event.currentTarget);
  };
  const handleLoginBoxClose = () => {
    setAnchorEl(null);
  };

  const clickLoginButton = () => {
    dispatch(githubAPIActions.login(patoken));
  };

  const loginForm = (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="account-login-form"
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      open={isMenuOpen}
      onClose={handleLoginBoxClose}
    >
      <Box p={3} width={400}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Sign in to GitHub
        </Typography>

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

        <Box sx={{ display: 'flex', position: 'relative', marginTop: 3 }}>
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
        <Box py={2}>
          <Collapse in={loginState === 'succeeded'}>
            <Alert severity="success">success</Alert>
          </Collapse>
          <Collapse in={loginState === 'failed'}>
            <Alert severity="error">failed: {loginError}</Alert>
          </Collapse>
        </Box>
      </Box>
    </Popover>
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
        Sign in
      </Button>
      {loginForm}
    </React.Fragment>
  );
});
LogInButton.displayName = 'SignInButton';
