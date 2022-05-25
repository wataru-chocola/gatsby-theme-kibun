import React from 'react';
import { useStaticQuery } from 'gatsby';
import { render, screen } from '../../utils/test-utils';

import { SectionNaviList } from './sectionNaviList';

beforeEach(() => {
  const mockGraphQLData = {
    sectionMenu: {
      childrenSectionMenuCategory: [
        {
          category: 'category1',
          menu: [{ text: 'c1-menu1', to: '/c1-menu1' }, { text: 'c1-menu2' }],
        },
        {
          category: 'category2',
          menu: [{ text: 'c2-menu1', to: '/c2-menu1' }, { text: 'c2-menu2' }],
        },
      ],
    },
  };
  (useStaticQuery as jest.Mock).mockImplementation((_query) => {
    return mockGraphQLData;
  });
});

test('should have an appropriate role and label', () => {
  render(<SectionNaviList />);
  expect(screen.getByRole('navigation', { name: 'section navigation' })).toBeInTheDocument();
});

test('should render properly', () => {
  render(<SectionNaviList />);

  // category
  expect(screen.getByText('category1')).toBeInTheDocument();
  expect(screen.getByText('category2')).toBeInTheDocument();

  // menu
  expect(
    screen.getByText((c, e) => /c1-menu1/.test(e?.textContent ?? ''), { selector: 'a' }),
  ).toHaveAttribute('href', '/c1-menu1');
  expect(
    screen.queryByText((c, e) => /c1-menu2/.test(e?.textContent ?? ''), { selector: 'a' }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText((c, e) => /c2-menu1/.test(e?.textContent ?? ''), { selector: 'a' }),
  ).toHaveAttribute('href', '/c2-menu1');
});

test('should render properly with empty menu', () => {
  const mockGraphQLData = {
    sectionMenu: {
      childrenSectionMenuCategory: [
        {
          category: 'category1',
          menu: [],
        },
        {
          category: 'category2',
          menu: [{ text: 'c2-menu1', to: '/c2-menu1' }, { text: 'c2-menu2' }],
        },
      ],
    },
  };
  (useStaticQuery as jest.Mock).mockImplementation((_query) => {
    return mockGraphQLData;
  });
  render(<SectionNaviList />);

  // category
  expect(screen.getByText('category1')).toBeInTheDocument();
  expect(screen.getByText('category2')).toBeInTheDocument();

  // menu
  expect(
    screen.getByText((c, e) => /c2-menu1/.test(e?.textContent ?? ''), { selector: 'a' }),
  ).toHaveAttribute('href', '/c2-menu1');
});
