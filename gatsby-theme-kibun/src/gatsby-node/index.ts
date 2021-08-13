import {
  CreatePagesArgs,
  CreateNodeArgs,
  CreateSchemaCustomizationArgs,
  CreateWebpackConfigArgs,
  CreateResolversArgs,
  ParentSpanPluginArgs,
  SourceNodesArgs,
} from 'gatsby';
import * as path from 'path';
import * as fs from 'fs';
import {
  transformFileToMarkdown,
  updateMarkdownSchema,
  createMarkdownResolvers,
} from './createMarkdownNodes';
import { createMarkdownPages } from './createMarkdownPages';
import { createSectionMenuSchema, sourceSectionMenuYaml } from './createSectionMenuNodes';
import { updateImageSharpNodes, updateImageSharpSchema } from './updateImageSharpNodes';
import { copyStaticFiles } from './copyStaticFiles';
import { pluginOptionsSchema, PluginOptionsType } from './pluginOptions';

const defaultIndexContent = `---
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
    fs.mkdirSync(mdDir, { recursive: true });

    const indexFile = path.resolve(mdDir, 'index.md');
    fs.writeFileSync(indexFile, defaultIndexContent);
  }
};

exports.sourceNodes = (args: SourceNodesArgs, options: PluginOptionsType) => {
  sourceSectionMenuYaml(args, options);
};

exports.onCreateNode = async (args: CreateNodeArgs, options: PluginOptionsType) => {
  if (args.node.internal.type === `ImageSharp`) {
    await updateImageSharpNodes(args);
  }

  if (
    args.node.internal.mediaType === 'text/markdown' ||
    args.node.internal.mediaType === 'text/x-markdown'
  ) {
    await transformFileToMarkdown(args);
  }

  if (args.node.internal.type === 'File') {
    await copyStaticFiles(args, options);
  }
};

exports.createSchemaCustomization = (args: CreateSchemaCustomizationArgs) => {
  updateMarkdownSchema(args);
  updateImageSharpSchema(args);
  createSectionMenuSchema(args);
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
