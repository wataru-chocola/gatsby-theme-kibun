import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, TextField, Box, Typography, Button } from '@material-ui/core';
import { Collapse, CircularProgress } from '@material-ui/core';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import Alert from '@material-ui/lab/Alert';

import { useAppDispatch } from '../state/hooks';
import { loginActions } from '../state/loginSlice';

const MyOctokit = Octokit.plugin(restEndpointMethods);

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

  const [inLoginProgress, setInLoginProgress] = React.useState<boolean>(false);
  const [patoken, setPAToken] = React.useState<string>('');
  const [loginDone, setLoginDone] = React.useState<boolean>(false);
  const [loginError, setLoginError] = React.useState<boolean>(false);
  const [loginErrorMsg, setLoginErrorMsg] = React.useState<string>('');

  const objRef = React.useRef<{ timer?: number }>({});
  const dispatch = useAppDispatch();

  const isMenuOpen = Boolean(anchorEl);
  const classes = useStyles();

  const updatePAToken = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPAToken(e.target.value);
    },
    [setPAToken],
  );

  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const timer = objRef.current.timer;
      if (timer != null) {
        clearTimeout(timer);
      }
    };
  }, [objRef]);

  const handleLoginBoxOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLoginBoxClose = () => {
    setAnchorEl(null);
  };

  const clickLoginButton = () => {
    setLoginDone(false);
    setLoginError(false);
    setInLoginProgress(true);

    const octokit = new MyOctokit({ auth: patoken });
    octokit.rest.users
      .getAuthenticated()
      .then((response) => {
        setLoginDone(true);
        objRef.current.timer = window.setTimeout(() => {
          dispatch(loginActions.logIn(patoken));
          setInLoginProgress(false);

          setAnchorEl(null);
        }, 1000);
      })
      .catch((error) => {
        setLoginErrorMsg(error.message);
        setInLoginProgress(false);
        setLoginError(true);
      });
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
            disabled={inLoginProgress}
          >
            Log in to Github
          </Button>
          {inLoginProgress && <CircularProgress className={classes.circularProgress} />}
        </Box>
        <Box py={2}>
          <Collapse in={loginDone}>
            <Alert severity="success">success</Alert>
          </Collapse>
          <Collapse in={loginError}>
            <Alert severity="error">failed: {loginErrorMsg}</Alert>
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
