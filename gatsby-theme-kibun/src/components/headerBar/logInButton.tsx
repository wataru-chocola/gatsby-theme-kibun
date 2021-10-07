import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, TextField, Box, Typography, Button } from '@material-ui/core';
import { Collapse, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { loginActions } from '../../state/loginSlice';
import { selectLoginState, selectLoginError } from '../../state/loginSelector';

const useStyles = makeStyles((theme) => ({
  loginTitle: {
    fontWeight: 'bold',
  },
  textField: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonWrapper: {
    display: 'flex',
    position: 'relative',
    marginTop: theme.spacing(3),
  },
  button: {
    marginLeft: 'auto',
    display: 'block',
  },
  circularProgress: {
    position: 'absolute',
    top: '30%',
    left: '75%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export const LogInButton = React.forwardRef<HTMLButtonElement>((_props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [patoken, setPAToken] = React.useState<string>('');
  const loginState = useAppSelector((state) => selectLoginState(state));
  const loginError = useAppSelector((state) => selectLoginError(state));
  const dispatch = useAppDispatch();

  const isMenuOpen = Boolean(anchorEl);
  const classes = useStyles();

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
    dispatch(loginActions.login(patoken));
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
        <Typography variant="subtitle1" className={classes.loginTitle}>
          Sign in to GitHub
        </Typography>

        <TextField
          required
          id="input-password"
          label="personal access token"
          variant="outlined"
          type="password"
          autoComplete="current-password"
          className={classes.textField}
          onChange={updatePAToken}
          fullWidth={true}
        />

        <Box className={classes.buttonWrapper}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={clickLoginButton}
            disabled={loginState === 'progress' || loginState === 'succeeded'}
          >
            Log in to Github
          </Button>
          {(loginState === 'progress' || loginState === 'succeeded') && (
            <CircularProgress className={classes.circularProgress} />
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
        style={{ color: 'white' }}
      >
        Sign in
      </Button>
      {loginForm}
    </React.Fragment>
  );
});
LogInButton.displayName = 'SignInButton';
