import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sleepAsync } from '../utils/sleepAsync';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

const MyOctokit = Octokit.plugin(restEndpointMethods);

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

const actionLoginSucceeded = 'github/login/succeeded';

const login = createAsyncThunk('github/login', async (token: string, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const octokit = new MyOctokit({ auth: token });

  await octokit.rest.users.getAuthenticated();
  dispatch({ type: actionLoginSucceeded });
  await sleepAsync(1000);
  return token;
});

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
    [actionLoginSucceeded]: (state, _action) => {
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
export const loginActions = Object.assign({}, loginSlice.actions, { login });
