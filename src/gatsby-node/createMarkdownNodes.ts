import { CreateNodeArgs, CreateSchemaCustomizationArgs, Node, NodeInput } from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';

import * as _ from 'lodash';
import { getImagePaths } from './getImagePaths';
import * as matter from 'gray-matter';

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
      data.data = _.mapValues(data.data, (value) => {
        if (_.isDate(value)) {
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
    reporter.panicOnBuild(
      `Error processing Markdown ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
        ${err.message}`,
    );
    return;
  }
}

export function modifyMarkdownSchema({ actions, schema }: CreateSchemaCustomizationArgs): void {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type Markdown implements Node {
        fields: MarkdownFields
    }
    type MarkdownFields {
      images: [ImageSharp] @link(by: "fields.imagePath")
    }
    `,
  ];
  createTypes(typeDefs);
}
