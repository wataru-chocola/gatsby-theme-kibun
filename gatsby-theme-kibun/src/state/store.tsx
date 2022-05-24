import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { loginReducer } from './loginSlice';
import { snackMessageReducer } from './snackMessageSlice';
import { githubAPIReducer } from './githubAPISlice';

export const storeReducers = {
  login: loginReducer,
  snackMessage: snackMessageReducer,
  githubAPI: githubAPIReducer,
};
const createStore = () => {
  return configureStore({
    reducer: storeReducers,
  });
};

const store = createStore();

export const wrapperWithStore: (element: React.ReactElement) => React.ReactElement = (element) => {
  return <Provider store={store}>{element}</Provider>;
};
export const initialState = store.getState();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
