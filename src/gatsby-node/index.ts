import { CreatePagesArgs, CreateNodeArgs } from 'gatsby';
import * as path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';

exports.onCreateNode = ({ node, getNode, actions }: CreateNodeArgs) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `src/markdowns` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

interface MarkdownPathQuery {
  allMarkdownRemark: {
    edges: Array<{
      node: {
        fields: {
          slug: string;
        };
      };
    }>;
  };
}

exports.createPages = async ({ graphql, actions, reporter }: CreatePagesArgs) => {
  const { createPage } = actions;
  const result = await graphql<MarkdownPathQuery>(
    `
      query MarkdownPath {
        allMarkdownRemark {
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

  result.data?.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug;
    createPage({
      path: slug,
      component: path.resolve('./src/templates/page.tsx'),
      context: {
        slug: slug,
      },
    });
  });
};
