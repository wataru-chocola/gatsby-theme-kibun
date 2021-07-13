'use strict';

require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'esnext',
  },
  transpileOnly: true,
});

require('./src/__generated__/gatsby-types');

const requireESM = require('esm')(module);

const {
  createPages,
  onCreateNode,
  onCreateWebpackConfig,
  createSchemaCustomization,
  createResolvers,
} = requireESM('./src/gatsby-node/index');

exports.createPages = createPages;
exports.onCreateNode = onCreateNode;
exports.onCreateWebpackConfig = onCreateWebpackConfig;
exports.createSchemaCustomization = createSchemaCustomization;
exports.createResolvers = createResolvers;
