'use strict';

require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'esnext',
  },
  transpileOnly: true,
});

require('./src/__generated__/gatsby-types');

const {
  createPages,
  onCreateNode,
  onCreateWebpackConfig,
  createSchemaCustomization,
  createResolvers,
} = require('./src/gatsby-node/index');

exports.createPages = createPages;
exports.onCreateNode = onCreateNode;
exports.onCreateWebpackConfig = onCreateWebpackConfig;
exports.createSchemaCustomization = createSchemaCustomization;
exports.createResolvers = createResolvers;
