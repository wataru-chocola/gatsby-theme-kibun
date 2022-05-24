import { useStaticQuery } from 'gatsby';
import React from 'react';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { initialState } from '../state/store';
import merge from 'deepmerge';

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

const markdownData = {
  frontmatter: {
    title: 'Test Title',
  },
  breadcrumbs: [{ slug: '/aaa', title: 'AAA' }, { slug: '/bbb' }, { slug: '/ccc', title: 'CCC' }],
  parent: {
    relativePath: 'testpage/index.md',
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
const basePageData = {
  markdown: markdownData,
  prismAliasMap,
};

test('should render in success', async () => {
  const testMarkdown = `# Heading 1

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
`;

  const testData = merge(basePageData, {
    markdown: { parent: { internal: { content: testMarkdown } } },
  });
  // @ts-ignore
  const { container } = render(<Page data={testData} pageContext={{ slug: '/testpage' }} />);

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
  // @ts-ignore
  render(<Page data={basePageData} pageContext={{ slug: '/testpage' }} />);

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

test('edit, save while logged in', async () => {
  // @ts-ignore
  render(<Page data={basePageData} pageContext={{ slug: '/testpage' }} />, {
    preloadedState: Object.assign({}, initialState, {
      login: { isLoggedIn: true, token: 'xxx', state: 'succeededDone' },
    }),
  });

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

  // 3. click save button, and content changes
  await userEvent.click(screen.getByRole('button', { name: 'save' }));
  await waitFor(() =>
    expect(screen.queryByRole('textbox', { name: 'markdown source' })).not.toBeInTheDocument(),
  );
  await screen.findByText('Heading 2', { selector: 'h1' });

  await screen.findByText('saving changes');
  await screen.findByText('success!');
});
