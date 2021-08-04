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
  pluginOptionsSchema,
  onPreBootstrap,
  createPages,
  onCreateNode,
  onCreateWebpackConfig,
  createSchemaCustomization,
  createResolvers,
} = requireESM('./src/gatsby-node/index');

exports.pluginOptionsSchema = pluginOptionsSchema;
exports.onPreBootstrap = onPreBootstrap;

exports.createPages = createPages;
exports.onCreateNode = onCreateNode;
exports.onCreateWebpackConfig = onCreateWebpackConfig;
exports.createSchemaCustomization = createSchemaCustomization;
exports.createResolvers = createResolvers;
