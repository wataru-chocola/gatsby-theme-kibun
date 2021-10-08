import { createSlice } from '@reduxjs/toolkit';
import { githubAPIActions } from './githubAPISlice';

type loginState = (
  | {
      isLoggedIn: true;
      token: string;
    }
  | {
      isLoggedIn: false;
    }
) & {
  error?: string;
  state: 'pending' | 'progress' | 'succeeded' | 'succeededDone' | 'failed';
};

const login = githubAPIActions.login;
const loginSucceeded = `${login.typePrefix}/login/succeeded`;

const initialState: loginState = { isLoggedIn: false, state: 'pending' };

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState as loginState,
  reducers: {
    clearState(_state, _action) {
      return initialState;
    },
    logOut(_state, _action) {
      return initialState;
    },
  },
  extraReducers: {
    [login.pending.type]: (state, _action) => {
      state.state = 'progress';
    },
    [loginSucceeded]: (state, _action) => {
      state.state = 'succeeded';
    },
    [login.fulfilled.type]: (_state, action) => {
      return { state: 'succeededDone', isLoggedIn: true, token: action.payload };
    },
    [login.rejected.type]: (state, action) => {
      state.state = 'failed';
      state.error = action.error.message;
    },
  },
});

export const loginReducer = loginSlice.reducer;
export const loginActions = loginSlice.actions;
