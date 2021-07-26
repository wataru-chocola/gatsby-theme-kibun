import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type loginState =
  | {
      isLoggedIn: true;
      token: string;
    }
  | {
      isLoggedIn: false;
    };

const loginSlice = createSlice({
  name: 'login',
  initialState: { isLoggedIn: false } as loginState,
  reducers: {
    logIn(state, action: PayloadAction<string>) {
      return { isLoggedIn: true, token: action.payload };
    },
    logOut(state, action) {
      return { isLoggedIn: false };
    },
  },
});

export const loginReducer = loginSlice.reducer;
export const loginActions = loginSlice.actions;
