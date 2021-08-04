import {
  CreatePagesArgs,
  CreateNodeArgs,
  CreateSchemaCustomizationArgs,
  CreateWebpackConfigArgs,
  CreateResolversArgs,
} from 'gatsby';
import * as path from 'path';
import {
  transformFileToMarkdown,
  modifyMarkdownSchema,
  createMarkdownResolvers,
} from './createMarkdownNodes';
import { createMarkdownPages } from './createMarkdownPages';

exports.onCreateNode = async (args: CreateNodeArgs) => {
  const { createNodeField } = args.actions;
  if (args.node.internal.type === `ImageSharp`) {
    const parentFile = args.getNode(args.node.parent!);
    const imagePath = path.join('/', parentFile.relativePath as string);
    createNodeField({
      node: args.node,
      name: `imagePath`,
      value: imagePath,
    });
  }

  if (
    args.node.internal.mediaType === 'text/markdown' ||
    args.node.internal.mediaType === 'text/x-markdown'
  ) {
    return await transformFileToMarkdown(args);
  }
};

exports.createSchemaCustomization = (args: CreateSchemaCustomizationArgs) => {
  modifyMarkdownSchema(args);
};

exports.createResolvers = (args: CreateResolversArgs) => {
  createMarkdownResolvers(args);
};

exports.createPages = async (args: CreatePagesArgs) => {
  await createMarkdownPages(args);
};

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.provide({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
  });
};
