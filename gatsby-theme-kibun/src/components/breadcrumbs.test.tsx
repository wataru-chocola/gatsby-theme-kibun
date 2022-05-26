import React from 'react';
import { render, screen } from '../utils/test-utils';

import PathBreadcrumbs from './breadcrumbs';

test('should render in success', () => {
  render(
    <PathBreadcrumbs
      crumbs={[{ path: '/aaa', title: 'AAA' }, { path: '/bbb' }, { path: '/ccc', title: 'CCC' }]}
    />,
  );
  expect(screen.getByText('AAA')).toHaveAttribute('href', '/aaa');
  expect(screen.getByText('bbb')).toHaveAttribute('href', '/bbb');
  expect(screen.getByText('CCC')).not.toHaveAttribute('href', '/ccc');
});

test('should have an appropriate role and label', () => {
  render(
    <PathBreadcrumbs
      crumbs={[{ path: '/aaa', title: 'AAA' }, { path: '/bbb' }, { path: '/ccc', title: 'CCC' }]}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'path breadcrumb' })).toBeInTheDocument();
});

test('should throw exception with broken input', () => {
  const consoleErrorFn = jest.spyOn(console, 'error').mockImplementation();
  try {
    // @ts-ignore
    expect(() => render(<PathBreadcrumbs crumbs={[{ title: 'AAA' }]} />)).toThrow();
  } finally {
    consoleErrorFn.mockRestore();
  }
});

test('render empty PathBreadcrumbs', () => {
  render(<PathBreadcrumbs crumbs={[]} />);
  expect(
    screen
      .getByRole('navigation', { name: 'path breadcrumb' })
      .getElementsByClassName('MuiBreadcrumbs-ol')[0],
  ).toBeEmptyDOMElement();
});
