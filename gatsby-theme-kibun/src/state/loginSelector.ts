import { RootState } from './store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectIsLoggedIn = (state: RootState) => state.login.isLoggedIn;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectToken = (state: RootState) =>
  state.login.isLoggedIn ? state.login.token : null;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectLoginState = (state: RootState) => state.login.state;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectLoginError = (state: RootState) => state.login.error;
