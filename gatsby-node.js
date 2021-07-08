'use strict';

require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'esnext',
  },
});

require('./src/__generated__/gatsby-types');

const {
  createPages,
  onCreateNode,
  onCreateWebpackConfig,
  createSchemaCustomization,
} = require('./src/gatsby-node/index');

exports.createPages = createPages;
exports.onCreateNode = onCreateNode;
exports.onCreateWebpackConfig = onCreateWebpackConfig;
exports.createSchemaCustomization = createSchemaCustomization;
