module.exports = (options) => ({
  plugins: [
    //{
    //  resolve: 'gatsby-plugin-eslint',
    //  options: {
    //    test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
    //    exclude: /(node_modules|.cache|public)/,
    //    stages: ['develop'],
    //    options: {
    //      emitWarning: true,
    //      failOnError: true,
    //    },
    //  },
    //},
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        failOnError: false,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `${__dirname}/src/__generated__/gatsby-types.ts`,
        emitSchema: {
          [`${__dirname}/src/__generated__/gatsby-schema.graphql`]: true,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdowns`,
        path: options.markdownDir,
      },
    },

    `gatsby-plugin-material-ui`,
  ],
});
