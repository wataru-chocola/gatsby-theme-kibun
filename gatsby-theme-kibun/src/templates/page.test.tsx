import { useStaticQuery } from 'gatsby';
import React from 'react';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';

import { server } from '../__mocks__/server';

import Page from './page';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

beforeEach(() => {
  const mockGraphQLData = {
    site: {
      siteMetadata: {
        title: 'Test Site',
      },
    },
  };
  const themeSitePluginData = {
    sitePlugin: {
      pluginOptions: {
        githubRepository: {
          project: 'test-project/test-project',
        },
      },
    },
  };
  (useStaticQuery as jest.Mock).mockImplementation((query) => {
    if (/query githubRepositry/.test(query)) {
      return themeSitePluginData;
    } else {
      return mockGraphQLData;
    }
  });

  window.scrollBy = jest.fn();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('should render in success', async () => {
  const markdownData = {
    frontmatter: {
      title: 'Test Title',
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

  // areas
  expect(screen.getByRole('navigation', { name: 'table of contents' })).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();

  // prism alias
  await waitFor(() => expect(container.querySelectorAll('pre.language-bash')).toHaveLength(2));
  await waitFor(() => expect(container.querySelectorAll('code.language-bash')).toHaveLength(1));
  await waitFor(() => expect(container.querySelectorAll('code.language-mysh')).toHaveLength(1));
  await waitFor(() => expect(container.querySelectorAll('pre.language-text')).toHaveLength(1));
  await waitFor(() => expect(container.querySelectorAll('code.language-unksh')).toHaveLength(1));
});

test('edit, preview, cancel', async () => {
  const markdownData = {
    frontmatter: {
      title: 'Test Title',
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
  render(<Page data={data} pageContext={{ slug: '/hello' }} />);

  const heading = screen.getByText('Heading 1', { selector: 'h1' });
  expect(heading).toBeInTheDocument();

  // 1. double click on content to open editbox
  await userEvent.dblClick(heading);
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: 'markdown source' })).toBeInTheDocument(),
  );

  // 2. edit markdown source
  const textbox = screen.getByRole('textbox', { name: 'markdown source' });
  await userEvent.type(textbox, '\n\n# Heading 2');

  // 3. click preview button, and content changes
  await userEvent.click(screen.getByRole('button', { name: 'preview' }));
  await screen.findByText('Heading 2', { selector: 'h1' });

  // 4. click cancel button, and the changes are reverted
  await userEvent.click(screen.getByRole('button', { name: 'cancel' }));
  await waitFor(() =>
    expect(screen.queryByRole('textbox', { name: 'markdown source' })).not.toBeInTheDocument(),
  );
  expect(screen.queryByText('Heading 2', { selector: 'h1' })).not.toBeInTheDocument();
}, 10000);
