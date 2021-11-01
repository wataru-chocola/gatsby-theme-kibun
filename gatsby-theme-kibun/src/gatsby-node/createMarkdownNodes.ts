import {
  CreateNodeArgs,
  CreateSchemaCustomizationArgs,
  CreateResolversArgs,
  Node,
  NodeInput,
} from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';

import mapValues from 'lodash/mapValues';
import isDate from 'lodash/isDate';
import { getImagePaths } from './getImagePaths';
import matter from 'gray-matter';

export async function transformFileToMarkdown({
  node,
  getNode,
  loadNodeContent,
  createNodeId,
  createContentDigest,
  actions,
  reporter,
}: CreateNodeArgs): Promise<Node | undefined> {
  const content = await loadNodeContent(node);
  const { createNode, createNodeField, createParentChildLink } = actions;
  try {
    const data = matter(content);
    if (data.data) {
      data.data = mapValues(data.data, (value) => {
        if (isDate(value)) {
          return value.toJSON();
        }
        return value;
      });
    }

    const markdownNode: NodeInput = {
      id: createNodeId(`${node.id} >>> Markdown`),
      children: [],
      parent: node.id,
      internal: {
        content: data.content,
        type: `Markdown`,
        contentDigest: '',
      },
    };

    markdownNode.frontmatter = {
      title: ``, // always include a title
      ...data.data,
    };

    markdownNode.rawMarkdownBody = data.content;

    if (node.internal.type === `File`) {
      markdownNode.fileAbsolutePath = node.absolutePath;
    }

    markdownNode.internal.contentDigest = createContentDigest(markdownNode);
    createNode(markdownNode);

    const markdownNodeCreated = markdownNode as Node;
    createParentChildLink({ parent: node, child: markdownNodeCreated });

    const slug = createFilePath({
      node: markdownNodeCreated,
      getNode: getNode,
      basePath: `src/markdowns`,
    });
    createNodeField({
      node: markdownNodeCreated,
      name: `slug`,
      value: slug,
    });

    const imagePaths = await getImagePaths(data.content, slug);
    createNodeField({
      node: markdownNodeCreated,
      name: `images`,
      value: imagePaths,
    });

    return markdownNodeCreated;
  } catch (err) {
    const errmsg = err instanceof Error ? err.message : String(err);
    reporter.panicOnBuild(
      `Error processing Markdown ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
        ${errmsg}`,
    );
    return;
  }
}

export function updateMarkdownSchema({ actions }: CreateSchemaCustomizationArgs): void {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type Markdown implements Node {
      fields: MarkdownFields
    }
    type MarkdownFields {
      images: [ImageSharp] @link(by: "fields.imagePath")
    }
    type BreadCrumb {
      slug: String!
      title: String
    }
    `,
  ];
  createTypes(typeDefs);
}

const makeSubPaths: (slug: string) => string[] = (slug) => {
  if (slug.endsWith('/')) {
    slug = slug.slice(0, -1);
  }
  const pathElems = slug.split('/');
  const subPaths: string[] = [];
  if (pathElems.length >= 1) {
    for (let i = 0; i < pathElems.length; i++) {
      subPaths.push(pathElems.slice(0, i + 1).join('/') + '/');
    }
  }
  return subPaths;
};

interface MarkdownNode {
  frontmatter: {
    title: string;
  };
  fields: {
    slug: string;
  };
}

interface nodeContext {
  nodeModel: {
    findOne: <T>(args: any, pageDependencies?: any) => Promise<T>;
  };
}

export async function createMarkdownResolvers({
  createResolvers,
}: CreateResolversArgs): Promise<void> {
  const resolvers = {
    Markdown: {
      breadcrumbs: {
        type: [`BreadCrumb`],
        resolve: async (source: MarkdownNode, _args: any, context: nodeContext, _info: any) => {
          const subPaths = makeSubPaths(source.fields.slug);
          return await Promise.all(
            subPaths.map(async (subPath) => {
              const tmpNode = await context.nodeModel.findOne<MarkdownNode>({
                type: 'Markdown',
                query: {
                  filter: {
                    fields: { slug: { eq: subPath } },
                  },
                },
              });
              return {
                slug: subPath,
                title: tmpNode?.frontmatter?.title,
              };
            }),
          );
        },
      },
    },
  };
  createResolvers(resolvers);
}
