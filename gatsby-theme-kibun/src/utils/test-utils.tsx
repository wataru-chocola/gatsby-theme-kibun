import React from 'react';
import {
  render,
  RenderOptions,
  queries,
  buildQueries,
  GetAllBy,
  GetErrorFunction,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { storeReducers } from '../state/store';
import type { RootState } from '../state/store';
import wrapWithThemeProvider from '../theme';

// custom queries
type QueryAllByClassNameArgs = [className: string];
const queryAllByClassName: GetAllBy<QueryAllByClassNameArgs> = (container, className) =>
  Array.from(container.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>);

const getMultipleError: GetErrorFunction<QueryAllByClassNameArgs> = (_c, value) =>
  `Found multiple elements with the className attribute of: ${value}`;
const getMissingError: GetErrorFunction<QueryAllByClassNameArgs> = (_c, value) =>
  `Unable to find an element with the className attribute of: ${value}`;

const [queryByClassName, getAllByClassName, getByClassName, findAllByClassName, findByClassName] =
  buildQueries(queryAllByClassName, getMultipleError, getMissingError);

const customQueries = {
  queryByClassName,
  getAllByClassName,
  getByClassName,
  findAllByClassName,
  findByClassName,
};
export { queryByClassName, getAllByClassName, getByClassName, findAllByClassName, findByClassName };

type customRenderOptions = {
  preloadedState?: RootState;
  store?: any;
} & Omit<RenderOptions, 'wrapper' | 'queries'>;

const customRender: (
  ui: React.ReactElement,
  options?: customRenderOptions,
) => ReturnType<typeof render> = (ui, options) => {
  const {
    preloadedState,
    store = configureStore({ reducer: storeReducers, preloadedState }),
    ...renderOptions
  } = options ?? ({} as customRenderOptions);

  return render(ui, {
    queries: { ...queries, ...customQueries },
    wrapper: ({ children }) => wrapWithThemeProvider(<Provider store={store}>{children}</Provider>),
    ...renderOptions,
  });
};

export * from '@testing-library/react';
export { customRender as render };
