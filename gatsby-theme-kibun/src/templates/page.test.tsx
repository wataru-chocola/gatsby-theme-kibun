import { StaticQuery, useStaticQuery } from 'gatsby';
import React from 'react';
import { render, screen, waitFor } from '../utils/test-utils';

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

test('should render in success', async () => {
  const markdownData = {
    frontmatter: {
      title: 'test',
    },
    breadcrumbs: [{ slug: '/aaa', title: 'AAA' }, { slug: '/bbb' }, { slug: '/ccc', title: 'CCC' }],
    parent: {
      relativePath: '/hello',
      internal: {
        content: `# Heading 1

Hello, world.

\`\`\`bash
echo 'hello, bash'
\`\`\`

\`\`\`mysh
echo 'hello, mysh'
\`\`\`

\`\`\`unksh
echo 'hello, unksh'
\`\`\`
`,
      },
    },
  };
  const prismAliasMap = {
    aliasesMap: [
      {
        alias: 'mysh',
        name: 'bash',
      },
    ],
  };

  const data = {
    markdown: markdownData,
    prismAliasMap,
  };
  // @ts-ignore
  const { container } = render(<Page data={data} pageContext={{ slug: '/hello' }} />);

  // breadcrumbs
  expect(screen.getByText('AAA')).toHaveAttribute('href', '/aaa');
  expect(screen.getByText('bbb')).toHaveAttribute('href', '/bbb');
  expect(screen.getByText('CCC')).not.toHaveAttribute('href', '/ccc');

  expect(screen.getByRole('navigation', { name: 'table of contents' })).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();

  // prism alias
  await waitFor(() => expect(container.querySelectorAll('pre.language-bash')).toHaveLength(2));
  await waitFor(() => expect(container.querySelectorAll('code.language-bash')).toHaveLength(1));
  await waitFor(() => expect(container.querySelectorAll('code.language-mysh')).toHaveLength(1));
  await waitFor(() => expect(container.querySelectorAll('pre.language-text')).toHaveLength(1));
  await waitFor(() => expect(container.querySelectorAll('code.language-unksh')).toHaveLength(1));
});
