import { CreateNodeArgs, CreateSchemaCustomizationArgs } from 'gatsby';
import * as path from 'path';

export async function updateImageSharpNodes(args: CreateNodeArgs): Promise<void> {
  const { createNodeField } = args.actions;
  if (args.node.internal.type === `ImageSharp`) {
    const parentFile = args.getNode(args.node.parent!);
    if (!parentFile) {
      args.reporter.panicOnBuild('failed to update image nodes');
    } else {
      const imagePath = path.join('/', parentFile!.relativePath as string);
      createNodeField({
        node: args.node,
        name: `imagePath`,
        value: imagePath,
      });
    }
  }
}

export function updateImageSharpSchema({ actions, _schema }: CreateSchemaCustomizationArgs): void {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type ImageSharp implements Node {
      fields: ImageSharpFields
    }
    type ImageSharpFields {
      imagePath: String!
    }
    `,
  ];
  createTypes(typeDefs);
}
