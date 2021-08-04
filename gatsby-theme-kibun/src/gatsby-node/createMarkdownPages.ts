import { CreatePagesArgs } from 'gatsby';

interface MarkdownPathQuery {
  allMarkdown: {
    edges: Array<{
      node: {
        fields: {
          slug: string;
        };
      };
    }>;
  };
}

export async function createMarkdownPages({
  graphql,
  actions,
  reporter,
}: CreatePagesArgs): Promise<void> {
  const { createPage } = actions;
  const result = await graphql<MarkdownPathQuery>(
    `
      query MarkdownPath {
        allMarkdown {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `,
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  result.data?.allMarkdown.edges.forEach(({ node }) => {
    const slug = node.fields.slug;
    createPage({
      path: slug,
      component: require.resolve('../templates/page.tsx'),
      context: {
        slug: slug,
      },
    });
  });
}
