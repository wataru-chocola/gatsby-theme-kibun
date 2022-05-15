import { StaticQuery, useStaticQuery } from 'gatsby';
import React from 'react';
import { render, screen } from '../utils/test-utils';

import Page from './page';

beforeEach(() => {
  const mockGraphQLData = {
    site: {
      siteMetadata: {
        title: 'Test Site',
      },
    },
  };
  (StaticQuery as jest.Mock).mockImplementation(({ render }) => render(mockGraphQLData));
  (useStaticQuery as jest.Mock).mockImplementation(() => mockGraphQLData);
});

test('should render in success', () => {
  const markdownData = {
    frontmatter: {
      title: 'test',
    },
    breadcrumbs: [{ slug: '/aaa', title: 'AAA' }, { slug: '/bbb' }, { slug: '/ccc', title: 'CCC' }],
    parent: {
      relativePath: '/hello',
      internal: {
        content: `# Heading 1`,
      },
    },
  };
  const prismAliasMap = {
    aliasesMap: [
      {
        alias: 'bash',
        name: 'sh',
      },
    ],
  };

  const data = {
    markdown: markdownData,
    prismAliasMap,
  };
  // @ts-ignore
  render(<Page data={data} pageContext={{ slug: '/hello' }} />);

  // breadcrumbs
  expect(screen.getByText('AAA')).toHaveAttribute('href', '/aaa');
  expect(screen.getByText('bbb')).toHaveAttribute('href', '/bbb');
  expect(screen.getByText('CCC')).not.toHaveAttribute('href', '/ccc');

  expect(screen.getByRole('navigation', { name: 'table of contents' })).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
});
