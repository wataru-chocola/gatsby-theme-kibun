import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { loginReducer } from './loginSlice';

const createStore = () => {
  return configureStore({
    reducer: {
      login: loginReducer,
    },
  });
};

const store = createStore();

export const wrapperWithStore: (arg: { element: React.ReactElement }) => React.ReactElement = ({
  element,
}) => {
  return <Provider store={store}>{element}</Provider>;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
