import {
  CreatePagesArgs,
  CreateNodeArgs,
  CreateSchemaCustomizationArgs,
  CreateWebpackConfigArgs,
  CreateResolversArgs,
  ParentSpanPluginArgs,
} from 'gatsby';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import {
  transformFileToMarkdown,
  modifyMarkdownSchema,
  createMarkdownResolvers,
} from './createMarkdownNodes';
import { createMarkdownPages } from './createMarkdownPages';
import { pluginOptionsSchema, PluginOptionsType } from './pluginOptions';

const defaultIndexContent = `
---
title: "Top page"
date: ${new Date().toISOString()}
---

Welcome to gatsby-theme-kibun Wiki!
`;

exports.pluginOptionsSchema = pluginOptionsSchema;

exports.onPreBootstrap = (
  { store, reporter }: ParentSpanPluginArgs,
  options: PluginOptionsType,
) => {
  const { program } = store.getState();
  const mdDir = path.resolve(program.directory, options.markdownDir);

  if (!fs.existsSync(mdDir)) {
    reporter.log(`the ${mdDir} directory not found`);
    reporter.log(`initializing the ${mdDir} directory`);
    mkdirp.sync(mdDir);

    const indexFile = path.resolve(mdDir, 'index.md');
    fs.writeFileSync(indexFile, defaultIndexContent);
  }
};

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
