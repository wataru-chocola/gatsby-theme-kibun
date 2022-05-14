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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper' | 'queries'>,
) =>
  render(ui, {
    queries: { ...queries, ...customQueries },
    wrapper: ({ children }) => wrapWithThemeProvider(children),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
